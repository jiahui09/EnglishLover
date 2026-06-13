/**
 * AUTO-GENERATED FROM backend/openapi/openapi.yaml
 * Contract version: 1.0.0
 * Do not edit by hand. Regenerate with: cd backend && API_CONTRACT_FROZEN=true npm run generate:api-types
 */

export interface paths {
    "/api/v1/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取服务健康状态 */
        get: operations["getHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 登录并建立会话 */
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 使用 Refresh Token 轮换会话 */
        post: operations["refreshAuthToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 退出登录并使 Refresh Token 失效 */
        post: operations["logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取当前登录用户 */
        get: operations["getCurrentUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/words": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 分页查询词库 */
        get: operations["listWords"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reviews/submit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 提交一次单词复习结果 */
        post: operations["submitReview"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/review-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 游标分页查询复习事件 */
        get: operations["listReviewEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reading/articles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 分页查询阅读材料 */
        get: operations["listReadingArticles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reading/articles/{articleId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取阅读材料详情 */
        get: operations["getReadingArticle"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/reading/articles/{articleId}/words/{wordId}/queue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 从阅读模块将重点词加入单词待学习队列 */
        post: operations["addToWordLearningQueue"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/penpal/threads": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 分页查询受控笔友会话 */
        get: operations["listPenpalThreads"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/penpal/letters": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 发送受控笔友信件 */
        post: operations["sendPenpalLetter"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/analytics/daily-summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 查询指定日期的学习成果摘要 */
        get: operations["getDailySummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @enum {string} */
        ErrorCode: "AUTH_REQUIRED" | "AUTH_INVALID" | "FORBIDDEN" | "VALIDATION_ERROR" | "NOT_FOUND" | "CONFLICT" | "IDEMPOTENCY_CONFLICT" | "RATE_LIMITED" | "INTERNAL_ERROR";
        /** @enum {string} */
        LearningModule: "word" | "reading" | "writing";
        /** @enum {string} */
        SessionStatus: "active" | "completed" | "interrupted" | "discarded";
        /** @enum {string} */
        WordStage: "cet4" | "cet6" | "kaoyan" | "toefl" | "ielts" | "general";
        /** @enum {string} */
        ReviewMode: "recognition" | "recall" | "spelling";
        ReviewRating: number;
        /** @enum {string} */
        WordLearningSource: "reading" | "manual" | "system";
        /** @enum {string} */
        WordQueueStatus: "success" | "duplicate";
        /** @enum {string} */
        PenpalActivityType: "letter_sent";
        PageMeta: {
            page: number;
            pageSize: number;
            total: number;
        };
        CursorMeta: {
            cursor?: string;
            limit: number;
            nextCursor?: string | null;
        };
        ApiError: {
            code: components["schemas"]["ErrorCode"];
            message: string;
            details?: {
                [key: string]: unknown;
            };
        };
        ErrorEnvelope: {
            requestId: string;
            error: components["schemas"]["ApiError"];
        };
        HealthData: {
            /** @enum {string} */
            status: "ok";
            /** @enum {string} */
            service: "englishlover-api";
            version: string;
        };
        HealthResponse: {
            requestId: string;
            data: components["schemas"]["HealthData"];
        };
        LoginRequest: {
            /** Format: email */
            email: string;
            password: string;
        };
        /** @enum {string} */
        UserRole: "learner" | "content_admin" | "admin" | "ops";
        UserProfile: {
            /** Format: uuid */
            userId: string;
            /** Format: email */
            email: string;
            displayName: string;
            role: components["schemas"]["UserRole"];
        };
        AuthResponse: {
            requestId: string;
            data: {
                user: components["schemas"]["UserProfile"];
            };
        };
        UserProfileResponse: {
            requestId: string;
            data: components["schemas"]["UserProfile"];
        };
        WordSummary: {
            /** Format: uuid */
            wordId: string;
            text: string;
            phonetic?: string;
            stage: components["schemas"]["WordStage"];
        };
        WordListData: {
            items: components["schemas"]["WordSummary"][];
            page: number;
            pageSize: number;
            total: number;
        };
        WordListResponse: {
            requestId: string;
            data: components["schemas"]["WordListData"];
        };
        ReviewSubmitRequest: {
            /** Format: uuid */
            wordId: string;
            mode: components["schemas"]["ReviewMode"];
            rating: components["schemas"]["ReviewRating"];
            isCorrect: boolean;
            durationMs: number;
            /** Format: date-time */
            clientOccurredAt: string;
        };
        ReviewSubmitResult: {
            /** Format: uuid */
            reviewEventId: string;
            /** @enum {string} */
            status: "accepted";
            /** Format: date-time */
            nextReviewAt?: string;
        };
        ReviewSubmitResponse: {
            requestId: string;
            data: components["schemas"]["ReviewSubmitResult"];
        };
        ReviewEvent: {
            /** Format: uuid */
            eventId: string;
            module: components["schemas"]["LearningModule"];
            /** Format: date-time */
            occurredAt: string;
        };
        ReviewEventListData: {
            items: components["schemas"]["ReviewEvent"][];
            cursor?: string;
            limit: number;
            nextCursor?: string | null;
        };
        ReviewEventListResponse: {
            requestId: string;
            data: components["schemas"]["ReviewEventListData"];
        };
        ReadingArticleSummary: {
            /** Format: uuid */
            articleId: string;
            title: string;
            level?: string;
        };
        ReadingArticleListData: {
            items: components["schemas"]["ReadingArticleSummary"][];
            page: number;
            pageSize: number;
            total: number;
        };
        ReadingArticleListResponse: {
            requestId: string;
            data: components["schemas"]["ReadingArticleListData"];
        };
        ReadingArticleDetail: {
            /** Format: uuid */
            articleId: string;
            title: string;
            content: string;
        };
        ReadingArticleResponse: {
            requestId: string;
            data: components["schemas"]["ReadingArticleDetail"];
        };
        AddToWordLearningQueueResult: {
            status: components["schemas"]["WordQueueStatus"];
            source?: components["schemas"]["WordLearningSource"];
        };
        AddToWordLearningQueueResponse: {
            requestId: string;
            data: components["schemas"]["AddToWordLearningQueueResult"];
        };
        PenpalThreadSummary: {
            /** Format: uuid */
            threadId: string;
            status: components["schemas"]["SessionStatus"];
        };
        PenpalThreadListData: {
            items: components["schemas"]["PenpalThreadSummary"][];
            page: number;
            pageSize: number;
            total: number;
        };
        PenpalThreadListResponse: {
            requestId: string;
            data: components["schemas"]["PenpalThreadListData"];
        };
        SendPenpalLetterRequest: {
            /** Format: uuid */
            threadId: string;
            body: string;
        };
        SendPenpalLetterResult: {
            /** Format: uuid */
            letterId: string;
            activityType: components["schemas"]["PenpalActivityType"];
        };
        SendPenpalLetterResponse: {
            requestId: string;
            data: components["schemas"]["SendPenpalLetterResult"];
        };
        DailySummary: {
            /** Format: date */
            date: string;
            wordCompletedCount: number;
            readingCompletedCount: number;
            writingCompletedCount: number;
            taskCompletionRate: number;
            streakIncluded: boolean;
        };
        DailySummaryResponse: {
            requestId: string;
            data: components["schemas"]["DailySummary"];
        };
    };
    responses: {
        /** @description 未登录或会话缺失 */
        AuthRequired: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 认证凭据无效 */
        AuthInvalid: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 请求参数不合法 */
        ValidationError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 资源不存在 */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 幂等键冲突 */
        IdempotencyConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
    };
    parameters: {
        Page: number;
        PageSize: number;
        Cursor: string;
        Limit: number;
        /** @description 高风险写接口必须携带的幂等键。 */
        IdempotencyKey: string;
        ArticleId: string;
        WordId: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 服务可用 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
        };
    };
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            /** @description 登录成功；令牌通过 HttpOnly Cookie 设置 */
            200: {
                headers: {
                    /** @description access_token 与 refresh_token 采用 HttpOnly/Secure/SameSite Cookie */
                    "Set-Cookie"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthResponse"];
                };
            };
            400: components["responses"]["ValidationError"];
            401: components["responses"]["AuthInvalid"];
        };
    };
    refreshAuthToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 刷新成功；返回当前用户摘要并重新设置 Cookie */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthResponse"];
                };
            };
            401: components["responses"]["AuthRequired"];
        };
    };
    logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 退出成功，无响应体 */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["AuthRequired"];
        };
    };
    getCurrentUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 当前用户资料 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserProfileResponse"];
                };
            };
            401: components["responses"]["AuthRequired"];
        };
    };
    listWords: {
        parameters: {
            query?: {
                page?: components["parameters"]["Page"];
                pageSize?: components["parameters"]["PageSize"];
                stage?: components["schemas"]["WordStage"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 词库分页结果 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WordListResponse"];
                };
            };
            400: components["responses"]["ValidationError"];
            401: components["responses"]["AuthRequired"];
        };
    };
    submitReview: {
        parameters: {
            query?: never;
            header: {
                /** @description 高风险写接口必须携带的幂等键。 */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewSubmitRequest"];
            };
        };
        responses: {
            /** @description 复习提交成功 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReviewSubmitResponse"];
                };
            };
            400: components["responses"]["ValidationError"];
            401: components["responses"]["AuthRequired"];
            409: components["responses"]["IdempotencyConflict"];
        };
    };
    listReviewEvents: {
        parameters: {
            query?: {
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 复习事件游标分页结果 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReviewEventListResponse"];
                };
            };
            400: components["responses"]["ValidationError"];
            401: components["responses"]["AuthRequired"];
        };
    };
    listReadingArticles: {
        parameters: {
            query?: {
                page?: components["parameters"]["Page"];
                pageSize?: components["parameters"]["PageSize"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 阅读材料分页结果 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReadingArticleListResponse"];
                };
            };
            400: components["responses"]["ValidationError"];
            401: components["responses"]["AuthRequired"];
        };
    };
    getReadingArticle: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                articleId: components["parameters"]["ArticleId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 阅读材料详情 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReadingArticleResponse"];
                };
            };
            401: components["responses"]["AuthRequired"];
            404: components["responses"]["NotFound"];
        };
    };
    addToWordLearningQueue: {
        parameters: {
            query?: never;
            header: {
                /** @description 高风险写接口必须携带的幂等键。 */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                articleId: components["parameters"]["ArticleId"];
                wordId: components["parameters"]["WordId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 加入成功或重复加入 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AddToWordLearningQueueResponse"];
                };
            };
            401: components["responses"]["AuthRequired"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["IdempotencyConflict"];
        };
    };
    listPenpalThreads: {
        parameters: {
            query?: {
                page?: components["parameters"]["Page"];
                pageSize?: components["parameters"]["PageSize"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 笔友会话分页结果 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PenpalThreadListResponse"];
                };
            };
            400: components["responses"]["ValidationError"];
            401: components["responses"]["AuthRequired"];
        };
    };
    sendPenpalLetter: {
        parameters: {
            query?: never;
            header: {
                /** @description 高风险写接口必须携带的幂等键。 */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SendPenpalLetterRequest"];
            };
        };
        responses: {
            /** @description 信件发送成功并触发 penpal_activity_completed 事件 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SendPenpalLetterResponse"];
                };
            };
            400: components["responses"]["ValidationError"];
            401: components["responses"]["AuthRequired"];
            409: components["responses"]["IdempotencyConflict"];
        };
    };
    getDailySummary: {
        parameters: {
            query: {
                /** @description ISO 8601 日期，格式为 YYYY-MM-DD */
                date: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 当日学习成果摘要 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailySummaryResponse"];
                };
            };
            400: components["responses"]["ValidationError"];
            401: components["responses"]["AuthRequired"];
        };
    };
}
