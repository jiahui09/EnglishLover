# EnglishLover 功能分析与系统架构设计方案

> 适用项目：`EnglishLover`  
> 文档用途：立项评审、后端重构实施、系统扩展规划  
> 当前可核查依据：`README.md`、`DESIGN.md`、`docs/README.md`、阶段文档和现有资产基线调查报告  
> 历史线索/待复核路径：既有说明曾提到 `front/src/types.ts`、`front/src/App.tsx`、`front/server.ts`、`front/src/components/*`，但当前仓库快照未核验到完整 `front/` 源码目录。  
> 重要说明：本文中的功能现状、并发指标和阶段目标属于历史线索或实施建议；当前仓库尚未提供真实源码、生产流量、压测数据或线上运行数据，不能视为已实现或已验证结果。

---

## 1. 结论概述

既有历史说明曾描述 EnglishLover 具备英语词汇学习产品原型能力，包括阶段词库、单词学习、间隔复习、听写、阅读生成、AI 单词解释、学习统计、成就、排行榜、用户资料和管理后台等功能；同时也曾说明主要数据保存在浏览器 `localStorage` 中，`front/server.ts` 主要承担 Gemini API 代理和 AI 兜底逻辑。当前仓库快照未核验到对应源码，因此上述内容只能作为待复核的历史线索，不能直接视为当前已实现事实。

为了支撑后续立项和实施，推荐在完成源码资产基线调查后，将系统演进为：

```text
React/Vite 或真实确认后的 Web 前端
  + 经技术选型门禁确认的模块化单体后端
  + PostgreSQL 主数据库
  + Redis 缓存/限流/排行榜
  + PostgreSQL FTS 或 OpenSearch 搜索
  + 异步任务队列
  + 日志监控与备份容灾体系
```

第一阶段不建议直接上复杂微服务。更合理的路线是先建设“模块边界清晰的模块化单体后端”，把用户数据、单词数据、复习数据和管理功能落到数据库中；当 AI 调用、搜索、统计、排行榜等模块出现独立扩展压力时，再逐步拆分为专用服务。后端语言和框架应以团队能力、现有源码资产和交付周期为依据，不应在源码缺失时直接定死。

---

## 2. 项目现状与事实依据

### 2.1 当前技术现状

当前仓库可核查内容以文档为主，未核验到完整 `front/` 源码目录。既有历史说明曾提到以下路径和组件，后续恢复或创建源码后应逐项复核：

- 前端入口和状态管理可能集中在 `front/src/App.tsx`。
- 类型定义可能位于 `front/src/types.ts`。
- 种子词库可能位于 `front/src/data/words.ts`。
- AI 接口和 Vite/Express 服务可能位于 `front/server.ts`。
- 历史说明中出现过 `WordTrainer`、`ReadingModule`、`AdminPanel`、`TodayDashboard`、`AnalyticsDashboard`、`Leaderboard`、`UserProfileInfo` 等组件名称。

在源码恢复前，以上内容不能作为当前已实现事实，只能作为后续资产盘点线索。

### 2.2 当前业务能力

根据既有历史说明，项目可能覆盖过以下业务能力；当前仓库未核验到源码，需恢复代码后确认：

1. 不同学习阶段的词库学习。
2. 单词预习、回忆、听写。
3. 基于 SM-2 思路的复习状态更新。
4. 学习阶段、每日目标、连续学习等用户资料。
5. AI 单词解释、AI 文章生成、AI 辅导聊天。
6. 阅读文章中的目标词点击与掌握度调整。
7. 学习统计、排行榜、成就展示。
8. 管理后台的自定义单词、新增、删除、导入导出。

### 2.3 当前主要不足

| 问题 | 说明 | 影响 |
|---|---|---|
| 数据主要在浏览器本地 | 词库、用户资料、复习状态保存在 `localStorage` | 无法多端同步，数据易丢失 |
| 没有正式认证体系 | 当前后台使用本地口令 | 不适合生产环境 |
| 后端业务能力较弱 | Express 主要处理 AI 代理 | 缺少用户、词库、复习等核心业务接口 |
| 缺少数据库 | 无法沉淀用户学习数据 | 后续统计、推荐和运营困难 |
| 缺少缓存和限流 | AI 接口和词库读取没有完整缓存体系 | 高并发下成本和延迟不可控 |
| 缺少监控审计 | 后台操作和系统异常缺乏追踪 | 维护和排障困难 |

---

## 3. 业务目标分析

### 3.1 核心业务目标

EnglishLover 的核心业务目标是建设一个面向英语学习者的词汇学习与复习系统，使用户能够：

1. 按学习阶段系统学习单词。
2. 根据记忆情况自动安排复习计划。
3. 在阅读语境中强化词汇理解。
4. 通过数据面板了解学习进度和薄弱项。
5. 借助 AI 获得单词讲解、文章生成和学习辅导。
6. 在多端或后续账号体系中保留自己的学习记录。

### 3.2 技术建设目标

后端建设需要满足以下目标：

1. 数据持久化：将单词数据和用户数据统一存储到数据库。
2. 高并发：支持大量用户同时查看词库、提交复习结果和访问学习面板。
3. 低延迟：核心学习接口保持稳定响应。
4. 易扩展：后续可以拆分 AI、搜索、统计、排行榜等服务。
5. 易维护：模块边界清晰，接口规范统一，日志监控完整。
6. 安全合规：认证、权限、审计、限流、数据备份齐全。

---

## 4. 用户角色分析

| 角色 | 主要目标 | 核心操作 |
|---|---|---|
| 普通学习用户 | 学单词、复习、阅读、查看进度 | 注册登录、选择阶段、学习、复习、阅读、查看统计 |
| 内容管理员 | 维护词库内容 | 新增单词、编辑单词、导入导出、审核自定义词 |
| 系统管理员 | 管理系统和权限 | 用户管理、角色分配、系统配置、查看审计 |
| 运维人员 | 保证系统稳定运行 | 查看日志、监控指标、告警处理、备份恢复 |

如果后续源码确实存在类似后台能力，生产化时应从“本地口令”升级为服务端 RBAC 权限模型。

---

## 5. 核心使用流程

### 5.1 注册与初始化流程

```text
用户进入系统
  -> 注册/登录
  -> 填写昵称和学习目标
  -> 选择学习阶段
  -> 设置每日学习目标
  -> 系统初始化用户资料和单词复习状态
```

### 5.2 每日学习流程

```text
进入首页
  -> 后端计算今日待复习数量、新词数量、学习进度
  -> 用户选择预习/回忆/听写模式
  -> 前端拉取单词和用户复习状态
  -> 用户答题或评分
  -> 后端写入学习事件
  -> 后端更新用户单词状态
  -> 异步更新每日统计和成就
```

### 5.3 阅读学习流程

```text
用户选择阶段或目标词
  -> 请求生成阅读文章
  -> 后端调用 AI 或命中缓存
  -> 返回文章、翻译和问题
  -> 用户阅读并点击目标词
  -> 系统记录阅读行为并调整掌握度
  -> 用户可继续向 AI 辅导提问
```

### 5.4 统计与反馈流程

```text
用户完成学习行为
  -> 写入 review_events
  -> 异步聚合 learning_daily_stats
  -> 更新成就、连续学习、排行榜
  -> 前端展示趋势、掌握度、弱项和排名
```

### 5.5 管理后台流程

```text
管理员登录
  -> 权限校验
  -> 维护词库或用户数据
  -> 写入业务表
  -> 写入 admin_audit_logs
  -> 必要时刷新缓存和搜索索引
```

---

## 6. 关键功能模块

| 模块 | 功能说明 |
|---|---|
| 用户与认证模块 | 注册、登录、退出、刷新令牌、角色权限 |
| 用户资料模块 | 当前阶段、每日目标、学习偏好、连续学习 |
| 词库模块 | 阶段词库、单词详情、自定义词、词根、例句、近反义词 |
| 学习复习模块 | 新词学习、复习计划、SM-2 更新、听写、答题事件 |
| 阅读模块 | 目标词阅读文章、文章问题、阅读行为记录 |
| AI 辅助模块 | 单词解释、文章生成、聊天辅导、缓存兜底 |
| 统计分析模块 | 学习趋势、掌握度、错误率、学习负载 |
| 成就模块 | 连续学习、掌握词数、学习里程碑 |
| 排行榜模块 | 阶段排行、周期排行、积分统计 |
| 管理后台模块 | 单词 CRUD、导入导出、用户管理、审计 |
| 系统运维模块 | 日志、监控、告警、限流、备份恢复 |

---

## 7. 功能边界与优先级

### 7.1 第一阶段范围

第一阶段重点完成：

1. 用户注册登录。
2. 用户资料持久化。
3. 单词数据持久化。
4. 用户单词复习状态持久化。
5. 学习提交接口。
6. 今日复习列表接口。
7. 基础词库管理。
8. AI 接口迁移和缓存。
9. 基础日志和错误处理。

### 7.2 暂不纳入第一阶段

以下能力建议后置：

1. 付费订阅。
2. 社交动态。
3. 实时课堂。
4. 复杂语音评分。
5. 多端离线冲突合并。
6. 大规模内容审核系统。
7. 多租户商业化后台。

### 7.3 优先级划分

| 优先级 | 功能 |
|---|---|
| P0 | 用户登录、词库查询、学习阶段、复习状态、学习提交、基础后台 |
| P1 | Redis 缓存、AI 缓存、搜索、OpenAPI 文档、审计日志 |
| P2 | 学习统计、成就、排行榜、异步任务、限流、监控 |
| P3 | 个性化推荐、通知提醒、移动端接口、多端同步 |
| P4 | 社交、付费、内容审核、国际化、多租户 |

---

## 8. 系统总体架构设计

### 8.1 推荐架构

```text
用户浏览器
  |
CDN / Nginx / API Gateway
  |
React/Vite 静态前端
  |
Go API 服务
  |-- Auth 用户认证模块
  |-- User 用户资料模块
  |-- Word 词库模块
  |-- Review 学习复习模块
  |-- Reading 阅读模块
  |-- AI AI 代理模块
  |-- Analytics 统计模块
  |-- Admin 管理后台模块
  |
PostgreSQL 主数据库
Redis 缓存/限流/排行榜
PostgreSQL FTS 或 OpenSearch 搜索
消息队列/异步任务
日志监控与告警系统
备份和对象存储
```

### 8.2 架构原则

1. 前后端分离。
2. 后端服务无状态。
3. 数据库作为真实数据源。
4. Redis 只做缓存和辅助结构，不作为核心唯一存储。
5. AI、搜索、统计等耗时能力尽量异步化或缓存化。
6. 第一阶段模块化单体，后续按压力拆分微服务。

### 8.3 模块化单体结构建议

```text
backend/
  cmd/server
  internal/auth
  internal/user
  internal/word
  internal/review
  internal/reading
  internal/ai
  internal/analytics
  internal/admin
  internal/common
  migrations
  docs/openapi
```

---

## 9. 前后端交互方式

### 9.1 推荐方式

核心业务使用 RESTful JSON API：

```text
/api/v1/...
```

原因：

1. 当前 React 前端接入简单。
2. 学习、词库、用户资料均适合请求响应模式。
3. 便于用 OpenAPI 管理接口文档。
4. 调试和测试成本低。
5. 容易接入网关、限流和监控。

### 9.2 API 示例

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout

GET  /api/v1/users/me
PATCH /api/v1/users/me/profile

GET  /api/v1/words
GET  /api/v1/words/{id}
GET  /api/v1/words/search
POST /api/v1/admin/words
PATCH /api/v1/admin/words/{id}
DELETE /api/v1/admin/words/{id}

GET  /api/v1/reviews/due
POST /api/v1/reviews/submit
GET  /api/v1/reviews/states

POST /api/v1/ai/word-explanation
POST /api/v1/ai/articles
POST /api/v1/ai/chat

GET  /api/v1/analytics/overview
GET  /api/v1/achievements
GET  /api/v1/leaderboard
```

### 9.3 响应格式

成功响应：

```json
{
  "code": 0,
  "message": "ok",
  "data": {},
  "requestId": "req_xxx"
}
```

错误响应：

```json
{
  "code": 40001,
  "message": "invalid word id",
  "details": {
    "field": "wordId"
  },
  "requestId": "req_xxx"
}
```

### 9.4 实时交互

第一阶段不强制使用 WebSocket。后续可按需加入：

- SSE：AI 生成进度、系统通知。
- WebSocket：实时排行榜、学习房间。
- 轮询：简单状态刷新。

---

## 10. 后端语言与框架推荐及对比

### 10.1 推荐方案：Go + Gin 或 Chi

推荐后端主技术栈：

```text
Go + Gin/Chi + pgx + PostgreSQL + Redis
```

推荐理由：

| 维度 | 说明 |
|---|---|
| 吞吐量 | Go 的并发模型适合高并发 API 服务 |
| 响应时间 | 编译型语言，运行时开销低，延迟稳定 |
| 资源占用 | 单二进制部署，内存占用较低 |
| 开发效率 | 比 Rust 更容易落地，比重型 Java 框架更轻 |
| 维护成本 | 项目结构清晰，部署和排障简单 |
| 适配场景 | 高频词库查询、复习提交、用户状态更新、缓存访问 |

### 10.2 Gin 与 Chi 选择

| 框架 | 特点 | 适用建议 |
|---|---|---|
| Gin | 性能好、生态成熟、资料多 | 快速落地优先时推荐 |
| Chi | 轻量、贴近标准库、结构清晰 | 长期维护和工程规范优先时推荐 |
| Fiber | 性能较高、API 类 Express | 团队熟悉 Express 风格时可考虑 |

本项目建议：

```text
如果优先开发效率：Go + Gin
如果优先长期维护：Go + Chi
```

### 10.3 备选技术路线

| 技术路线 | 吞吐量 | 响应时间 | 资源占用 | 开发效率 | 团队维护成本 | 适用条件 |
|---|---:|---:|---:|---:|---:|---|
| Go + Gin/Chi | 高 | 低 | 低 | 中高 | 中低 | 推荐主方案，适合高并发核心业务 |
| NestJS + Fastify | 中高 | 中低 | 中 | 高 | 低 | 前后端都希望使用 TypeScript |
| FastAPI | 中高 | 中 | 中 | 高 | 中 | AI、数据处理、内部服务 |
| Spring Boot | 高 | 中 | 较高 | 中 | 中 | 团队 Java 背景强，企业治理要求高 |
| Rust + Axum | 很高 | 很低 | 很低 | 低 | 高 | 极致性能场景，团队 Rust 能力强 |

综合吞吐量、延迟、资源占用、开发效率和维护成本，主业务后端推荐 Go；AI 模块后续可单独使用 Python FastAPI 承担。

---

## 11. 服务划分与模块职责

### 11.1 模块化单体阶段

| 模块 | 职责 |
|---|---|
| Auth | 注册、登录、JWT、刷新令牌、角色权限 |
| User | 用户资料、阶段选择、每日目标、偏好设置 |
| Word | 词库查询、单词详情、自定义词、导入导出 |
| Review | 学习状态、复习计划、SM-2 更新、答题记录 |
| Reading | 阅读文章、目标词关联、阅读记录 |
| AI | AI 单词解释、文章生成、聊天辅导、兜底缓存 |
| Analytics | 学习统计、每日数据、弱项分析 |
| Achievement | 成就、连续学习、里程碑 |
| Leaderboard | 积分、阶段排行、周期排行 |
| Admin | 后台管理、用户管理、审计日志 |
| Common | 日志、配置、错误码、中间件、数据库连接 |

### 11.2 微服务拆分阶段

当出现性能或团队协作压力时，可拆分为：

```text
Auth Service
User Service
Word Service
Review Service
AI Service
Analytics Service
Search Service
Admin Service
```

建议拆分顺序：

1. AI Service：因为调用慢、成本高、容易限流。
2. Analytics Service：因为统计计算可异步化。
3. Search Service：因为搜索索引和主库模型不同。
4. Review Service：当学习提交 QPS 明显升高时拆分。
5. Word Service：当词库读取和管理复杂度上升时拆分。

---

## 12. 数据库选型与表结构设计思路

### 12.1 主数据库选择 PostgreSQL

推荐 PostgreSQL 作为主数据库。

理由：

1. 关系模型适合用户、词库、复习状态等结构化数据。
2. 事务能力适合学习提交和状态更新。
3. JSONB 适合存储词根、例句、AI 元数据等半结构化字段。
4. 支持 GIN 索引、全文搜索、分区表。
5. 备份、恢复、主从复制和云托管生态成熟。

### 12.2 数据分层原则

数据库主要存储两类核心数据：

1. 单词数据。
2. 用户数据。

在实现上，为了支持学习业务，需要围绕这两类数据扩展出：

- 用户单词复习状态。
- 学习事件记录。
- 学习统计汇总。
- AI 文章缓存。
- 管理审计日志。

这些表不是偏离“单词数据与用户数据”前提，而是围绕单词和用户产生的业务状态与行为记录。

---

## 13. 数据表设计

### 13.1 users：用户账号表

```text
id UUID PK
email VARCHAR UNIQUE
password_hash VARCHAR
display_name VARCHAR
avatar_url VARCHAR
role VARCHAR
status VARCHAR
created_at TIMESTAMP
updated_at TIMESTAMP
last_login_at TIMESTAMP
```

### 13.2 user_profiles：用户学习资料表

```text
user_id UUID PK/FK
current_stage VARCHAR
daily_goal INT
timezone VARCHAR
locale VARCHAR
streak_count INT
learned_count INT
review_count INT
last_study_date DATE
settings JSONB
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 13.3 stages：学习阶段表

```text
id VARCHAR PK
name VARCHAR
description TEXT
total_words INT
sort_order INT
enabled BOOLEAN
```

### 13.4 words：单词主表

```text
id UUID PK
word VARCHAR
word_lower VARCHAR
phonetic VARCHAR
translation TEXT
pos VARCHAR
stage_id VARCHAR
difficulty INT
examples JSONB
roots JSONB
synonyms TEXT[]
antonyms TEXT[]
collocations TEXT[]
confusables TEXT[]
extended_meaning TEXT
tags TEXT[]
source VARCHAR
is_custom BOOLEAN
owner_user_id UUID NULL
status VARCHAR
created_by UUID
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 13.5 user_word_states：用户单词状态表

```text
user_id UUID
word_id UUID
stage_id VARCHAR
box INT
easiness NUMERIC
interval_days INT
repetitions INT
mastery INT
wrong_attempts INT
last_review_at TIMESTAMP
next_review_at TIMESTAMP
is_bookmarked BOOLEAN
created_at TIMESTAMP
updated_at TIMESTAMP

PRIMARY KEY(user_id, word_id)
```

### 13.6 review_events：学习/复习事件表

```text
id UUID PK
user_id UUID
word_id UUID
session_id UUID
mode VARCHAR
rating INT
is_correct BOOLEAN
duration_ms INT
previous_state JSONB
new_state JSONB
occurred_at TIMESTAMP
device_id VARCHAR
```

### 13.7 learning_sessions：学习会话表

```text
id UUID PK
user_id UUID
mode VARCHAR
stage_id VARCHAR
started_at TIMESTAMP
ended_at TIMESTAMP
total_count INT
correct_count INT
avg_duration_ms INT
```

### 13.8 learning_daily_stats：每日统计表

```text
user_id UUID
stat_date DATE
learned_count INT
reviewed_count INT
correct_count INT
wrong_count INT
reading_minutes INT
avg_duration_ms INT
created_at TIMESTAMP
updated_at TIMESTAMP

PRIMARY KEY(user_id, stat_date)
```

### 13.9 ai_articles：AI 文章缓存表

```text
id UUID PK
user_id UUID NULL
stage_id VARCHAR
title VARCHAR
content TEXT
translation TEXT
target_words TEXT[]
questions JSONB
provider VARCHAR
prompt_hash VARCHAR
created_at TIMESTAMP
expires_at TIMESTAMP
```

### 13.10 admin_audit_logs：后台审计日志表

```text
id UUID PK
actor_user_id UUID
action VARCHAR
resource_type VARCHAR
resource_id VARCHAR
before_value JSONB
after_value JSONB
ip VARCHAR
user_agent TEXT
created_at TIMESTAMP
```

---

## 14. 单词数据模型设计

当前项目的 `Word` 模型已经包含：

- 单词。
- 音标。
- 翻译。
- 词性。
- 英文例句。
- 中文例句。
- 学习阶段。
- 词根。
- 近义词。
- 反义词。
- 搭配。
- 易混词。
- 扩展含义。

生产环境建议将单词模型分为两层。

### 14.1 基础词条

稳定字段：

```text
word
word_lower
phonetic
translation
pos
stage_id
difficulty
```

### 14.2 扩展词条

可变字段：

```text
examples
roots
synonyms
antonyms
collocations
confusables
extended_meaning
tags
```

第一阶段可使用 JSONB 和数组字段，减少表数量；当后续需要精细编辑、独立搜索、多释义管理时，再拆分为：

```text
word_senses
word_examples
word_relations
word_tags
```

---

## 15. 用户数据模型设计

用户数据建议拆成四类：

| 数据类型 | 表 | 特点 |
|---|---|---|
| 账号身份 | users | 登录、权限、安全相关 |
| 学习资料 | user_profiles | 更新频率较低 |
| 单词状态 | user_word_states | 高频读写，复习核心 |
| 行为事件 | review_events | 写入量大，适合分区和异步统计 |

这种设计可以避免所有数据堆在一张用户表中，也便于后续做统计、推荐和性能优化。

---

## 16. 索引设计

### 16.1 用户表索引

```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);
```

### 16.2 单词表索引

```sql
CREATE INDEX idx_words_stage ON words(stage_id);
CREATE INDEX idx_words_word_lower ON words(word_lower);
CREATE INDEX idx_words_stage_word ON words(stage_id, word_lower);
CREATE INDEX idx_words_tags_gin ON words USING GIN(tags);
```

全文搜索索引：

```sql
CREATE INDEX idx_words_search
ON words
USING GIN(to_tsvector('simple', word || ' ' || coalesce(translation, '')));
```

### 16.3 用户单词状态索引

核心查询是“某用户当前阶段今日待复习单词”：

```sql
CREATE INDEX idx_user_due_reviews
ON user_word_states(user_id, stage_id, next_review_at, box);
```

收藏单词索引：

```sql
CREATE INDEX idx_user_bookmarked_words
ON user_word_states(user_id, stage_id)
WHERE is_bookmarked = true;
```

### 16.4 学习事件索引

```sql
CREATE INDEX idx_review_events_user_time
ON review_events(user_id, occurred_at DESC);

CREATE INDEX idx_review_events_word_time
ON review_events(word_id, occurred_at DESC);
```

`review_events` 建议按月分区，避免长期写入导致单表过大。

---

## 17. 缓存策略

### 17.1 Redis 缓存内容

| 缓存 Key | 内容 | 建议 TTL |
|---|---|---|
| `word:{id}` | 单词详情 | 1-24 小时 |
| `stage:{stage}:words:v{version}` | 阶段词库 | 30-60 分钟 |
| `user:{id}:profile` | 用户资料 | 5 分钟 |
| `user:{id}:due:{stage}:{date}` | 今日待复习列表 | 1-5 分钟 |
| `ai:explain:{word}:{stage}` | AI 单词解释 | 7-30 天 |
| `ai:article:{hash}` | AI 文章结果 | 7-30 天 |
| `rate:{ip}:{endpoint}` | 限流计数 | 秒级/分钟级 |
| `leaderboard:{stage}:{period}` | 排行榜 | 按周期 |

### 17.2 缓存原则

1. 词库数据读多写少，适合长缓存。
2. 用户资料缓存时间短，更新后主动失效。
3. 复习状态变化频繁，不宜长时间缓存。
4. AI 结果成本高，应强缓存。
5. 排行榜可用 Redis Sorted Set。
6. TTL 增加随机抖动，避免缓存雪崩。
7. 不存在的数据使用短 TTL 负缓存，避免缓存穿透。
8. 热点 AI 请求可使用 singleflight 或请求合并，避免并发击穿。

---

## 18. 搜索方案

### 18.1 第一阶段：PostgreSQL FTS

适合：

1. 词库规模不大。
2. 搜索字段较简单。
3. 主要搜索英文单词、中文释义、阶段词库。

支持能力：

```text
单词前缀搜索
中文释义关键词搜索
阶段过滤
标签过滤
```

### 18.2 第二阶段：OpenSearch / Elasticsearch / Meilisearch

当需要以下能力时引入专用搜索服务：

1. 模糊搜索。
2. 拼写纠错。
3. 中文分词。
4. 高亮显示。
5. 多字段权重排序。
6. 高 QPS 搜索。

主数据仍以 PostgreSQL 为准，搜索服务通过异步任务或 CDC 同步索引。

---

## 19. 权限与认证机制

### 19.1 认证方式

推荐：

```text
Access Token + Refresh Token
```

策略：

1. Access Token 短有效期，例如 15 分钟。
2. Refresh Token 长有效期，例如 7-30 天。
3. Web 端建议使用 HttpOnly + Secure + SameSite Cookie 保存令牌。
4. Refresh Token 使用轮换机制。
5. 退出登录时使 Refresh Token 失效。

### 19.2 权限模型

采用 RBAC：

| 角色 | 权限 |
|---|---|
| learner | 学习、复习、查看个人数据 |
| content_admin | 词库维护、导入导出 |
| admin | 用户管理、系统配置、审计查看 |
| ops | 查看监控、日志、备份状态 |

### 19.3 安全要求

1. 密码使用 Argon2id 或 bcrypt 哈希。
2. 登录失败限流。
3. 管理员操作写审计日志。
4. 敏感接口强制 HTTPS。
5. 管理后台可增加二次验证。
6. 令牌泄露后支持主动吊销。

---

## 20. 接口设计规范

### 20.1 基本规范

1. 所有接口使用 `/api/v1` 前缀。
2. 请求和响应统一 JSON。
3. 使用 OpenAPI 维护接口文档。
4. 列表接口支持分页。
5. 高风险写接口支持幂等键。
6. 返回 `requestId` 方便排查问题。

### 20.2 分页格式

普通分页：

```text
GET /api/v1/words?stage=cet4&page=1&pageSize=20
```

响应：

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "total": 1000
}
```

大数据量列表建议使用游标分页：

```text
GET /api/v1/review-events?cursor=xxx&limit=50
```

### 20.3 学习提交接口

```text
POST /api/v1/reviews/submit
```

请求：

```json
{
  "wordId": "uuid",
  "mode": "recall",
  "rating": 4,
  "isCorrect": true,
  "durationMs": 3200,
  "clientOccurredAt": "2026-06-12T10:00:00Z"
}
```

后端处理步骤：

1. 校验用户身份。
2. 校验请求参数。
3. 查询当前 `user_word_states`。
4. 根据算法计算新状态。
5. 写入 `review_events`。
6. 更新 `user_word_states`。
7. 异步更新每日统计、成就和排行榜。

---

## 21. 性能优化手段

### 21.1 建议性能目标

在真实压测前，可先设定以下工程目标：

| 接口类型 | 建议目标 |
|---|---|
| 缓存命中的词库查询 | P95 < 100ms |
| 今日复习列表 | P95 < 150ms |
| 学习提交 | P95 < 200ms |
| 登录注册 | P95 < 300ms |
| AI 生成 | 异步处理，前端展示生成中 |

这些目标需要通过后续压测验证，不能直接视为当前项目已达到。

### 21.2 后端优化

1. 使用数据库连接池，例如 `pgxpool`。
2. 高频查询使用复合索引。
3. 避免 N+1 查询。
4. 批量拉取单词和用户复习状态。
5. 学习提交使用事务。
6. 统计计算异步化。
7. AI 生成限流、排队、缓存。
8. 使用 gzip 或 brotli 压缩响应。
9. 静态资源走 CDN。
10. 大列表使用游标分页。
11. 热点词库放 Redis。
12. 排行榜使用 Redis Sorted Set。

### 21.3 数据库优化

1. `review_events` 按月分区。
2. 读多接口走只读副本。
3. 写多表避免过多二级索引。
4. 定期清理过期 AI 缓存。
5. 统计表提前聚合，避免实时扫事件表。
6. 监控慢查询并持续调优索引。

---

## 22. 水平扩展方案

### 22.1 API 服务扩展

API 服务保持无状态：

```text
Nginx / Ingress
  |
多个 Go API 实例
  |
PostgreSQL / Redis / Search
```

通过 Kubernetes HPA 或云服务自动扩容。

### 22.2 数据层扩展

| 层 | 扩展方式 |
|---|---|
| PostgreSQL | 主从复制、读副本、分区表、连接池 |
| Redis | Sentinel、Cluster、读写分离 |
| 搜索 | OpenSearch 集群或 Meilisearch 集群 |
| 队列 | Kafka / RabbitMQ / NATS 横向扩展 |
| AI 服务 | 独立 worker 扩容 |

### 22.3 热点路径拆分

高并发阶段可拆分：

1. Review Service：专门处理学习提交。
2. Word Service：专门处理词库读取。
3. AI Service：独立处理慢请求。
4. Analytics Worker：异步统计学习数据。
5. Search Service：独立承担复杂检索。

---

## 23. 安全设计

### 23.1 应用安全

1. 所有输入参数做校验。
2. SQL 使用参数化查询。
3. 防止 XSS，AI 生成内容输出前转义。
4. CORS 白名单。
5. Cookie 鉴权场景增加 CSRF 防护。
6. 管理后台接口必须鉴权和授权。
7. 上传/导入文件限制大小和格式。
8. 敏感配置放入 Secret Manager 或环境变量。

### 23.2 接口安全

1. 登录接口限流。
2. AI 接口限流和配额控制。
3. 后台操作写审计日志。
4. 高风险操作二次确认。
5. 请求体大小限制。
6. `requestId` 全链路追踪。

### 23.3 数据安全

1. 密码不可明文保存。
2. 备份文件加密。
3. 数据库连接开启 TLS。
4. 最小化保存个人隐私数据。
5. 管理员访问遵循最小权限原则。

---

## 24. 日志监控

### 24.1 结构化日志

日志建议使用 JSON 格式：

```json
{
  "level": "info",
  "time": "2026-06-12T10:00:00Z",
  "requestId": "req_xxx",
  "userId": "uuid",
  "method": "POST",
  "path": "/api/v1/reviews/submit",
  "status": 200,
  "latencyMs": 35,
  "cacheHit": true
}
```

### 24.2 监控指标

需要监控：

1. QPS。
2. P50/P95/P99 延迟。
3. 错误率。
4. 数据库连接池使用率。
5. Redis 命中率。
6. 慢查询数量。
7. AI 调用耗时和失败率。
8. 队列堆积长度。
9. 登录失败次数。
10. 备份成功率。

### 24.3 链路追踪

建议使用 OpenTelemetry 做链路追踪，统一接入日志、指标和 trace，便于定位一次学习提交从 API 到数据库、缓存、队列的完整链路。

---

## 25. 部署架构

### 25.1 开发与测试环境

推荐使用 Docker Compose：

```text
frontend
api
postgres
redis
search optional
```

适合本地开发、联调和毕业设计演示。

### 25.2 生产环境

```text
CDN
  |
Nginx / Cloud Load Balancer
  |
Kubernetes Ingress
  |
API Deployment
AI Worker Deployment
Analytics Worker Deployment
  |
PostgreSQL Managed DB
Redis Managed Service
OpenSearch Managed Service
Object Storage
Monitoring Stack
```

### 25.3 CI/CD 流程

1. TypeScript 类型检查。
2. 前端构建。
3. Go 单元测试。
4. API 集成测试。
5. Docker 镜像构建。
6. 数据库迁移检查。
7. 灰度发布。
8. 健康检查。
9. 自动回滚。

---

## 26. 容灾与备份策略

### 26.1 PostgreSQL

1. 每日全量备份。
2. 开启 WAL 归档，实现时间点恢复。
3. 生产环境使用多可用区。
4. 定期恢复演练。
5. 重要版本发布前做手动快照。

### 26.2 Redis

Redis 主要作为缓存，可以允许丢失。若用于队列或排行榜，应开启：

1. AOF。
2. RDB 快照。
3. 主从或 Cluster。
4. 死信队列或失败重试。

### 26.3 搜索服务

搜索索引可以从 PostgreSQL 重建，因此不作为唯一真实数据源。需要保存索引构建脚本和同步任务，确保故障后可重建。

### 26.4 RPO/RTO 建议

| 阶段 | RPO | RTO |
|---|---|---|
| 初期 | 24 小时 | 4 小时 |
| 生产增长期 | 15 分钟 | 1 小时 |
| 高可用阶段 | 5 分钟以内 | 30 分钟以内 |

---

## 27. 不同阶段实施路线图

### 27.1 阶段 0：立项与技术验证，1-2 周

目标：

1. 确认功能范围。
2. 输出 ER 图和接口文档。
3. 选择 Go 框架。
4. 设计数据库迁移方案。
5. 制定性能目标和压测方案。

交付物：

1. 系统架构图。
2. 数据库表设计。
3. OpenAPI 初稿。
4. 技术选型说明。
5. 压测计划。

### 27.2 阶段 1：后端 MVP，3-6 周

目标：

1. 替换前端 `localStorage` 为后端持久化。
2. 实现用户、词库、复习状态、学习提交接口。
3. 实现基础管理后台接口。
4. 保留并迁移现有 AI 接口。

交付物：

1. Go API 服务。
2. PostgreSQL 数据库。
3. Redis 基础缓存。
4. 用户认证。
5. 单词 CRUD。
6. 复习提交。
7. 前端接口改造。
8. 基础测试。

### 27.3 阶段 2：可用性与性能增强，4-8 周

目标：

1. 接入缓存策略。
2. 完成搜索能力。
3. AI 调用缓存和限流。
4. 增加统计分析和排行榜。
5. 增加日志、监控、告警。

交付物：

1. Redis 缓存体系。
2. PostgreSQL FTS 或搜索服务。
3. Prometheus/Grafana。
4. 审计日志。
5. 学习统计。
6. 性能压测报告。

### 27.4 阶段 3：高并发扩展，2-3 个月

目标：

1. 服务无状态扩容。
2. 引入异步队列。
3. 拆分 AI Worker 和 Analytics Worker。
4. 数据库读写优化。
5. 支持高并发学习提交。

交付物：

1. Kubernetes 部署。
2. 队列系统。
3. 异步统计。
4. 数据库读副本。
5. 分区表。
6. 自动扩缩容。
7. 灰度发布。

### 27.5 阶段 4：规模化与智能化

目标：

1. 个性化推荐。
2. 学习提醒。
3. 多端同步。
4. 更复杂的搜索和推荐。
5. 运营后台和内容审核。

交付物：

1. 推荐系统。
2. 通知系统。
3. 移动端接口。
4. 内容审核流程。
5. 多区域容灾方案。

---

## 28. 最终推荐技术方案

### 28.1 推荐主方案

```text
前端：React + Vite + TypeScript
后端：Go + Gin/Chi
数据库：PostgreSQL
缓存：Redis
搜索：第一阶段 PostgreSQL FTS，后续 OpenSearch/Meilisearch
异步任务：Redis Streams / NATS / RabbitMQ
部署：Docker Compose 起步，生产 Kubernetes
监控：Prometheus + Grafana + OpenTelemetry
```

### 28.2 推荐理由

| 维度 | 结论 |
|---|---|
| 吞吐量 | Go 适合高并发 API 和低延迟场景 |
| 响应时间 | 核心接口可通过缓存和索引保持稳定低延迟 |
| 资源占用 | Go 服务部署轻量，横向扩展成本低 |
| 开发效率 | 比 Rust 更易落地，比复杂微服务更可控 |
| 维护成本 | 模块化单体便于初期维护，后续可平滑拆分 |
| 扩展能力 | PostgreSQL + Redis + 搜索服务组合成熟 |

### 28.3 备选方案

如果团队主要熟悉 TypeScript，可选：

```text
NestJS + Fastify + PostgreSQL + Redis
```

如果 AI 功能成为核心且需要大量模型编排，可将 AI 模块独立为：

```text
Python FastAPI AI Service
```

如果未来出现极致性能诉求，可将少量热点服务替换为：

```text
Rust + Axum
```

但当前阶段不建议直接采用 Rust 或复杂微服务，否则开发成本和维护成本会明显上升。

---

## 29. 实施验收标准建议

第一阶段完成后，建议按以下标准验收：

1. 用户可以注册、登录、退出。
2. 用户资料、学习阶段、每日目标可保存到数据库。
3. 单词数据由数据库提供，不再只依赖本地静态词库。
4. 复习状态由服务端保存，刷新浏览器后不丢失。
5. 学习提交接口能正确更新掌握度和下次复习时间。
6. 管理员可以维护词库并记录审计日志。
7. AI 接口具备缓存、限流和兜底逻辑。
8. 关键接口具备 OpenAPI 文档。
9. 日志中能按 `requestId` 追踪问题。
10. 至少完成一次基础压测和一次备份恢复演练。

---

## 30. 参考资料

- Go Effective Go：<https://go.dev/doc/effective_go>
- PostgreSQL JSON Types：<https://www.postgresql.org/docs/current/datatype-json.html>
- PostgreSQL Full Text Search：<https://www.postgresql.org/docs/current/textsearch.html>
- PostgreSQL Partitioning：<https://www.postgresql.org/docs/current/ddl-partitioning.html>
- Redis Docs：<https://redis.io/docs/latest/develop/get-started/>
- NestJS Performance：<https://docs.nestjs.com/techniques/performance>
- FastAPI Features：<https://fastapi.tiangolo.com/features/>
- JWT RFC 7519：<https://datatracker.ietf.org/doc/html/rfc7519>
- OpenAPI Specification：<https://spec.openapis.org/oas/latest.html>
- Kubernetes Deployment：<https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>
- OpenTelemetry：<https://opentelemetry.io/docs/what-is-opentelemetry/>
- Elastic Full-text Search：<https://www.elastic.co/docs/solutions/search/full-text>
