import { spawn } from 'node:child_process';
import net from 'node:net';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const apiPort = process.env.CONTRACT_API_PORT ?? '18080';
const pgPort = process.env.CONTRACT_POSTGRES_PORT ?? '55432';
const baseURL = process.env.CONTRACT_BASE_URL ?? `http://127.0.0.1:${apiPort}/api/v1`;
const email = process.env.CONTRACT_TEST_EMAIL ?? 'learner@example.com';
const password = process.env.CONTRACT_TEST_PASSWORD ?? 'learner-password';

let tempDir;
let pgProcess;
let apiProcess;
let postgresLogs = '';
let apiLogs = '';
let shuttingDown = false;

async function main() {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'englishlover-test-env-'));
  await assertPortFree(apiPort);
  await assertPortFree(pgPort);
  await startPostgres();
  await startAPI();

  console.log(`EnglishLover backend test environment is ready: ${baseURL}`);
  console.log(`Test account: ${email}`);
  console.log('Press Ctrl+C to stop.');

  await waitForStopSignal();
}

async function assertPortFree(port) {
  await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', (error) => {
      if (error?.code === 'EADDRINUSE') {
        reject(new Error(`port ${port} is already in use; stop the existing process before starting the test environment`));
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
  pgProcess = spawn('postgres', ['-D', dataDir, '-k', socketDir, '-p', pgPort], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
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

function waitForStopSignal() {
  return new Promise((resolve) => {
    const stop = () => resolve();
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
  });
}

async function cleanup() {
  if (shuttingDown) return;
  shuttingDown = true;
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
