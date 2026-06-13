import type { ReactNode } from 'react';

import type { ReadingArticleDetail } from './api-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export interface ReadingArticlePanelProps {
  article: ReadingArticleDetail;
  toolbar?: ReactNode;
  footer?: ReactNode;
}

export function ReadingArticlePanel({ article, toolbar, footer }: ReadingArticlePanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle>{article.title}</CardTitle>
            <CardDescription>文章 ID：{article.articleId}</CardDescription>
          </div>
          {toolbar ? <div className="shrink-0">{toolbar}</div> : null}
        </div>
      </CardHeader>
      <CardContent>
        <article className="text-el-main whitespace-pre-wrap leading-8">{article.content}</article>
        {footer ? <div className="border-el-border mt-6 border-t pt-4">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}
