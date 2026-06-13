import { readFile } from 'node:fs/promises';

const catalog = await readFile('src/docs/ai-context/COMPONENT_CATALOG.md', 'utf8');
const required = [
  'Button', 'Card', 'Input', 'Textarea', 'Select', 'Modal', 'Loading', 'Badge', 'Tabs', 'Toast',
  'EmptyState', 'ErrorState', 'SaveStatus', 'FeedbackPanel', 'ProgressIndicator', 'Skeleton',
  'RetryPanel', 'InlineAlert', 'ConfirmDialog', 'StepIndicator',
  'StatCard', 'DataList', 'Timeline', 'ProgressChartContainer', 'SummaryPanel', 'TagList',
  'TaskActionCard', 'TodayTaskList', 'PracticeQuestion', 'VocabularyReviewPanel',
  'ReviewResultFeedback', 'WordStatusBadge', 'LearningProgressSummary', 'ReadingArticlePanel',
  'ReadingQuestionPanel', 'ReadingWordAction', 'ReadingProgressHeader', 'LetterEditor',
  'SafetyNotice', 'SafetyCheckStatus', 'SafetyHighlight', 'PenpalThreadList', 'LetterTimeline',
  'ResultSummary', 'ModuleSummaryGrid', 'DailyGoalProgress', 'RecentActivityList',
];
const violations = [];

for (const component of required) {
  const line = catalog.split('\n').find((entry) => entry.startsWith(`| ${component} |`));
  if (!line) {
    violations.push(`${component}: 缺少 AI 可消费组件摘要。`);
    continue;
  }
  const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
  if (cells.length !== 5) {
    violations.push(`${component}: catalog 必须只有 5 列：组件名、路径、Props、使用场景、反模式。`);
    continue;
  }
  if (!cells[1].startsWith('`src/components/') || !cells[2].includes('Props') || cells[3].length < 6 || cells[4].length < 6) {
    violations.push(`${component}: 摘要字段不完整或不可供 AI 直接消费。`);
  }
}

if (violations.length > 0) {
  console.error('组件 catalog 检查失败：');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('组件 catalog 检查通过。');
