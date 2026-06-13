import { PageHeader, SectionLayout } from '@/components/layout';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

const foundationChecks = [
  '目录边界已建立：pages、features、components、types、lib、styles 分层清晰。',
  '基础、反馈、数据展示和业务组件已集中维护，页面不得重复自绘组件库能力。',
  'src/types/api.ts 已由冻结契约自动生成，前端不得手写接口类型。',
  '路由仍只展示空壳和建设中提示，M3C 前不消费业务接口或临时数据。',
] as const;

export function HomePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="M3 · Page Generation Readiness"
        title="EnglishLover Web 端页面生成前准备"
        description="当前已交付前端底座、组件库、业务组件、冻结 API 类型和 AI Studio 输入包。业务页面、真实接口消费和业务数据展示仍留到 M3C/M4。"
        status="生成前准备完成，业务页待生成"
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>本轮边界</CardTitle>
            <CardDescription>
              用于提醒后续 AI Studio 生成页面和真实接口接入的硬约束。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-el-subtle grid gap-3 text-sm">
              {foundationChecks.map((item) => (
                <li key={item} className="flex gap-3">
                  <Badge variant="success" size="sm">
                    Ready
                  </Badge>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card variant="subtle">
          <CardHeader>
            <CardTitle>协作状态</CardTitle>
            <CardDescription>尊重“后端完全先行”和冻结契约流程。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-el-subtle text-sm">
              后端契约已冻结并自动生成
              <code className="rounded-tokenSm bg-el-muted text-el-main mx-1 px-1 py-0.5">
                src/types/api.ts
              </code>
              。前端仍不会猜测接口字段、错误码、枚举或分页结构，M3C 页面生成必须以该文件和 AI 输入包为唯一依据。
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <SectionLayout title="页面状态" description="所有业务范围内路由当前均为壳页面。">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {['今日学习', '单词练习', '阅读练习', '受控写信', '今日成果'].map((name) => (
              <Card key={name} variant="outlined">
                <CardHeader>
                  <CardTitle>{name}</CardTitle>
                  <CardDescription>路由壳已建立，等待 M3C 一次性生成。</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </SectionLayout>
      </div>
    </div>
  );
}
