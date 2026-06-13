import type { ReactNode } from 'react';

import type { ReviewSubmitResult, WordListData } from './api-types';
import { WordStatusBadge } from './WordStatusBadge';
import { DataList, SummaryPanel } from '@/components/data-display';
import { EmptyState, FeedbackPanel } from '@/components/feedback';
import { Badge } from '@/components/ui';

export interface VocabularyReviewPanelProps {
  wordList: WordListData;
  activeWordId?: string;
  lastResult?: ReviewSubmitResult;
  action?: ReactNode;
}

export function VocabularyReviewPanel({
  wordList,
  activeWordId,
  lastResult,
  action,
}: VocabularyReviewPanelProps) {
  return (
    <div className="grid gap-5">
      <SummaryPanel
        title="词汇复习概览"
        description="只展示页面层传入的真实词库分页数据。"
        items={[
          { id: 'total', label: '总数', content: wordList.total },
          { id: 'page', label: '当前页', content: wordList.page },
          { id: 'pageSize', label: '每页数量', content: wordList.pageSize },
        ]}
        actions={action}
      />
      {lastResult ? (
        <FeedbackPanel tone="success" title="最近一次提交结果">
          状态：{lastResult.status}
          {lastResult.nextReviewAt ? `；下次复习时间：${lastResult.nextReviewAt}` : ''}
        </FeedbackPanel>
      ) : null}
      <DataList
        ariaLabel="词汇复习列表"
        empty={<EmptyState title="暂无词汇" description="当前筛选条件下没有词汇记录。" />}
        items={wordList.items.map((word) => ({
          id: word.wordId,
          title: word.text,
          ...(word.phonetic ? { description: word.phonetic } : {}),
          meta: (
            <div className="flex flex-wrap gap-2">
              <WordStatusBadge stage={word.stage} />
              {word.wordId === activeWordId ? <Badge variant="success" size="sm">当前</Badge> : null}
            </div>
          ),
        }))}
      />
    </div>
  );
}
