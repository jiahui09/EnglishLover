import type {
  LearningModule,
  PenpalActivityType,
  ReviewMode,
  SessionStatus,
  WordLearningSource,
  WordQueueStatus,
  WordStage,
} from './api-types';
import type { BadgeVariant } from '@/components/ui';

export const moduleLabels: Record<LearningModule, string> = {
  word: '单词',
  reading: '阅读',
  writing: '写作',
};

export const sessionStatusLabels: Record<SessionStatus, string> = {
  active: '进行中',
  completed: '已完成',
  interrupted: '已中断',
  discarded: '已废弃',
};

export const sessionStatusTone: Record<SessionStatus, BadgeVariant> = {
  active: 'info',
  completed: 'success',
  interrupted: 'warning',
  discarded: 'danger',
};

export const wordStageLabels: Record<WordStage, string> = {
  cet4: 'CET-4',
  cet6: 'CET-6',
  kaoyan: '考研',
  toefl: 'TOEFL',
  ielts: 'IELTS',
  general: '通用',
};

export const reviewModeLabels: Record<ReviewMode, string> = {
  recognition: '识别',
  recall: '回忆',
  spelling: '拼写',
};

export const wordSourceLabels: Record<WordLearningSource, string> = {
  reading: '阅读加入',
  manual: '手动加入',
  system: '系统加入',
};

export const wordQueueStatusLabels: Record<WordQueueStatus, string> = {
  success: '已加入',
  duplicate: '已存在',
};

export const penpalActivityLabels: Record<PenpalActivityType, string> = {
  letter_sent: '信件已发送',
};
