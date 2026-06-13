import { PageHeader } from '@/components/layout';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { navigateTo } from '@/lib/navigation';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="404"
        title="页面不存在或尚未纳入本轮路由"
        description="第一轮只建立已确认范围内的空壳路由。未登记路径不会扩展成临时业务页面。"
      />
      <Card>
        <CardHeader>
          <CardTitle>返回框架总览</CardTitle>
          <CardDescription>继续查看已建立的基础骨架和组件示例。</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigateTo('/')}>返回总览</Button>
        </CardContent>
      </Card>
    </div>
  );
}
