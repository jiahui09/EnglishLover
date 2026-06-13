import { useState } from 'react';

import {
  ConfirmDialog,
  DailyGoalProgress,
  DataList,
  EmptyState,
  ErrorState,
  FeedbackPanel,
  InlineAlert,
  LearningProgressSummary,
  LetterEditor,
  LetterTimeline,
  ModuleSummaryGrid,
  PageHeader,
  PenpalThreadList,
  PracticeQuestion,
  ProgressChartContainer,
  ProgressIndicator,
  ReadingArticlePanel,
  ReadingProgressHeader,
  ReadingQuestionPanel,
  ReadingWordAction,
  RecentActivityList,
  RetryPanel,
  ResultSummary,
  ReviewResultFeedback,
  SaveStatus,
  SectionLayout,
  SafetyCheckStatus,
  SafetyHighlight,
  SafetyNotice,
  Skeleton,
  StatCard,
  StepIndicator,
  SummaryPanel,
  TagList,
  TaskActionCard,
  Timeline,
  TodayTaskList,
  VocabularyReviewPanel,
  WordStatusBadge,
} from '@/components';
import type {
  AddToWordLearningQueueResult,
  DailySummary,
  PenpalThreadSummary,
  ReadingArticleDetail,
  ReadingArticleSummary,
  ReviewEvent,
  ReviewSubmitResult,
  SendPenpalLetterRequest,
  WordListData,
  WordSummary,
} from '@/components/business/api-types';
import type { LetterTimelineItem } from '@/components/business/LetterTimeline';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Loading,
  Modal,
  Select,
  Tabs,
  Textarea,
  useToast,
} from '@/components/ui';

const selectOptions = [
  { value: 'default', label: '默认选项' },
  { value: 'support', label: '辅助选项' },
  { value: 'disabled', label: '禁用选项', disabled: true },
] as const;

const stepItems = [
  { id: 'structure', label: '结构', description: '目录和边界已建立。', status: 'complete' },
  { id: 'components', label: '组件', description: '组件 API 可供复用。', status: 'current' },
  { id: 'contract', label: '契约', description: '冻结类型已生成。', status: 'complete' },
] as const;

const displayItems = [
  {
    id: 'component-a',
    title: '展示项 A',
    description: '仅用于 DataList 结构展示，不代表业务记录。',
    meta: <Badge size="sm">示例</Badge>,
  },
  {
    id: 'component-b',
    title: '展示项 B',
    description: '用于说明列表标题、描述和状态标签的组合方式。',
    meta: (
      <Badge variant="info" size="sm">
        组件
      </Badge>
    ),
  },
] as const;

const timelineItems = [
  {
    id: 'one',
    title: '组件状态整理',
    description: '演示时间线结构。',
    time: 'Step 1',
    tone: 'info',
  },
  {
    id: 'two',
    title: '文档摘要补齐',
    description: '演示非业务事件说明。',
    time: 'Step 2',
    tone: 'success',
  },
] as const;

const tags = [
  { id: 'base', label: '基础组件', tone: 'info' },
  { id: 'feedback', label: '反馈状态', tone: 'success' },
  { id: 'display', label: '数据展示', tone: 'neutral' },
] as const;

const contractWord = {
  wordId: 'wordId',
  text: 'word.text',
  phonetic: 'phonetic',
  stage: 'general',
} satisfies WordSummary;

const contractWordList = {
  items: [contractWord],
  page: 1,
  pageSize: 1,
  total: 1,
} satisfies WordListData;

const contractReviewResult = {
  reviewEventId: 'reviewEventId',
  status: 'accepted',
} satisfies ReviewSubmitResult;

const contractArticleSummary = {
  articleId: 'articleId',
  title: 'article.title',
  level: 'level',
} satisfies ReadingArticleSummary;

const contractArticleDetail = {
  articleId: 'articleId',
  title: 'article.title',
  content: 'article.content 字段展示区；组件只负责排版，不读取接口或生成阅读材料。',
} satisfies ReadingArticleDetail;

const contractQueueResult = {
  status: 'success',
  source: 'reading',
} satisfies AddToWordLearningQueueResult;

const contractLetterDraft = {
  threadId: 'threadId',
  body: 'body 字段由页面状态传入；组件不保存草稿、不发送请求。',
} satisfies SendPenpalLetterRequest;

const contractThreads = [
  {
    threadId: 'threadId',
    status: 'active',
  },
] satisfies PenpalThreadSummary[];

const contractLetterTimelineItems = [
  {
    letterId: 'letterId',
    activityType: 'letter_sent',
    occurredAt: 'occurredAt',
  },
] satisfies LetterTimelineItem[];

const contractDailySummary = {
  date: 'date',
  wordCompletedCount: 0,
  readingCompletedCount: 0,
  writingCompletedCount: 0,
  taskCompletionRate: 0,
  streakIncluded: false,
} satisfies DailySummary;

const contractReviewEvents = [
  {
    eventId: 'eventId',
    module: 'word',
    occurredAt: 'occurredAt',
  },
] satisfies ReviewEvent[];

export function ComponentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { notify } = useToast();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Component Demo"
        title="组件库示例"
        description="本页仅展示基础、反馈、状态和数据展示组件的标准状态与组合方式；所有内容均为组件说明文案，不代表业务流程、用户数据或接口结果。"
        status="仅组件演示"
      />

      <div className="grid gap-8">
        <SectionLayout
          title="P0 基础组件"
          description="统一操作、容器、输入、弹层、加载和局部切换。"
        >
          <div className="grid gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Button>主按钮</Button>
                  <Button variant="secondary">次按钮</Button>
                  <Button variant="ghost">弱按钮</Button>
                  <Button variant="danger">危险按钮</Button>
                  <Button isLoading>处理中</Button>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge>默认</Badge>
                  <Badge variant="info">信息</Badge>
                  <Badge variant="success">成功</Badge>
                  <Badge variant="warning">警告</Badge>
                  <Badge variant="danger">危险</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>标准卡片</CardTitle>
                  <CardDescription>卡片只提供容器和层级，不内置业务语义。</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <Input
                      label="输入框"
                      placeholder="请输入演示文本"
                      helperText="用于展示普通输入状态。"
                    />
                    <Input label="错误状态" value="" readOnly error="这里展示字段错误提示。" />
                  </div>
                </CardContent>
              </Card>

              <Card variant="subtle">
                <CardHeader>
                  <CardTitle>组合表单</CardTitle>
                  <CardDescription>表单控件负责标签、帮助文案、错误和禁用状态。</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <Select label="选择器" placeholder="请选择" options={selectOptions} />
                    <Textarea
                      label="文本域"
                      placeholder="请输入多行演示文本"
                      helperText="仅用于组件展示。"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="grid gap-5 pt-6">
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => setModalOpen(true)}>
                    打开弹窗
                  </Button>
                  <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
                    打开确认框
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      notify({
                        title: '组件提示',
                        description: '这是 Toast 组件的演示提示，不代表业务结果。',
                        tone: 'success',
                      })
                    }
                  >
                    展示 Toast
                  </Button>
                </div>
                <Loading variant="block" label="组件加载状态展示" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Tabs
                  items={[
                    {
                      id: 'usage',
                      label: '使用规则',
                      content: (
                        <p className="text-el-subtle text-sm">
                          优先复用基础组件，不重复封装按钮、卡片和输入控件。
                        </p>
                      ),
                    },
                    {
                      id: 'boundary',
                      label: '边界',
                      content: (
                        <p className="text-el-subtle text-sm">
                          业务字段必须来自已生成的 API 类型，组件示例不得演化为业务页。
                        </p>
                      ),
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </SectionLayout>

        <SectionLayout
          title="反馈与状态组件"
          description="统一空、错、保存、进度、骨架、重试、提示、确认和步骤表达。"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <EmptyState
              title="暂无组件内容"
              description="空状态说明为空原因，并提供可选行动入口。"
              action={<Button variant="secondary">可选行动</Button>}
            />
            <ErrorState
              description="错误状态说明发生了什么、可能原因和下一步操作。"
              onAction={() => undefined}
            />
            <FeedbackPanel tone="success" title="反馈面板">
              用于展示明确反馈和后续行动，不直接计算业务结论。
            </FeedbackPanel>
            <RetryPanel
              title="重试面板"
              description="用于可恢复操作失败后的重试入口。"
              onRetry={() => undefined}
            />
          </div>

          <div className="mt-6 grid gap-6">
            <Card>
              <CardContent className="grid gap-5 pt-6">
                <InlineAlert tone="warning" title="内联提示">
                  提示信息必须包含文字说明，不能只依赖颜色。
                </InlineAlert>
                <div className="flex flex-wrap gap-3">
                  <SaveStatus status="idle" />
                  <SaveStatus status="saving" />
                  <SaveStatus status="saved" />
                  <SaveStatus status="error" />
                  <SaveStatus status="offline" />
                </div>
                <ProgressIndicator label="组件进度" value={64} tone="primary" />
                <Skeleton variant="card" lines={3} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <StepIndicator steps={stepItems} />
              </CardContent>
            </Card>
          </div>
        </SectionLayout>

        <SectionLayout
          title="数据展示组件"
          description="只展示传入内容的结构，不生成或推断业务数据。"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard label="指标卡 A" value="—" description="等待真实数据输入。" />
            <StatCard
              label="指标卡 B"
              value="—"
              description="展示组件结构。"
              trendLabel="示例"
              tone="info"
            />
            <StatCard
              label="指标卡 C"
              value="—"
              description="不自行计算统计。"
              trendLabel="占位"
              tone="neutral"
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <DataList items={displayItems} />
            <Timeline items={timelineItems} />
            <ProgressChartContainer title="图表容器" description="容器不绑定具体图表库或业务口径。">
              <div className="text-el-subtle grid h-full min-h-40 place-items-center text-center text-sm">
                图表占位区域：等待真实统计口径和图表实现策略。
              </div>
            </ProgressChartContainer>
            <SummaryPanel
              title="摘要面板"
              description="用于组合展示若干已传入字段。"
              items={[
                { id: 'one', label: '摘要项 A', content: '—' },
                { id: 'two', label: '摘要项 B', content: '—' },
                { id: 'three', label: '摘要项 C', content: '—' },
              ]}
            />
          </div>

          <div className="mt-6">
            <TagList tags={tags} />
          </div>
        </SectionLayout>

        <SectionLayout
          title="业务组件货架"
          description="只展示可供后续页面编排的业务 UI 单元；传入值均为字段形态演示，不代表真实用户、课程、学习记录或接口结果。"
        >
          <div className="grid gap-6 xl:grid-cols-2">
            <TaskActionCard
              module="word"
              title="title 字段"
              description="description 字段由第三轮页面层从真实契约数据传入。"
              status="active"
              progressValue={0}
              action={<Button variant="secondary">action 插槽</Button>}
              meta={<Badge variant="info">meta 插槽</Badge>}
            />

            <TodayTaskList
              items={[
                {
                  id: 'taskId',
                  module: 'reading',
                  title: 'title 字段',
                  description: '任务列表项只接收页面层传入内容。',
                  status: 'active',
                  actionLabel: 'actionLabel',
                },
              ]}
            />

            <PracticeQuestion
              word={contractWord}
              mode="recognition"
              prompt="prompt 字段展示区"
              options={[
                { id: 'optionA', label: 'option.label A' },
                { id: 'optionB', label: 'option.label B' },
              ]}
              selectedOptionId="optionA"
              feedback={<ReviewResultFeedback result={contractReviewResult} />}
            />

            <VocabularyReviewPanel
              wordList={contractWordList}
              activeWordId={contractWord.wordId}
              lastResult={contractReviewResult}
              action={<WordStatusBadge stage="general" />}
            />

            <div className="grid gap-5">
              <ReadingProgressHeader article={contractArticleSummary} progressValue={0} />
              <ReadingArticlePanel
                article={contractArticleDetail}
                footer={
                  <ReadingWordAction
                    articleId={contractArticleDetail.articleId}
                    wordId={contractWord.wordId}
                    result={contractQueueResult}
                  />
                }
              />
            </div>

            <ReadingQuestionPanel
              articleId={contractArticleSummary.articleId}
              title="阅读题组件"
              prompt="prompt 字段展示区"
              options={[
                { id: 'choiceA', label: 'option.label A' },
                { id: 'choiceB', label: 'option.label B' },
              ]}
              selectedOptionId="choiceA"
              feedback={<FeedbackPanel title="反馈插槽">feedback 由页面层传入。</FeedbackPanel>}
            />

            <div className="grid gap-5">
              <LetterEditor
                draft={contractLetterDraft}
                saveStatus="idle"
                safetySlot={
                  <SafetyCheckStatus
                    state="needs_review"
                    description="安全状态由页面层或真实接口结果决定。"
                  />
                }
                actions={<Button variant="secondary">actions 插槽</Button>}
              />
              <SafetyNotice tone="warning" title="安全提示组件">
                <span className="grid gap-3">
                  <span>用于展示固定安全说明，不在组件内判断文本风险。</span>
                  <SafetyHighlight label="片段">children 字段</SafetyHighlight>
                </span>
              </SafetyNotice>
            </div>

            <div className="grid gap-5">
              <PenpalThreadList threads={contractThreads} />
              <LetterTimeline items={contractLetterTimelineItems} />
            </div>

            <div className="grid gap-5">
              <LearningProgressSummary summary={contractDailySummary} />
              <ResultSummary summary={contractDailySummary} />
            </div>

            <div className="grid gap-5">
              <DailyGoalProgress summary={contractDailySummary} />
              <ModuleSummaryGrid summary={contractDailySummary} />
              <RecentActivityList events={contractReviewEvents} />
            </div>
          </div>
        </SectionLayout>
      </div>

      <Modal
        open={modalOpen}
        title="Modal 组件"
        description="弹窗用于需要明确上下文的短任务；本页仅展示组件交互能力。"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setModalOpen(false)}>确认</Button>
          </>
        }
      >
        <p className="text-el-subtle text-sm">
          弹窗内容通过 children 组合，组件本身不请求接口、不保存业务状态，也不假设任何后端字段。
        </p>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="ConfirmDialog 组件"
        description="确认框用于需要用户明确确认的操作，但不内置业务行为。"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
      >
        <p className="text-el-subtle text-sm">这里展示确认说明区域。</p>
      </ConfirmDialog>
    </div>
  );
}
