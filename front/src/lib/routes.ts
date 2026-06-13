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
    status: '基础骨架已建立，业务能力未开始',
    description: '展示第一轮工程边界、目录职责、组件与路由壳状态。',
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
    status: '空壳路由已建立，等待后端契约冻结',
    description: '不接入词库、复习计划、题目或临时数据。',
  },
  {
    path: '/reading',
    label: '阅读练习',
    shortLabel: '阅读',
    status: '空壳路由已建立，等待真实接口类型',
    description: '不展示文章、题目、解析或阅读记录。',
  },
  {
    path: '/penpal',
    label: '受控写信',
    shortLabel: '写信',
    status: '空壳路由已建立，等待安全与通信契约',
    description: '不展示联系人、草稿、信件或安全检查结果。',
  },
  {
    path: '/results',
    label: '今日成果',
    shortLabel: '成果',
    status: '空壳路由已建立，等待真实学习记录',
    description: '不展示统计、图表、列表或完成记录。',
  },
  {
    path: '/components',
    label: '组件示例',
    shortLabel: '组件',
    status: 'P0 基础组件独立演示',
    description: '仅用于组件状态展示，不承载业务语义或业务数据。',
  },
] as const satisfies ReadonlyArray<ShellRoute>;

export function findShellRoute(path: string): ShellRoute | undefined {
  return shellRoutes.find((route) => route.path === path);
}
