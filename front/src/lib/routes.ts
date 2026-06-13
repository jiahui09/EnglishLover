export type ShellRoute = {
  path: string;
  label: string;
  shortLabel: string;
  status: string;
  description: string;
};

export const shellRoutes = [
  {
    path: '/',
    label: '框架总览',
    shortLabel: '总览',
    status: 'M3 页面生成前准备已就绪，业务页面未生成',
    description: '展示工程边界、冻结契约、组件库与路由壳状态。',
  },
  {
    path: '/today',
    label: '今日学习',
    shortLabel: '今日',
    status: '空壳路由已建立，等待真实页面生成',
    description: '仅保留页面外框和建设中提示，不展示任务、进度或学习数据。',
  },
  {
    path: '/vocabulary',
    label: '单词练习',
    shortLabel: '单词',
    status: '空壳路由已建立，等待 M3C 页面生成',
    description: '不接入词库、复习计划、题目或临时数据。',
  },
  {
    path: '/reading',
    label: '阅读练习',
    shortLabel: '阅读',
    status: '空壳路由已建立，等待 M3C 页面生成',
    description: '不展示文章、题目、解析或阅读记录。',
  },
  {
    path: '/penpal',
    label: '受控写信',
    shortLabel: '写信',
    status: '空壳路由已建立，等待 M3C 页面生成',
    description: '不展示联系人、草稿、信件或安全检查结果。',
  },
  {
    path: '/results',
    label: '今日成果',
    shortLabel: '成果',
    status: '空壳路由已建立，等待 M3C 页面生成',
    description: '不展示统计、图表、列表或完成记录。',
  },
  {
    path: '/components',
    label: '组件示例',
    shortLabel: '组件',
    status: '组件库与业务组件演示',
    description: '仅用于组件状态展示和 AI 生成前参考，不承载真实业务数据。',
  },
] as const satisfies ReadonlyArray<ShellRoute>;

export function findShellRoute(path: string): ShellRoute | undefined {
  return shellRoutes.find((route) => route.path === path);
}
