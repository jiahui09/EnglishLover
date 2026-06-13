import { PageHeader } from '@/components/layout';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import type { ShellRoute } from '@/lib/routes';

export function ShellPlaceholderPage({ route }: { route: ShellRoute }) {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Shell Route"
        title={route.label}
        description={route.description}
        status={route.status}
      />

      <Card>
        <CardHeader>
          <CardTitle>功能建设中</CardTitle>
          <CardDescription>
            这里仅保留全局布局、路由入口和页面内容槽位，供后续真实页面生成时接入。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-tokenLg border-el-border text-el-subtle grid gap-4 border border-dashed p-6 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">未接接口</Badge>
              <Badge variant="warning">未写业务页</Badge>
              <Badge>无临时数据</Badge>
            </div>
            <p>
              后续只有在 G2 业务组件冻结审核和 G3 AI 输入包审核通过后，才允许通过 AI Studio
              一次性生成真实业务页面。当前页面不得加入列表、卡片、表格、用户信息、学习记录或课程内容。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
