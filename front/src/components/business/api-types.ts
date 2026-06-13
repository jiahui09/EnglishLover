import type { components } from '@/types/api';

export type ApiSchema<Name extends keyof components['schemas']> = components['schemas'][Name];

export type LearningModule = ApiSchema<'LearningModule'>;
export type SessionStatus = ApiSchema<'SessionStatus'>;
export type WordStage = ApiSchema<'WordStage'>;
export type ReviewMode = ApiSchema<'ReviewMode'>;
export type ReviewRating = ApiSchema<'ReviewRating'>;
export type WordLearningSource = ApiSchema<'WordLearningSource'>;
export type WordQueueStatus = ApiSchema<'WordQueueStatus'>;
export type PenpalActivityType = ApiSchema<'PenpalActivityType'>;
export type ErrorCode = ApiSchema<'ErrorCode'>;
export type DailySummary = ApiSchema<'DailySummary'>;
export type WordSummary = ApiSchema<'WordSummary'>;
export type WordListData = ApiSchema<'WordListData'>;
export type ReviewSubmitRequest = ApiSchema<'ReviewSubmitRequest'>;
export type ReviewSubmitResult = ApiSchema<'ReviewSubmitResult'>;
export type ReviewEvent = ApiSchema<'ReviewEvent'>;
export type ReadingArticleSummary = ApiSchema<'ReadingArticleSummary'>;
export type ReadingArticleDetail = ApiSchema<'ReadingArticleDetail'>;
export type AddToWordLearningQueueResult = ApiSchema<'AddToWordLearningQueueResult'>;
export type PenpalThreadSummary = ApiSchema<'PenpalThreadSummary'>;
export type SendPenpalLetterRequest = ApiSchema<'SendPenpalLetterRequest'>;
export type SendPenpalLetterResult = ApiSchema<'SendPenpalLetterResult'>;
