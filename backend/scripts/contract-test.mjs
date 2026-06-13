import { spawn } from 'node:child_process';
import net from 'node:net';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import YAML from 'yaml';

const root = process.cwd();
const apiPort = process.env.CONTRACT_API_PORT ?? '18080';
const pgPort = process.env.CONTRACT_POSTGRES_PORT ?? '55432';
const baseURL = process.env.CONTRACT_BASE_URL ?? `http://127.0.0.1:${apiPort}/api/v1`;
const email = process.env.CONTRACT_TEST_EMAIL ?? 'learner@example.com';
const password = process.env.CONTRACT_TEST_PASSWORD ?? 'learner-password';
const spec = YAML.parse(await readFile(path.join(root, 'openapi', 'openapi.yaml'), 'utf8'));
const expectedOperations = Object.values(spec.paths).flatMap((methods) =>
  Object.values(methods).filter((operation) => operation?.operationId).map((operation) => operation.operationId),
);
const covered = new Set();
const failures = [];
let tempDir;
let pgProcess;
let apiProcess;
let postgresLogs = '';
let apiLogs = '';

function log(message) {
  console.log(`[contract] ${message}`);
}

async function main() {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'englishlover-contract-'));
  await assertPortFree(apiPort);
  await assertPortFree(pgPort);
  await startPostgres();
  await startAPI();
  await runCases();
  await writeReport();
  if (failures.length > 0) {
    console.error('契约测试失败：');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  const coverage = Math.round((covered.size / expectedOperations.length) * 100);
  if (coverage !== 100) {
    console.error(`契约测试覆盖率不足：${coverage}% (${covered.size}/${expectedOperations.length})`);
    process.exit(1);
  }
  console.log(`契约测试通过率 100%，operation 覆盖率 100% (${covered.size}/${expectedOperations.length})。`);
}



async function assertPortFree(port) {
  await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', (error) => {
      if (error?.code === 'EADDRINUSE') {
        reject(new Error(`port ${port} is already in use; stop the existing process before running contract tests`));
        return;
      }
      reject(error);
    });
    server.listen(Number(port), '127.0.0.1', () => {
      server.close(resolve);
    });
  });
}

async function startPostgres() {
  const dataDir = path.join(tempDir, 'pgdata');
  const socketDir = path.join(tempDir, 'socket');
  await mkdir(socketDir, { recursive: true });
  await run('initdb', ['-D', dataDir, '-A', 'trust', '-U', 'postgres']);
  pgProcess = spawn('postgres', ['-D', dataDir, '-k', socketDir, '-p', pgPort], { detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
  pgProcess.stdout.on('data', (chunk) => {
    postgresLogs += chunk.toString();
  });
  pgProcess.stderr.on('data', (chunk) => {
    postgresLogs += chunk.toString();
  });
  await wait(500);
  await retry(async () => run('pg_isready', ['-h', socketDir, '-p', pgPort, '-U', 'postgres']), 120, () => postgresLogs);
  await run('createdb', ['-h', socketDir, '-p', pgPort, '-U', 'postgres', 'englishlover_contract']);
  process.env.DATABASE_URL = `postgres://postgres@localhost:${pgPort}/englishlover_contract?host=${encodeURIComponent(socketDir)}`;
}

async function startAPI() {
  apiProcess = spawn('go', ['run', './cmd/api'], {
    cwd: root,
    detached: true,
    env: {
      ...process.env,
      HTTP_ADDR: `:${apiPort}`,
      APP_VERSION: '1.0.0',
      AUTO_MIGRATE: 'true',
      COOKIE_SECURE: 'false',
      CONTRACT_TEST_EMAIL: email,
      CONTRACT_TEST_PASSWORD: password,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  apiLogs = '';
  apiProcess.stdout.on('data', (chunk) => {
    apiLogs += chunk.toString();
  });
  apiProcess.stderr.on('data', (chunk) => {
    apiLogs += chunk.toString();
  });
  await retry(async () => {
    const response = await fetch(`${baseURL}/health`);
    if (!response.ok) throw new Error(`health ${response.status}`);
    const payload = await response.json();
    if (payload?.data?.version !== '1.0.0') throw new Error(`unexpected health payload ${JSON.stringify(payload)}`);
  }, 120, () => apiLogs).catch((error) => {
    throw new Error(`${error.message}\nAPI logs:\n${apiLogs}`);
  });
}

async function runCases() {
  await expectOK('getHealth', fetch(`${baseURL}/health`));
  await expectError('listWords unauthenticated', 'listWords', fetch(`${baseURL}/words`), 401, 'AUTH_REQUIRED');
  await expectError('login invalid', 'login', post('/auth/login', { email, password: 'wrong-password' }), 401, 'AUTH_INVALID');

  const loginResponse = await expectOK('login', post('/auth/login', { email, password }));
  const cookies = cookiesFrom(loginResponse);
  const headers = { Cookie: cookies };

  await expectOK('getCurrentUser', fetch(`${baseURL}/auth/me`, { headers }));
  await expectOK('listWords', fetch(`${baseURL}/words?page=1&pageSize=20`, { headers }));
  await expectError('listWords invalid page', 'listWords', fetch(`${baseURL}/words?page=0`, { headers }), 400, 'VALIDATION_ERROR');
  await expectOK('listReadingArticles', fetch(`${baseURL}/reading/articles?page=1&pageSize=20`, { headers }));
  await expectOK('getReadingArticle', fetch(`${baseURL}/reading/articles/00000000-0000-0000-0000-000000000201`, { headers }));
  await expectError('getReadingArticle missing', 'getReadingArticle', fetch(`${baseURL}/reading/articles/00000000-0000-0000-0000-000000009999`, { headers }), 404, 'NOT_FOUND');
  await expectOK('addToWordLearningQueue', fetch(`${baseURL}/reading/articles/00000000-0000-0000-0000-000000000201/words/00000000-0000-0000-0000-000000000101/queue`, { method: 'POST', headers: { ...headers, 'Idempotency-Key': 'queue-contract-1' } }));
  await expectOK('submitReview', post('/reviews/submit', { wordId: '00000000-0000-0000-0000-000000000101', mode: 'recall', rating: 4, isCorrect: true, durationMs: 1200, clientOccurredAt: '2026-06-13T00:00:00Z' }, { ...headers, 'Idempotency-Key': 'review-contract-1' }));
  await expectError('submitReview idempotency conflict', 'submitReview', post('/reviews/submit', { wordId: '00000000-0000-0000-0000-000000000101', mode: 'recall', rating: 3, isCorrect: true, durationMs: 1200, clientOccurredAt: '2026-06-13T00:00:00Z' }, { ...headers, 'Idempotency-Key': 'review-contract-1' }), 409, 'IDEMPOTENCY_CONFLICT');
  await expectOK('listReviewEvents', fetch(`${baseURL}/review-events?limit=50`, { headers }));
  await expectOK('listPenpalThreads', fetch(`${baseURL}/penpal/threads?page=1&pageSize=20`, { headers }));
  await expectOK('sendPenpalLetter', post('/penpal/letters', { threadId: '00000000-0000-0000-0000-000000000301', body: 'Hello from contract test.' }, { ...headers, 'Idempotency-Key': 'letter-contract-1' }));
  await expectOK('getDailySummary', fetch(`${baseURL}/analytics/daily-summary?date=2026-06-13`, { headers }));
  await expectOK('refreshAuthToken', fetch(`${baseURL}/auth/refresh`, { method: 'POST', headers }));
  await expectOK('logout', fetch(`${baseURL}/auth/logout`, { method: 'POST', headers }), 204);
}

function post(route, body, headers = {}) {
  return fetch(`${baseURL}${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

async function expectOK(name, responsePromise, expectedStatus = 200) {
  const response = await responsePromise;
  if (response.status !== expectedStatus) {
    failures.push(`${name}: expected ${expectedStatus}, got ${response.status} ${await response.text()}`);
    return response;
  }
  covered.add(name);
  if (expectedStatus !== 204) {
    const payload = await response.clone().json();
    if (!payload.requestId || !payload.data) failures.push(`${name}: success response must include requestId and data`);
  }
  return response;
}

async function expectError(label, operation, responsePromise, expectedStatus, expectedCode) {
  const response = await responsePromise;
  if (response.status !== expectedStatus) {
    failures.push(`${label}: expected ${expectedStatus}, got ${response.status} ${await response.text()}`);
    return;
  }
  const payload = await response.json();
  if (!payload.requestId || payload.error?.code !== expectedCode) {
    failures.push(`${label}: expected error code ${expectedCode}, got ${JSON.stringify(payload)}`);
  }
  covered.add(operation);
}

function cookiesFrom(response) {
  const setCookie = response.headers.getSetCookie ? response.headers.getSetCookie() : [response.headers.get('set-cookie')].filter(Boolean);
  return setCookie.map((cookie) => cookie.split(';')[0]).join('; ');
}

async function writeReport() {
  const report = {
    contractVersion: spec.info.version,
    baseURL,
    postgresPort: pgPort,
    totalOperations: expectedOperations.length,
    coveredOperations: [...covered].sort(),
    passRate: failures.length === 0 && covered.size === expectedOperations.length ? '100%' : 'failed',
    failures,
    generatedAt: new Date().toISOString(),
  };
  await mkdir(path.join(root, 'reports'), { recursive: true });
  await writeFile(path.join(root, 'reports', 'contract-test-result.json'), JSON.stringify(report, null, 2));
}

async function run(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} failed: ${stderr}`));
    });
  });
}

async function retry(fn, attempts, diagnostics = () => '') {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      await wait(250);
    }
  }
  const details = diagnostics();
  if (details) {
    throw new Error(`${lastError?.message ?? lastError}\nDiagnostics:\n${details}`);
  }
  throw lastError;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cleanup() {
  await stopProcess(apiProcess);
  await stopProcess(pgProcess);
  if (tempDir) await rm(tempDir, { recursive: true, force: true });
}

async function stopProcess(child) {
  if (!child || child.exitCode !== null) return;
  await new Promise((resolve) => {
    const pid = child.pid;
    const killGroup = (signal) => {
      try {
        process.kill(-pid, signal);
      } catch {
        try {
          child.kill(signal);
        } catch {
          // Process already exited.
        }
      }
    };
    const timer = setTimeout(() => {
      if (child.exitCode === null) killGroup('SIGKILL');
    }, 1000);
    child.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });
    killGroup('SIGTERM');
  });
}

process.on('exit', () => {
  if (apiProcess?.pid) {
    try { process.kill(-apiProcess.pid, 'SIGTERM'); } catch { apiProcess.kill('SIGTERM'); }
  }
  if (pgProcess?.pid) {
    try { process.kill(-pgProcess.pid, 'SIGTERM'); } catch { pgProcess.kill('SIGTERM'); }
  }
});
process.on('SIGINT', async () => {
  await cleanup();
  process.exit(130);
});

let exitCode = 0;
try {
  await main();
} catch (error) {
  exitCode = 1;
  console.error(error);
} finally {
  await cleanup();
}
process.exit(exitCode);
