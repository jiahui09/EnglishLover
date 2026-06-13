# 第四阶段：技术架构设计

> 项目名称：EnglishLover 在线英语学习平台 Web 端  
> 阶段名称：第四阶段——技术架构设计  
> 文档状态：技术架构设计评审稿  
> 依据材料：`README.md`、`DESIGN.md`、`docs/online-english-learning-platform-development-process.md`、`docs/phase-1-project-initiation-and-requirements-analysis.md`、`docs/phase-2-requirements-specification-and-scope-control.md`、`docs/phase-3-product-and-user-experience-design.md`、`docs/function-analysis-and-system-architecture.md`、`docs/docker-compose-guide.md`  
> 核心范围：今日学习、单词记忆、阅读练习、受控笔友写信、今日成果记录、基础安全与部署运维  
> 事实边界：当前仓库可核查材料主要为项目文档。`README.md` 和既有文档提到 `front/`、React/Vite/TypeScript/Express 等实现线索，但本次落地时未在仓库根目录核验到完整 `front/` 源码目录。因此本文定位为目标技术架构设计，不声明相关功能已经在代码中实现；后续如补充真实代码、接口、数据库或部署配置，应以真实实现同步修订本文。

---

## 1. 结论概述

EnglishLover 首版应采用“**React/Vite Web 前端 + 模块化单体后端 + PostgreSQL 主数据库 + Redis 缓存与异步辅助 + Docker Compose 起步部署**”的技术架构。这里的“模块化单体后端”是架构形态要求，不等同于必须立即使用 Go 重写；在现有代码资产未完成基线调查前，后端语言和框架只能作为候选方案。

推荐目标架构如下：

```text
用户浏览器
  |
CDN / Nginx / Caddy / API Gateway
  |
React + Vite 前端静态资源
  |
RESTful API /api/v1
  |
模块化单体后端
  |-- Auth 用户认证与权限
  |-- User 用户资料与学习档案
  |-- Today 今日任务
  |-- Vocabulary 单词与复习
  |-- Reading 阅读练习
  |-- PenPal 受控笔友写信
  |-- Safety 内容安全检查
  |-- Analytics 学习记录与统计
  |-- Admin 内容与审计管理
  |-- AI Adapter 可选 AI 能力适配
  |
PostgreSQL 主数据库
Redis 缓存 / 限流 / 分布式锁 / Outbox 发布后的轻量队列
对象存储（可选：音频、导入文件、备份）
PostgreSQL 英文 FTS 起步，中文/中英混合搜索先用基础匹配或分词扩展，后续 OpenSearch / Meilisearch
日志、指标、链路追踪、备份与告警体系
```

第一阶段到第三阶段已经明确项目定位、需求范围和 UX 约束：平台不是开放社区、商城或复杂推荐系统，而是一个免费、低干扰、任务导向的英语自学工作台。第四阶段技术架构需要服务这个目标，优先保证单词、阅读、写信和今日成果四条核心闭环可保存、可恢复、可测试、可部署。

当前不建议首版直接采用复杂微服务或重型云原生架构。更合理的路线是先建设模块边界清晰的后端单体和稳定数据模型，当 AI、搜索、统计、审核等模块出现独立扩展压力后，再逐步拆分。

---

## 2. 信息缺口与架构假设

### 2.1 当前信息缺口

| 编号 | 信息缺口 | 影响范围 | 本文处理方式 |
|---|---|---|---|
| G-01 | 当前仓库未核验到完整 `front/` 源码目录 | 现有实现迁移、接口对接、构建命令确认 | 本文只给目标架构，不声明已实现 |
| G-02 | 首版账号策略未最终确认：匿名、本地、测试账号还是真实登录 | 用户隔离、学习记录、笔友关系、安全权限 | 架构按正式账号能力设计，MVP 可用测试账号降级 |
| G-03 | 单词、阅读、音频、例句来源和授权未最终确认 | 内容表结构、合规、上线边界 | 数据模型保留 `source`、`license_info`、`status` |
| G-04 | 内容安全规则维护方式未最终确认 | 写信审核、规则热更新、误判复核 | 首版按服务端规则引擎设计，AI/人工审核后置 |
| G-05 | 是否接入 AI 能力未最终确认 | 语言检查、阅读生成、单词解释、隐私告知 | AI 作为可选 Adapter，不作为核心流程唯一依赖 |
| G-06 | 部署目标环境未最终确认 | Docker、Compose、云服务、Kubernetes 选型 | 本地/测试优先 Compose，生产按可演进架构设计 |
| G-07 | 真实用户量和压测数据缺失 | 性能指标和容量规划 | 本文性能指标为工程目标，需后续压测验证 |
| G-08 | 现有代码资产未完成基线调查 | 后端语言、框架、迁移成本、MVP 排期 | 技术选型必须先完成资产盘点；Go 只能作为目标候选，不得在未评估 Express/Node 资产前直接重写 |

### 2.2 本文采用的架构假设

| 编号 | 假设 | 架构影响 |
|---|---|---|
| A1 | 首版以 Web 端 MVP 为主，不建设移动 App | 前端采用响应式 Web 架构 |
| A2 | 平台保持免费，不建设支付、会员、电商 | 不设计订单、支付、权益服务 |
| A3 | 首版核心是学习闭环验证，不追求复杂社区 | 不引入实时聊天、大型社交关系和动态流架构 |
| A4 | 笔友关系采用受控一对一或管理员预配置测试关系 | 需要关系权限、安全检查、通信历史，但不需要开放匹配系统 |
| A5 | AI 能力可能不可用 | AI 接口必须有超时、缓存、降级和开关 |
| A6 | 学习记录必须来自真实行为 | 需要事件日志、学习会话、每日统计表，不使用固定假数据 |
| A7 | 后续可能扩展搜索、统计、AI、审核后台 | 首版保留接口和数据扩展点，但不提前建设复杂服务 |
| A8 | 若后续恢复 `front/` 或 Express 服务端代码，应优先保护可复用资产 | 技术路线需允许“Node/Express 过渡 + 渐进式模块化”，避免为了 Go 目标架构而重写可用 MVP 能力 |

---

## 3. 建设目标与设计原则

### 3.1 技术建设目标

| 目标编号 | 目标 | 说明 |
|---|---|---|
| TA-01 | 核心闭环可保存 | 单词答题、阅读答题、写信草稿、发送记录和今日成果必须可靠落库 |
| TA-02 | 中断可恢复 | 单词会话、阅读位置、写信草稿在刷新、断网、失败后尽量保留 |
| TA-03 | 安全可解释 | 写信安全检查失败要返回原因、定位范围和修改入口，不清空草稿 |
| TA-04 | 模块边界清晰 | 单词、阅读、写信、统计、安全通过接口或事件交互 |
| TA-05 | 外部依赖可降级 | AI、音频、外部审核不可阻断基础学习流程 |
| TA-06 | 性能可度量 | 首页、学习提交、今日任务、阅读详情等关键路径有指标和监控 |
| TA-07 | 部署可重复 | 使用 Docker/Compose 描述运行拓扑，避免依赖人工临场操作 |
| TA-08 | 后续可演进 | 统计、搜索、AI、安全审核可按压力拆分为独立服务 |

### 3.2 架构设计原则

1. **模块化单体优先**  
   MVP 阶段业务边界仍在验证，直接微服务化会增加部署、事务、监控和排障成本。先采用模块化单体，有利于快速形成稳定闭环。

2. **数据库作为真实数据源**  
   PostgreSQL 保存用户、单词、阅读、信件、事件和统计事实。Redis、前端缓存、搜索索引只能作为加速或辅助，不能成为唯一真实数据源。

3. **异步队列不阻断主事务**  
   同步 API 不直接以 Redis Streams 写入成功作为业务成功条件。核心写操作应先在同一数据库事务中写入业务表和 Outbox 事件，再由 Worker 发布到 Redis 队列并重试，避免队列短暂不可用导致单词提交、阅读答题或信件发送回滚。

4. **核心流程不依赖 AI**  
   AI 可以用于单词解释、阅读生成、语言检查或辅助审核，但单词练习、阅读答题、草稿保存和基础安全检查必须在 AI 不可用时继续工作。

5. **安全优先于社交扩展**  
   笔友模块首版只做受控一对一写信闭环，不做开放广场、群聊、动态流、实时聊天。

6. **前端体验低干扰、可恢复**  
   学习页面需要明确加载、空、错误、保存中、保存失败、完成和恢复状态，避免静默失败。

7. **预留扩展但不展示不可用入口**  
   数据模型和接口可以保留扩展字段，但首版界面不展示灰色“敬请期待”或不可用功能入口。

---

## 4. 总体架构与分层设计

### 4.1 总体部署视图

```text
┌────────────────────┐
│ 用户浏览器           │
└─────────┬──────────┘
          │ HTTPS
┌─────────▼──────────┐
│ CDN / Reverse Proxy │
│ Nginx / Caddy       │
└─────────┬──────────┘
          │
┌─────────▼──────────┐
│ Web Frontend        │
│ React + Vite        │
└─────────┬──────────┘
          │ /api/v1 JSON
┌─────────▼──────────┐
│ API Backend         │
│ Modular Monolith    │
└────┬────┬────┬──────┘
     │    │    │
     │    │    └──────────┐
     │    │               │
┌────▼────▼────┐   ┌──────▼──────┐
│ PostgreSQL   │   │ Redis        │
│ Source of    │   │ Cache/Stream/│
│ Truth        │   │ Rate Limit   │
└────┬─────────┘   └──────┬──────┘
     │                    │
┌────▼─────────┐   ┌──────▼──────┐
│ Backup /     │   │ Workers      │
│ Object Store │   │ Analytics/AI │
└──────────────┘   └─────────────┘
```

### 4.2 逻辑分层

| 层级 | 职责 | 关键设计 |
|---|---|---|
| 表现层 | 页面、组件、交互状态、响应式、无障碍 | React/Vite/TypeScript，组件复用，学习流程 3 层内 |
| API 层 | REST API、鉴权、参数校验、错误码、限流、OpenAPI | `/api/v1`，统一响应，`requestId`，幂等键 |
| 领域层 | 今日任务、单词复习、阅读答题、写信安全、统计口径 | 模块化单体，领域服务隔离 |
| 数据访问层 | 事务、查询、迁移、索引、分区 | PostgreSQL，迁移脚本，Repository/DAO 封装 |
| 缓存与异步层 | 缓存、限流、Outbox 发布、异步统计、队列重试 | Redis Streams 仅作分发通道，数据库事件表负责可靠提交和补偿 |
| 集成层 | AI、内容审核、音频、对象存储、通知 | Adapter 模式，可开关、可降级 |
| 运维层 | 日志、指标、链路追踪、备份、告警、发布 | JSON 日志，Prometheus，OpenTelemetry，Docker/Compose |

---

## 5. 核心模块划分与职责边界

### 5.1 模块清单

| 模块 | 核心职责 | 边界说明 |
|---|---|---|
| Auth | 注册、登录、退出、Token 刷新、角色权限 | 不处理具体学习业务 |
| User | 用户资料、学习目标、时区、偏好、安全档案基础信息 | 不直接计算学习统计 |
| Today | 今日任务生成、回流策略、完成状态聚合 | 不直接修改单词、阅读、写信明细 |
| Vocabulary | 单词库、单词详情、复习队列、4 选 1 练习、复习状态 | 不直接生成阅读文章 |
| Reading | 阅读列表、文章详情、题目、解析、阅读记录、生词加入队列 | 加入生词通过 Vocabulary 接口完成 |
| PenPal | 受控关系、收件箱、草稿、信件发送、通信历史 | 不绕过 Safety 直接发送 |
| Safety | 联系方式、社交账号关键词、敏感词、关系权限、安全检查结果 | 首版以规则为主，AI/人工审核后置 |
| Analytics | 今日成果、学习时长、模块完成数量、连续学习天数 | 数据来自事件与完成记录，不允许假数据 |
| Admin | 内容维护、测试关系配置、审核规则配置、审计日志 | 管理员权限分级和留痕 |
| AI Adapter | AI 解释、语言检查、文章生成等可选能力 | 外部失败必须降级，不影响核心保存 |

### 5.2 推荐后端目录结构

如后端采用 Go，可参考：

```text
backend/
  cmd/server/
  internal/
    auth/
    user/
    today/
    vocabulary/
    reading/
    penpal/
    safety/
    analytics/
    admin/
    ai/
    common/
      config/
      errors/
      logger/
      middleware/
      response/
      database/
  migrations/
  docs/openapi/
```

若后端继续使用 TypeScript/Node，也应保持相同领域边界，不应把全部业务堆在一个 `server.ts` 中。

### 5.3 推荐前端目录结构

```text
frontend/
  src/
    app/
    components/
      common/
      feedback/
      layout/
    features/
      today/
      vocabulary/
      reading/
      penpal/
      analytics/
    services/
      apiClient.ts
      authService.ts
    types/
    utils/
    styles/
```

设计原因：

- 通用组件和业务模块分离；
- API 请求集中封装，便于统一错误处理和鉴权；
- `features/` 按业务能力组织，便于后续局部重构。

### 5.4 前端可恢复性技术方案

TA-02 不能只停留在“中断可恢复”的目标描述上，前端必须实现本地暂存、提交队列、恢复提示和服务端确认的完整机制。核心原则是：**已提交学习事实以服务端为准，未提交交互状态可在本地短期暂存，所有写入接口使用幂等键避免重复计数。**

#### 5.4.1 前端本地持久化范围

| 数据类型 | 本地保存位置 | 服务端保存位置 | 保存策略 | 清理规则 |
|---|---|---|---|---|
| 单词已提交答案 | 不作为主存，只缓存最近提交状态 | `review_events`、`user_word_states` | 逐题提交，失败时进入本地 pending 队列 | 服务端确认后清理 pending 项 |
| 单词当前未提交题面和选择 | `sessionStorage` 或 IndexedDB | `user_resume_snapshots` 可选 | 刷新后恢复题面和已选项，但用户需重新确认提交 | 会话完成、放弃或过期后清理 |
| 阅读位置和辅助展开状态 | IndexedDB / localStorage 小字段 | `reading_progress_states` | 定时节流保存，如 5-10 秒或段落切换时保存 | 阅读完成后保留最终记录，清理临时状态 |
| 阅读已提交答案 | 本地只缓存展示状态 | `reading_answer_events` | 提交即落服务端，失败进入 pending 队列 | 服务端确认后清理 pending 项 |
| 写信草稿 | IndexedDB 优先，localStorage 仅保存元数据 | `letter_drafts` | 输入节流自动保存，本地和服务端均保存版本号 | 发送成功后归档或清理；退出登录时提示清理本地草稿 |
| 安全检查结果 | sessionStorage 短期缓存 | `safety_check_results` | 仅缓存最近一次检查结果和高亮范围 | 内容变更或超时后失效 |

隐私限制：本地不得长期保存已发送信件正文、Token、密码或完整后台审计数据。写信草稿属于敏感数据，必须提供“清除此设备草稿”的入口；退出登录时应提示是否清理本地草稿。

设备边界：本地恢复项和服务端 `user_resume_snapshots` 都必须绑定 `clientId` 或 `deviceId`。同一用户跨设备登录时，默认只恢复当前设备产生的断点；若要恢复其他设备的进度，应先展示来源设备、最后保存时间和模块，再由用户主动选择。退出登录或点击“清除此设备草稿”只清理当前设备的本地数据和对应设备快照；账号注销才清理该用户所有设备的恢复快照。

#### 5.4.2 本地恢复对象模型

```text
LocalRecoveryItem
- recoveryId: string
- userIdOrLocalId: string
- clientId: string
- deviceId: string | null
- module: "word" | "reading" | "penpal"
- entityId: string
- sessionId: string | null
- idempotencyKey: string | null
- version: number
- status: "draft" | "pending_sync" | "synced" | "conflict" | "expired"
- payload: JSON
- lastLocalSavedAt: timestamp
- lastServerSyncedAt: timestamp | null
- expiresAt: timestamp
```

#### 5.4.3 提交与恢复流程

```text
用户操作
  -> 更新页面状态
  -> 写入 LocalRecoveryItem
  -> 若是正式提交：生成 idempotencyKey 并调用 API
      -> 成功：写入服务端返回状态，标记 synced，清理 pending
      -> 失败：标记 pending_sync，提示稍后自动重试/手动重试
  -> 页面刷新或重新进入
      -> 读取本地恢复项
      -> 拉取服务端最新状态
      -> 合并或提示冲突
```

冲突处理规则：

| 场景 | 处理规则 |
|---|---|
| 已提交答案本地与服务端不一致 | 服务端事件为准，前端只显示已提交结果，不重复提交 |
| 未发送草稿本地版本更新 | 若服务端版本未更新，使用本地版本继续编辑并触发同步 |
| 自动保存中的草稿本地和服务端均更新 | 默认最后写入胜出（LWW），由 `client_updated_at` / `last_saved_at` 判定最新版本；自动保存采用 3-5 秒节流或心跳式保存，不在输入过程中频繁弹冲突框 |
| 手动保存或发送时发现草稿版本冲突 | 标记 conflict，提示用户选择“使用本设备版本”“使用云端版本”或“复制本设备内容另存为草稿”；发送动作必须基于用户确认后的版本继续 |
| 关系已解除但本地仍有草稿 | 草稿保留给作者本人，但发送按钮禁用，提示关系已不可通信 |
| 阅读文章下架或内容版本变化 | 保留阅读记录，提示文章已更新或不可继续，提供重新开始入口 |

#### 5.4.4 前端验收口径

- 刷新单词练习页后，已提交题目不丢失、不重复计数；
- 断网提交答案时进入待同步队列，恢复网络后可重试；
- 阅读刷新后恢复到最近阅读位置，已提交题目仍显示结果；
- 写信刷新后恢复最近草稿内容和保存状态；
- 安全检查失败或网络失败不清空草稿；
- 退出登录或切换账号时，不把 A 用户本地草稿展示给 B 用户。

---

## 6. 关键业务流程与数据流转

### 6.1 今日学习流程

```text
用户进入首页
  -> Today 查询用户今日状态
  -> 聚合 Vocabulary / Reading / PenPal / Analytics 数据
  -> 生成三个固定任务槽位
      1. 单词任务
      2. 阅读任务
      3. 写信任务
  -> 用户选择任务
  -> 完成后写入业务记录
  -> 发布 learning_activity_completed 事件
  -> Analytics 更新今日成果
  -> 首页完成度刷新
```

关键决策：

- 首页采用“固定任务槽位 + 数据驱动状态”，不是内容推荐流；
- Today 模块只负责聚合和生成建议，不直接篡改单词、阅读、写信业务事实；
- 今日任务完成度必须来自真实事件或完成记录。

### 6.2 单词复习流程

```text
GET /api/v1/reviews/due
  -> 查询 user_word_states 到期词、错词、低掌握词
  -> 按优先级生成复习队列
  -> 返回练习题和 sessionId

POST /api/v1/reviews/submit
  -> 校验用户身份和 sessionId
  -> 校验 wordId、答案、题型
  -> 事务写入 review_events
  -> 更新 user_word_states
  -> 发布 review_submitted 事件
  -> 返回即时反馈和 nextReviewAt
```

关键规则：

- MVP 主动回忆题型采用 4 选 1 释义选择题；
- 队列优先级为：到期词、上一会话错词、低掌握词；
- 已提交题目不可重复计数；
- 重新开始只清除未完成会话进度，不删除已产生学习事件；
- 每日新词和复习数量受上限保护，默认可采用新词 10、复习 30。

### 6.3 阅读练习流程

```text
用户进入阅读列表
  -> 根据冷启动规则或历史记录推荐文章
  -> 打开文章详情
  -> 保存阅读位置和辅助展开状态
  -> 提交题目答案
  -> 返回正确率、解析、原文依据
  -> 写入 reading_records / reading_answer_events
  -> 用户可将重点词加入单词学习队列
  -> 发布 reading_completed 事件
```

关键规则：

- 只打开文章不算完成；
- 阅读完成至少需要提交配置题目；
- 解析必须提供原文依据；
- 生词加入单词模块不等于已掌握；
- 阅读记录默认私有。

### 6.4 受控笔友写信流程

```text
用户进入写信模块
  -> 校验是否存在 active 关系
  -> 打开草稿或新建草稿
  -> 自动保存 letter_drafts
  -> 点击“检查并发送”
  -> Safety 检查内容和关系权限
      -> 通过：同一事务写入 letters、通信历史和 activity_events(penpal_activity_completed, publish_status=pending)
      -> 拦截：保留草稿，返回高亮范围和解释
      -> 超时/失败：保留草稿，提示重试或降级
  -> Outbox Worker 发布事件
  -> Analytics 异步更新今日写作完成数
```

关键规则：

- 安全检查失败不得清空或自动改写正文；
- 解除关系、屏蔽后不能继续发信；
- 信件写入历史之前不得提示发送成功；
- AI 润色不能替用户自动代写整封信。

---

## 7. 技术选型与依据

### 7.1 技术选型门禁

补充决策依据见 [`asset-baseline-investigation-report.md`](asset-baseline-investigation-report.md)。

当前仓库文档曾提到 `front/server.ts` 和 Express，但本次未核验到完整 `front/` 源码目录。因此后端选型必须先完成“现有资产基线调查”，再决定是延续 Node/Express、迁移到 NestJS/Fastify，还是新建 Go 服务。

技术选型门禁如下：

| 门禁项 | 必须确认的问题 | 决策影响 |
|---|---|---|
| 源码基线 | 是否存在可运行的 `front/`、`server.ts`、API 路由、业务逻辑、测试和构建脚本 | 决定是复用、模块化改造还是新建服务 |
| 业务资产 | 现有 Express 是否已包含 AI 代理、用户状态、学习提交、管理能力 | 若已有可用逻辑，优先封装和迁移，不直接推倒重写 |
| 团队能力 | 团队是否熟悉 Go、Node、数据库迁移、部署运维 | 决定 MVP 技术风险 |
| 排期约束 | 是否以毕业设计/MVP 快速验收为主 | 排期紧时优先复用现有 Node/Express 资产 |
| 性能证据 | 是否已有压测证明 Node 无法满足目标 | 没有证据时不得仅因性能想象切换 Go |

选型决策规则：

1. 若恢复后确认 Express 服务端已存在且可运行，MVP 阶段优先采用 **Node/Express 模块化改造 + PostgreSQL + Redis**，避免重写造成交付风险。
2. 若现有后端只是 AI 代理且业务能力很少，可选择 **NestJS/Fastify** 或 **Go + Gin/Chi** 新建模块化后端。
3. 若团队主要熟悉 TypeScript，优先 NestJS/Fastify；若团队具备 Go 能力且目标是长期高并发 API，可选 Go。
4. 在完成资产盘点和迁移评估前，Go 只能作为目标候选，不作为强制推荐。
5. 所有迁移都必须保持旧接口或提供兼容层，避免前端一次性大改。

### 7.2 推荐主方案（完成门禁后的目标形态）

| 层级 | 推荐技术 | 原因 |
|---|---|---|
| 前端 | React + Vite + TypeScript | 与现有项目文档一致；组件化、类型约束、构建快 |
| 后端形态 | 模块化单体 | 比微服务更适合 MVP；语言需按资产调查决定 |
| 后端候选 A | Node/Express 模块化改造 | 若现有 Express 资产可复用，可最大限度降低沉没成本 |
| 后端候选 B | NestJS + Fastify | TypeScript 全栈统一，模块化和工程约束强 |
| 后端候选 C | Go + Gin 或 Chi | 高并发、低资源占用、部署简单，适合长期 API 服务 |
| 数据库 | PostgreSQL | 事务强、JSONB 灵活、全文搜索与分区能力成熟 |
| 缓存 | Redis | 缓存、限流、排行榜、轻量队列均可支持 |
| 搜索 | PostgreSQL 英文 FTS + 基础匹配起步 | 首版词库和文章规模不大；中文释义不默认依赖 `english` FTS，避免上线后搜索不可用 |
| 异步任务 | 数据库 Outbox + Redis Streams 起步，后续 NATS/RabbitMQ | 主流程先提交数据库事件，再由 Worker 发布队列；避免 Redis 不可用时阻塞核心写入 |
| 部署 | Docker Compose 起步，后续 Kubernetes | 先保证可重复部署，再处理大规模调度 |
| 监控 | Prometheus + Grafana + OpenTelemetry | 指标、日志、链路统一，便于排障 |

### 7.3 备选方案比较

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| Node/Express 模块化改造 | 复用现有资产，上手快，MVP 风险低 | 需要补足模块边界、类型约束、测试和监控 | 若现有 Express 代码可用，优先作为 MVP 路线 |
| NestJS + Fastify | TypeScript 全栈统一，开发快，模块化更清晰 | 需要框架迁移，仍有改造成本 | TS 团队且 Express 资产较少时推荐 |
| Go + Gin/Chi | 性能好、部署轻、长期扩展好 | 团队若不熟 Go 有学习成本；若已有 Node 资产会产生重写成本 | 适合资产较少或长期服务化目标明确时采用 |
| 微服务 | 独立扩展、团队边界清晰 | 部署、运维、事务、排障复杂 | 不建议首版直接采用 |
| Rust + Axum | 性能强、安全性好 | 开发成本高，迭代慢 | 非当前阶段优先项 |

---

## 8. 数据库与存储方案

### 8.1 用户与权限

```text
users
- id UUID PK
- email VARCHAR UNIQUE
- password_hash VARCHAR
- display_name VARCHAR
- status VARCHAR
- created_at TIMESTAMP
- updated_at TIMESTAMP

roles
- id UUID PK
- name VARCHAR UNIQUE

user_roles
- user_id UUID
- role_id UUID

user_profiles
- user_id UUID PK/FK
- current_stage VARCHAR
- daily_new_word_limit INT
- daily_review_limit INT
- timezone VARCHAR
- locale VARCHAR
- streak_count INT
- settings JSONB -- 隐私偏好、AI 功能开关、AI 授权状态等用户设置
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

`user_profiles.settings` 是用户偏好与授权状态的唯一存储位置，不再单独设计 AI 设置表或 AI 授权表。建议 JSON 结构如下，后续接口只更新该字段中对应路径：

```json
{
  "privacy": {
    "allow_anonymized_learning_analytics": false,
    "allow_personalized_recommendations": false
  },
  "ai": {
    "ai_features_enabled": false,
    "ai_language_check_enabled": false,
    "ai_content_generation_enabled": false,
    "consents": {
      "language_check": {
        "status": "denied",
        "consent_version": "v1",
        "granted_at": null,
        "revoked_at": null
      }
    }
  }
}
```

AI 与个性化能力默认应遵循“可关闭、可解释、可降级”。如果学校或项目要求默认关闭第三方 AI，则 `settings.ai.ai_features_enabled` 初始值应为 false，并在用户首次使用相关能力时弹出用途说明。用户注销时删除 `user_profiles` 记录即可同时清理隐私偏好和 AI 授权状态；如需证明授权撤回事实，只能在删除日志中保留不可识别的操作摘要。

### 8.2 单词与复习

```text
stages
- id VARCHAR PK
- name VARCHAR
- description TEXT
- sort_order INT
- enabled BOOLEAN

words
- id UUID PK
- word VARCHAR
- word_lower VARCHAR
- phonetic VARCHAR
- translation TEXT
- pos VARCHAR
- stage_id VARCHAR
- difficulty INT
- examples JSONB
- tags TEXT[]
- source VARCHAR
- license_info TEXT
- status VARCHAR
- created_at TIMESTAMP
- updated_at TIMESTAMP

user_word_states
- user_id UUID
- word_id UUID
- learning_status VARCHAR
- mastery INT
- easiness NUMERIC
- interval_days INT
- repetitions INT
- wrong_attempts INT
- last_review_at TIMESTAMP
- next_review_at TIMESTAMP
- algorithm_version VARCHAR
- updated_at TIMESTAMP
PRIMARY KEY(user_id, word_id)

review_events
- id UUID PK
- user_id UUID
- word_id UUID
- session_id UUID
- mode VARCHAR
- question_payload JSONB
- answer_payload JSONB
- is_correct BOOLEAN
- duration_ms INT
- previous_state JSONB
- new_state JSONB
- occurred_at TIMESTAMP
```

### 8.3 阅读

```text
reading_articles
- id UUID PK
- title VARCHAR
- content TEXT
- difficulty VARCHAR
- topic VARCHAR
- estimated_minutes INT
- source VARCHAR
- license_info TEXT
- target_words JSONB
- status VARCHAR
- created_at TIMESTAMP
- updated_at TIMESTAMP

reading_questions
- id UUID PK
- article_id UUID
- type VARCHAR
- stem TEXT
- options JSONB
- correct_answer VARCHAR
- explanation TEXT
- evidence_text TEXT
- evidence_location JSONB

reading_records
- id UUID PK
- user_id UUID
- article_id UUID
- session_id UUID
- status VARCHAR
- progress_payload JSONB
- correct_count INT
- total_count INT
- effective_reading_seconds INT
- completed_at TIMESTAMP

reading_answer_events
- id UUID PK
- user_id UUID
- article_id UUID
- question_id UUID
- answer JSONB
- is_correct BOOLEAN
- duration_ms INT
- submitted_at TIMESTAMP
```

### 8.4 笔友写信

```text
penpal_profiles
- user_id UUID PK
- nickname VARCHAR
- english_level VARCHAR
- interests JSONB
- visible_fields JSONB
- created_at TIMESTAMP
- updated_at TIMESTAMP

penpal_relations
- id UUID PK
- user_id UUID
- peer_user_id UUID
- status VARCHAR -- active / blocked / ended
- created_by UUID
- created_at TIMESTAMP
- ended_at TIMESTAMP

letter_drafts
- id UUID PK
- user_id UUID
- relation_id UUID
- client_id VARCHAR NULL
- device_id VARCHAR NULL
- content TEXT
- save_status VARCHAR -- draft / saving / saved / conflict / send_ready
- last_saved_at TIMESTAMP
- client_updated_at TIMESTAMP
- last_edit_source VARCHAR -- autosave / manual_save / send_attempt
- version INT

letters
- id UUID PK
- relation_id UUID
- sender_id UUID
- receiver_id UUID
- content TEXT
- safety_status VARCHAR
- sent_at TIMESTAMP

safety_check_results
- id UUID PK
- user_id UUID
- target_type VARCHAR
- target_id UUID
- status VARCHAR
- rule_hits JSONB
- highlight_ranges JSONB
- explanation TEXT
- checked_at TIMESTAMP

reports
- id UUID PK
- reporter_id UUID
- target_user_id UUID
- relation_id UUID
- letter_id UUID NULL
- reason_code VARCHAR
- reason_detail TEXT
- status VARCHAR -- pending / under_review / action_required / rejected / resolved / appealed / closed
- severity VARCHAR -- low / medium / high / critical
- evidence_snapshot JSONB
- assigned_reviewer_id UUID NULL
- resolution VARCHAR NULL
- created_at TIMESTAMP
- updated_at TIMESTAMP

report_actions
- id UUID PK
- report_id UUID
- actor_user_id UUID
- action VARCHAR -- warn / hide_letter / suspend_relation / suspend_user / force_delete_user / reject / restore / close
- note TEXT
- created_at TIMESTAMP

report_appeals
- id UUID PK
- report_id UUID
- appellant_user_id UUID
- reason TEXT
- status VARCHAR -- submitted / accepted / rejected / closed
- reviewer_id UUID NULL
- created_at TIMESTAMP
- resolved_at TIMESTAMP

user_blocks
- id UUID PK
- blocker_user_id UUID
- blocked_user_id UUID
- relation_id UUID NULL
- reason VARCHAR NULL
- created_at TIMESTAMP
```

草稿版本规则：

1. 自动保存采用节流或心跳式写入，默认按最后写入胜出（LWW）更新 `letter_drafts`，避免用户输入过程中频繁遇到冲突弹窗；
2. `client_id` / `device_id` 用于区分多设备草稿来源，前端展示冲突时应说明来源设备和最后保存时间；
3. 用户点击“手动保存”或“检查并发送”时，服务端必须校验客户端提交的 `version`。若客户端版本落后于服务端，返回 `409 conflict` 和服务端草稿摘要，由用户选择覆盖、使用云端或复制本地内容；
4. 发送成功后草稿应归档或删除，不能继续作为可发送草稿参与自动保存。

关系状态字段必须至少支持：

```text
active       可通信
blocked      单方屏蔽，屏蔽方不再接收对方新信件
ended        关系解除，双方都不能继续发信
suspended    因举报或审核临时冻结，等待处理
```

历史信件默认仍对原参与双方可见，但存在以下限制：

1. 被安全处置隐藏的信件只显示占位和处置说明，不展示正文；
2. block/end/suspended 后不得继续发送新信件；
3. 未发送草稿保留给作者本人，可编辑为本地草稿，但不能在原关系下发送；
4. 关系状态变化应写入审计或关系事件记录；
5. 通知对方时只说明关系状态变化和可用操作，不暴露举报人的隐私细节。

### 8.5 学习会话、恢复状态、统计与审计

为避免一张表同时承载计划范围、会话状态和恢复载荷，本版将“Today 任务、学习会话、可恢复状态、事实事件”分离：

1. Today 模块的任务卡由 `user_word_states`、`reading_records`、`penpal_relations` 和 `activity_events` 等数据按需聚合生成，可进入 Redis 做短期缓存；不把 `learning_tasks` 作为主数据模型中的长期持久化表。
2. 用户真正进入单词、阅读或写信流程时，创建 `learning_sessions` 记录，并用 `target_scope` 记录本次会话选中的单词、文章或关系范围。
3. 刷新、断网、切换页面等可恢复 UI 状态统一写入 `user_resume_snapshots`，不写入正式统计事实。
4. 已提交、可统计的业务事实写入 `activity_events`，每日统计由后端聚合生成。
5. `activity_events` 同时作为 MVP 阶段的 Outbox 事件源：业务事务提交时写入 `publish_status=pending`，由 Worker 发布到 Redis Streams。Redis 只承载异步分发，不决定业务事务是否成功。

```text
learning_sessions
- id UUID PK
- user_id UUID
- module VARCHAR -- word / reading / penpal
- entry_type VARCHAR -- today_card / manual / recovery
- target_scope JSONB -- 本次会话目标范围，例如 word_ids/article_id/relation_id
- status VARCHAR -- active / completed / interrupted / discarded
- started_at TIMESTAMP
- last_active_at TIMESTAMP
- completed_at TIMESTAMP NULL

user_resume_snapshots
- id UUID PK
- user_id UUID
- client_id VARCHAR
- device_id VARCHAR NULL
- module VARCHAR -- word / reading / penpal
- session_id UUID NULL
- snapshot_key VARCHAR -- word_review_current / reading_progress / letter_draft_recovery
- state_version INT
- restore_scope VARCHAR -- device / account_opt_in
- resume_payload JSONB
- client_updated_at TIMESTAMP
- server_saved_at TIMESTAMP
- expires_at TIMESTAMP
UNIQUE(user_id, client_id, module, snapshot_key)

activity_events
- id UUID PK
- user_id UUID
- event_type VARCHAR
- module VARCHAR
- source_session_id UUID NULL
- payload JSONB
- occurred_at TIMESTAMP
- idempotency_key VARCHAR UNIQUE
- publish_status VARCHAR -- pending / published / failed
- published_at TIMESTAMP NULL
- retry_count INT
- next_retry_at TIMESTAMP NULL

learning_daily_stats
- user_id UUID
- stat_date DATE
- word_completed_count INT
- reading_completed_count INT
- writing_completed_count INT
- study_seconds INT
- task_completion_rate NUMERIC
- calculation_version VARCHAR
- updated_at TIMESTAMP
PRIMARY KEY(user_id, stat_date)

admin_audit_logs
- id UUID PK
- actor_user_id UUID
- action VARCHAR
- resource_type VARCHAR
- resource_id VARCHAR
- before_value JSONB
- after_value JSONB
- ip VARCHAR
- user_agent TEXT
- request_id VARCHAR
- created_at TIMESTAMP
```

职责边界：

| 表/对象 | 职责 | 不负责 |
|---|---|---|
| Today 任务卡 | 按需聚合今日建议任务，可短期缓存 | 不作为长期持久化事实表 |
| `learning_sessions` | 一次进入学习流程的生命周期与目标范围 | 不保存大段恢复载荷，不直接生成统计结论 |
| `user_resume_snapshots` | 可恢复 UI 状态和断点信息；按 `client_id` / `device_id` 隔离设备 | 不作为正式完成统计事实，注销时必须清理；退出登录只清理当前设备快照 |
| `activity_events` | 已发生且可统计的业务事实；MVP 可复用为 Outbox 事件源 | 不保存未提交草稿；不把 Redis 发布成功作为业务成功条件 |
| `learning_daily_stats` | 按日聚合结果 | 不直接接收前端手写统计值 |

### 8.6 索引建议

```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_words_stage_word ON words(stage_id, word_lower);
CREATE INDEX idx_words_tags_gin ON words USING GIN(tags);
CREATE INDEX idx_user_due_reviews ON user_word_states(user_id, next_review_at, learning_status);
CREATE INDEX idx_review_events_user_time ON review_events(user_id, occurred_at DESC);
CREATE INDEX idx_reading_records_user_time ON reading_records(user_id, completed_at DESC);
CREATE INDEX idx_resume_snapshots_user_module ON user_resume_snapshots(user_id, client_id, module, expires_at);
CREATE INDEX idx_letters_relation_time ON letters(relation_id, sent_at DESC);
CREATE INDEX idx_activity_events_user_time ON activity_events(user_id, occurred_at DESC);
CREATE INDEX idx_activity_events_publish ON activity_events(publish_status, next_retry_at, occurred_at);
```

`review_events`、`activity_events` 等高增长事件表后续可按月分区。

搜索索引补充说明：

1. `word_lower`、英文标题等英文文本可使用 PostgreSQL FTS 的 `english` 配置或前缀索引；
2. `words.translation`、中文阅读标题、中文摘要等中英混合字段不能默认使用 `english` FTS 作为中文搜索方案；
3. MVP 若不安装中文分词扩展，应将中文检索限定为 `ILIKE`、前缀匹配或 `pg_trgm` 相似匹配，并在产品文案中避免承诺复杂中文搜索；
4. 若需要较好的中文分词体验，需评估并配置 `zhparser` 或 jieba 分词扩展，明确数据库镜像、迁移脚本、备份恢复和运维兼容性；
5. 只有当内容规模、排序、拼写纠错或高亮需求明显上升时，再引入 OpenSearch / Meilisearch。

### 8.7 核心数据字典与统计口径

| 字段 | 所属对象 | 值域 / 单位 | 计算或写入规则 |
|---|---|---|---|
| `mastery` | `user_word_states` | 0-100 整数 | 用户对单词的当前掌握度。答对上升、答错下降；MVP 可采用规则分：首次正确 +15，复习正确 +10，错误 -20，下限 0，上限 100；后续算法升级需记录 `algorithm_version` |
| `easiness` | `user_word_states` | 1.3-2.8 小数 | 间隔重复容易度因子。初始 2.5；答题评分高则增加，错误则降低；不得低于 1.3；如果暂不实现 SM-2，可置为默认值并明确不参与计算 |
| `interval_days` | `user_word_states` | >=0 整数，单位天 | 下次复习间隔。由答题结果、`repetitions`、`easiness` 和最大间隔规则计算 |
| `repetitions` | `user_word_states` | >=0 整数 | 有效复习次数。只有正式提交并写入 `review_events` 后增加 |
| `wrong_attempts` | `user_word_states` | >=0 整数 | 累计错误次数。正式提交错误答案后增加 |
| `next_review_at` | `user_word_states` | 时间戳 | 根据 `occurred_at + interval_days` 得到；答错可设为当天稍后或次日，具体规则需算法版本化 |
| `study_seconds` | `learning_daily_stats` | 秒，>=0 | 后端根据 `activity_events`、会话开始/结束、前端心跳和 Page Visibility 信号聚合；前端只能上报过程信号，不能直接写最终统计值 |
| `task_completion_rate` | `learning_daily_stats` | 0-1 小数 | 当日完成任务槽位数 / 当日有效任务槽位数；任务槽位由 Today 聚合规则生成，完成事实来自 `activity_events` 和模块完成记录 |
| `effective_reading_seconds` | `reading_records` | 秒，>=0 | 阅读页可上报可见时长和交互心跳；后端过滤长时间无操作、页面隐藏和异常大值 |
| `idempotency_key` | `activity_events` / 写接口 | 字符串，全局唯一 | 前端每次正式提交生成；服务端用于去重，避免刷新或重试重复计数 |

数据口径原则：

1. 所有正式统计以服务端事件和聚合为准；
2. 前端计时只作为原始信号，必须由后端清洗；
3. 算法字段必须带 `algorithm_version` 或 `calculation_version`，避免后续升级污染历史；
4. 数据字典变更必须同步接口文档、迁移脚本和测试用例。

---

## 9. 接口设计与集成方式

### 9.1 API 基本规范

- 统一前缀：`/api/v1`
- 数据格式：JSON
- 鉴权：HttpOnly Cookie 或 Authorization Header
- 响应包含：`code`、`message`、`data`、`requestId`
- 写接口支持：`Idempotency-Key`
- 文档：OpenAPI

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
  "message": "invalid request",
  "details": {
    "field": "wordId"
  },
  "requestId": "req_xxx"
}
```

### 9.2 核心接口草案

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout

GET  /api/v1/today
GET  /api/v1/users/me
PATCH /api/v1/users/me/profile
GET  /api/v1/users/me/privacy-settings
PATCH /api/v1/users/me/privacy-settings
PATCH /api/v1/users/me/privacy-settings/ai/{feature}
GET  /api/v1/users/me/data-export

GET  /api/v1/words
GET  /api/v1/words/{id}
GET  /api/v1/reviews/due
POST /api/v1/reviews/submit

GET  /api/v1/readings
GET  /api/v1/readings/{id}
POST /api/v1/readings/{id}/answers
POST /api/v1/readings/{id}/words/{wordId}/queue

GET  /api/v1/penpal/inbox
GET  /api/v1/penpal/relations
POST /api/v1/penpal/drafts
POST /api/v1/penpal/letters/check
POST /api/v1/penpal/letters/send
POST /api/v1/penpal/relations/{id}/block
POST /api/v1/penpal/relations/{id}/end
POST /api/v1/reports
GET  /api/v1/reports/{id}
POST /api/v1/reports/{id}/appeals
GET  /api/v1/admin/reports
PATCH /api/v1/admin/reports/{id}
POST /api/v1/admin/reports/{id}/actions

GET  /api/v1/analytics/today
GET  /api/v1/analytics/overview

POST /api/v1/admin/words
PATCH /api/v1/admin/words/{id}
POST /api/v1/admin/users/{id}/force-deletion
GET  /api/v1/admin/account-deletion-requests/{id}
GET  /api/v1/admin/audit-logs
```

管理员强制注销接口说明：

| 项 | 要求 |
|---|---|
| 适用场景 | 严重违规、恶意账号、风险账号处置，且仅 `suspend_user` 不足以完成治理时 |
| 权限 | 必须具备 `user:force_delete`，建议二次确认或双人复核 |
| 请求体 | 至少包含受控枚举 `reason`、可选 `reasonDetail`、可选 `sourceReportId` 或 `scheduledDeleteAt` |
| 返回 | `POST` 仅创建强制注销任务，建议返回 `202 Accepted`、`deletionRequestId`、当前 `status` 和进度查询地址 |
| 流程 | 停用账号与令牌 -> 创建 `account_deletion_requests(requested_by_type=admin, reason_code=admin_force)` -> 由删除 Worker 异步执行数据删除/匿名化 -> 写入 `user_deletion_logs` 与 `admin_audit_logs` |
| 进度查询 | `GET /api/v1/admin/account-deletion-requests/{id}` 返回状态、计划执行时间、开始/完成时间、已处理资源计数、失败原因和是否可重试 |
| 完成状态 | `force_completed`，用于区别用户自助注销的 `completed` |
| 边界 | `suspend_user` 只限制功能，不触发数据删除；`force-deletion` 才进入数据治理清理流程。`scheduledDeleteAt` 不应由同步 API 阻塞等待，而应交由调度器或 Worker 到期执行 |

### 9.3 跨模块接口契约

| 契约 | 调用方 | 提供方 | 语义 |
|---|---|---|---|
| `addToWordLearningQueue` | Reading | Vocabulary | 阅读中加入生词，只创建或确认待学习状态，不计入掌握 |
| `penpal_activity_completed` | PenPal | Analytics | 信件成功写入发送记录后更新今日写作完成数 |
| `learning_activity_completed` | Vocabulary/Reading/PenPal | Analytics | 任一核心模块完成后更新今日成果 |
| `content_changed` | Admin | Cache/Search | 内容变更后刷新缓存或搜索索引 |

---

## 10. 缓存、搜索与消息机制

### 10.1 Redis 缓存策略

| Key | 内容 | TTL |
|---|---|---|
| `word:{id}` | 单词详情 | 1-24 小时 |
| `stage:{stage}:words:v{version}` | 阶段词库 | 30-60 分钟 |
| `user:{id}:profile` | 用户资料 | 5 分钟 |
| `user:{id}:today:{date}` | 今日任务聚合结果 | 1-5 分钟 |
| `ai:check:{hash}` | AI/规则检查结果缓存 | 1-7 天 |
| `rate:{ip}:{endpoint}` | 限流计数 | 秒级/分钟级 |

缓存原则：

1. 词库读多写少，适合较长缓存；
2. 复习状态变化频繁，不做长缓存；
3. AI 结果成本高，可强缓存；
4. TTL 增加随机抖动，避免缓存雪崩；
5. 不存在数据使用短 TTL 负缓存，避免穿透；
6. 缓存失效由内容版本号或事件驱动处理。

### 10.2 搜索方案

第一阶段搜索采用“英文 FTS + 基础匹配”组合，避免把 PostgreSQL 默认 `english` 配置误用于中文字段。

| 搜索对象 | MVP 默认方案 | 说明 |
|---|---|---|
| 英文单词、英文标题 | PostgreSQL FTS `english` 或 `word_lower` 前缀匹配 | 适合英文词形和简单标题检索 |
| 中文释义、中文摘要 | `ILIKE` / 前缀匹配 / `pg_trgm` 相似匹配 | 不承诺复杂分词、语义排序和高亮 |
| 阶段与标签 | 结构化字段过滤 | 优先用普通索引或 GIN 标签索引 |
| 阅读文章主题 | 结构化主题字段 + 标题基础匹配 | 先保证可查找，不做复杂推荐排序 |

如果产品验收要求“中文释义关键词搜索”达到接近分词搜索的效果，应在数据库层引入 `zhparser` 或 jieba 分词扩展，并同步更新部署镜像、迁移脚本和回归测试。否则，MVP 文档和前端文案只能表述为“基础匹配”。

当出现以下需求时，再引入 OpenSearch 或 Meilisearch：

- 拼写纠错；
- 中文分词；
- 多字段权重排序；
- 高亮显示；
- 高 QPS 搜索；
- 大规模内容库。

### 10.3 异步事件

MVP 采用数据库 Outbox + Redis Streams 的组合，而不是由同步 API 直接写 Redis 后再决定业务成败。

```text
同步 API
  -> 开启数据库事务
  -> 写入业务表（如 review_events / letters / reading_answer_events）
  -> 写入 activity_events(publish_status=pending, idempotency_key=...)
  -> 提交事务并向用户返回业务结果

Outbox Worker
  -> 扫描 pending / failed 且到达 next_retry_at 的 activity_events
  -> 发布到 Redis Streams
  -> 成功后标记 published / published_at
  -> 失败则增加 retry_count，写入 next_retry_at，触发告警或后续补偿
```

执行规则：

1. Redis Streams 不作为事实源。Redis 不可用时，不回滚已经提交的核心业务事务；
2. 消费方必须通过 `idempotency_key` 或事件 ID 保证幂等，避免 Worker 重试导致重复统计；
3. `activity_events` 若后续承载压力过大，可拆出独立 `outbox_events` 表，但 MVP 不额外增加表复杂度；
4. 统计、搜索刷新、缓存失效和通知均可异步补偿；只有安全检查通过、信件写入等用户可见事实必须在同步事务内完成。

| 事件 | 生产方 | 消费方 | 用途 |
|---|---|---|---|
| `review_submitted` | Vocabulary | Analytics | 更新每日单词统计 |
| `reading_completed` | Reading | Analytics | 更新阅读完成数和学习时长 |
| `penpal_activity_completed` | PenPal | Analytics | 更新写作完成数 |
| `content_changed` | Admin | Cache/Search | 刷新缓存和索引 |
| `safety_check_requested` | PenPal | Safety Worker | 异步安全检查，可选 |
| `daily_stats_rebuild_requested` | System | Analytics Worker | 统计重算 |

---

## 11. 认证鉴权与权限模型

### 11.1 认证方案

推荐采用：

```text
Access Token + Refresh Token
```

策略：

1. Access Token 短有效期，例如 15 分钟；
2. Refresh Token 7-30 天，支持轮换；
3. Web 端优先使用 HttpOnly + Secure + SameSite Cookie；
4. 退出登录时吊销 Refresh Token；
5. 登录失败限流；
6. 管理后台可增加二次验证。

### 11.2 权限模型

采用 RBAC + 业务关系校验。

| 角色 | 权限 |
|---|---|
| learner | 学习、阅读、写信、查看个人数据 |
| content_admin | 维护单词、阅读材料、题目 |
| safety_reviewer | 处理举报、安全复核，受限查看必要内容 |
| admin | 用户管理、系统配置、审计 |
| ops | 查看监控、日志、备份状态 |

笔友模块需要额外校验：

- 是否存在 active 关系；
- 是否被屏蔽；
- 是否已解除关系；
- 当前用户是否为信件参与方；
- 是否通过安全检查。

### 11.3 Admin 细粒度权限矩阵

Admin 接口不能只依赖“是否为管理员”的粗粒度判断，必须校验资源级和操作级权限，并强制写入审计日志。

| 权限码 | 允许操作 | 典型接口 | 审计要求 |
|---|---|---|---|
| `word:read` | 查看词库 | `GET /api/v1/admin/words` | 可记录查询条件摘要 |
| `word:create` | 新增单词 | `POST /api/v1/admin/words` | 必须记录新增字段 |
| `word:update` | 修改单词 | `PATCH /api/v1/admin/words/{id}` | 必须记录 before/after |
| `word:delete` | 删除或下架单词 | `DELETE /api/v1/admin/words/{id}` | 必须记录原因和操作者 |
| `reading:review` | 复核阅读材料和题目 | Admin Reading APIs | 必须记录内容状态变化 |
| `report:read` | 查看举报列表 | `GET /api/v1/admin/reports` | 必须记录访问范围，不默认展示完整私信正文 |
| `report:act` | 执行举报处置 | `POST /api/v1/admin/reports/{id}/actions` | 必须记录处置动作、理由和影响对象 |
| `user:restrict` | 限制用户通信能力 | Admin User APIs | 必须记录期限、理由、审批来源 |
| `user:force_delete` | 管理员强制注销违规或风险账号 | `POST /api/v1/admin/users/{id}/force-deletion` | 必须记录强制注销原因、影响范围、操作者、请求 ID 和状态 `force_completed` |
| `audit:read` | 查看审计日志 | `GET /api/v1/admin/audit-logs` | 必须记录二次审计访问 |
| `system:config` | 修改系统配置、安全规则 | Admin Config APIs | 必须记录配置差异和生效版本 |

权限校验要求：

1. 每个 Admin API 必须声明所需权限码；
2. 后端中间件只做身份解析，具体权限由权限服务校验；
3. 涉及用户私信、举报证据和安全规则的操作必须写 `admin_audit_logs`；
4. 高风险操作可要求二次确认或双人复核；
5. 审计日志不得由普通管理员自行删除或修改。

---

## 12. 安全防护与合规要求

### 12.1 应用安全

- 所有参数服务端校验；
- SQL 使用参数化查询；
- 防止 XSS，用户输入和 AI 输出均需转义；
- Cookie 鉴权场景启用 CSRF 防护；
- CORS 白名单；
- 请求体大小限制；
- 文件导入限制格式和大小；
- 高风险操作二次确认；
- 管理后台操作写审计日志。

### 12.2 数据安全

- 密码使用 Argon2id 或 bcrypt；
- 敏感配置使用环境变量或 Secret Manager；
- 备份加密；
- 数据库连接启用 TLS；
- 日志中不记录明文密码、Token、完整信件正文；
- 用户学习数据、草稿、通信内容默认私有。

### 12.3 内容安全

首版采用：

```text
服务端规则检测 + 可解释拦截 + 草稿保护
```

重点检测：

- 邮箱；
- 手机号；
- 社交账号关键词；
- 明显敏感词；
- 骚扰或违规表达的基础规则。

如果后续接入 AI 审核，必须满足：

1. 明确告知数据用途；
2. 设置超时和降级；
3. 不把 AI 判断作为不可解释黑盒；
4. 保留人工复核扩展入口；
5. 审核失败不得清空用户草稿。

### 12.4 AI 合规与用户控制机制

AI 能力必须落实到用户设置、授权状态和接口控制，而不是只停留在“告知用途”的原则说明。本架构将 AI 功能开关、隐私偏好和授权状态统一存储在 `user_profiles.settings` JSONB 字段中，避免为 MVP 引入额外设置表导致数据模型分裂。

| 控制项 | 数据路径 | 默认建议 | 生效范围 |
|---|---|---|---|
| 总开关 | `user_profiles.settings.ai.ai_features_enabled` | 未确认合规前默认 false | 所有第三方 AI 能力 |
| 语言检查 | `user_profiles.settings.ai.ai_language_check_enabled` | 默认 false 或首次使用时询问 | 写信语言检查、润色建议 |
| 内容生成 | `user_profiles.settings.ai.ai_content_generation_enabled` | 默认 false | 阅读生成、提示生成 |
| 匿名学习分析 | `user_profiles.settings.privacy.allow_anonymized_learning_analytics` | 默认 false 或按隐私政策确认 | 聚合分析、模型改进 |
| 个性化推荐 | `user_profiles.settings.privacy.allow_personalized_recommendations` | 默认 false 或显式说明 | 难度推荐、主题推荐 |
| 单项授权 | `user_profiles.settings.ai.consents.{feature}` | `denied` 或不存在视为未授权 | language_check、article_generation、word_explanation、safety_assist |

AI 调用数据分为两类：

1. **AI 功能开关与授权状态**：存储于 `user_profiles.settings`，敏感度中，随 `user_profiles` 删除。
2. **AI 调用内容日志**：仅当用户主动开启对应 AI 功能后才可能产生，敏感度高，默认不长期保存。若用户从未开启或已关闭 AI 功能，则不应存在新的 AI 调用内容日志。

AI 调用前置校验：

```text
请求 AI 功能
  -> 读取 user_profiles.settings
  -> 校验 settings.ai.ai_features_enabled 是否为 true
  -> 校验 settings.ai.consents.{feature}.status 是否为 granted
  -> 生成最小化请求载荷
  -> 调用 AI Adapter
  -> 默认只写调用状态、耗时、错误码等摘要日志，不记录不必要正文
  -> 超时或失败时走降级流程
```

接口契约：

```text
GET    /api/v1/users/me/privacy-settings
PATCH  /api/v1/users/me/privacy-settings
PATCH  /api/v1/users/me/privacy-settings/ai/{feature}
```

前端要求：

- 首次使用 AI 语言检查、阅读生成或个性化推荐前显示用途说明；
- 用户关闭 AI 后，相关按钮应隐藏或显示“已关闭，可在设置中开启”；
- AI 不可用时不得阻断草稿保存、基础阅读和单词练习；
- 不得把 AI 生成内容冒充用户真实经历或已完成学习结果。

### 12.5 社交滥用防护闭环

内容过滤只能降低发送入口风险，不能替代完整的社交滥用治理。笔友模块必须补齐举报、处置、通知、申诉和关系状态变化后的业务后果。

#### 12.5.1 举报处理状态机

```text
pending 用户提交举报
  -> under_review 审核人员或规则进入初筛
      -> rejected 证据不足或不成立
      -> action_required 举报成立，需要处置
          -> resolved 已执行处置
              -> appealed 被处置方提交申诉
                  -> accepted 申诉成立，恢复或调整处置
                  -> rejected 申诉驳回
          -> closed 归档
```

状态含义：

| 状态 | 触发条件 | 系统行为 |
|---|---|---|
| pending | 用户举报信件、关系或用户 | 创建 report，冻结证据快照，返回受理编号 |
| under_review | 系统或审核人员开始处理 | 限制重复举报刷屏，必要时临时冻结关系 |
| rejected | 举报不成立 | 通知举报人“未发现明确违规”，不暴露被举报人隐私 |
| action_required | 举报成立 | 进入处置选择：警告、隐藏信件、冻结关系、封禁用户等 |
| resolved | 处置执行完成 | 通知相关方结果和后续可用操作 |
| appealed | 被处置方申诉 | 保留原处置或改为临时处置，等待复核 |
| closed | 无进一步动作 | 归档，保留审计记录 |

#### 12.5.2 处置动作

| 动作 | 适用场景 | 后果 |
|---|---|---|
| warn | 轻微不当表达 | 向违规方提示规则，不影响历史信件 |
| hide_letter | 单封信件明显违规 | 历史中显示占位，不展示正文 |
| suspend_relation | 争议或风险未查清 | 双方暂不能继续发信，草稿保留 |
| end_relation | 关系解除 | 双方不能继续发信，历史默认仍可见 |
| block_user | 单方屏蔽 | 屏蔽方不再接收对方新信件，对方看到无法继续发送的状态 |
| suspend_user | 严重或重复违规 | 限制账号通信能力，进入管理员复核 |
| force_delete_user | 极端违规或风险账号需注销清理 | 仅 Admin 通过 `POST /api/v1/admin/users/{id}/force-deletion` 触发数据删除/匿名化流程，完成状态为 `force_completed` |
| restore | 误判恢复 | 恢复关系或信件可见性，记录原因 |

#### 12.5.3 关系解除、屏蔽和冻结后的业务后果

| 场景 | 历史信件 | 未发送草稿 | 新信件 | 通知 |
|---|---|---|---|---|
| block 单方屏蔽 | 默认双方仍可见，违规信件除外 | 作者本人保留，只能转为本地草稿或删除 | 被屏蔽方不能向屏蔽方发送 | 被屏蔽方看到“当前关系不可继续通信”，不暴露举报细节 |
| end 解除关系 | 默认双方仍可见，除非用户删除本地视图或信件被处置隐藏 | 保留给作者本人，但不能在原关系发送 | 双方都不能继续发送 | 双方收到关系已结束提示 |
| suspend 临时冻结 | 默认可见，高风险信件可暂时隐藏 | 保留给作者本人 | 双方暂不能发送 | 双方看到等待处理说明 |
| hide_letter 隐藏信件 | 显示占位和处置说明 | 不影响其他草稿 | 不必然终止关系，视严重程度联动 | 相关方收到内容处置通知 |

#### 12.5.4 通知与申诉原则

1. 举报人收到受理、处理完成和必要的补充材料提示；
2. 被举报人只在进入处置或限制功能时收到通知；
3. 通知不得暴露举报人身份和不必要的隐私细节；
4. 严重处置应提供申诉入口和处理时限；
5. 申诉结果必须写入 `report_appeals` 和 `report_actions`；
6. 审核人员查看私人通信内容必须基于举报、安全命中或明确复核任务，并写审计日志。

#### 12.5.5 MVP 最小闭环

MVP 不需要建设复杂人工审核工作台，但必须至少实现：

- 用户可举报单封信件或关系；
- 举报后生成记录和证据快照；
- 用户可 block 或 end 关系；
- block/end/suspend 后发送接口强校验并拒绝新信件；
- 关系状态变化后草稿不丢失，但不能在无效关系下发送；
- 管理员或测试人员可在后台查看举报列表并标记处理结果；
- 处理动作写入审计日志。

### 12.6 合规边界

用户注销、删除、匿名化、备份留存和审计保留策略见 [`data-retention-and-deletion-policy.md`](data-retention-and-deletion-policy.md)。

- 阅读材料、音频、例句和图片需记录来源和授权；
- 用户学习行为、写作草稿和通信内容默认私有；
- 如涉及未成年人使用，需要单独确认监护人同意、匹配范围和通信限制；
- 如使用第三方 AI 或审核服务处理信件内容，应明确告知数据用途并提供关闭或跳过选择。

---

## 13. 性能优化与容量目标

具体压测场景、数据规模、并发目标和执行时间表见 [`performance-test-plan.md`](performance-test-plan.md)。

性能指标必须绑定容量假设和运行环境，否则无法判断目标是否合理。以下指标是规划基线，不是当前已验证结果。

### 13.1 容量与成本基线

| 阶段 | 参考运行环境 | 并发假设 | 数据规模假设 | 性能目标适用性 |
|---|---|---|---|---|
| 本地/毕业设计演示 | 单机 Docker Compose；API 1 实例；PostgreSQL/Redis 本机容器 | 1-10 并发 | 样例词库、少量测试用户 | 用于功能演示，不承诺生产 P95 |
| MVP 测试环境 | API 1 实例 1 vCPU/1-2GB；PostgreSQL 1-2 vCPU/2-4GB；Redis 256MB-1GB | 20-50 并发用户 | 万级词条、百级用户、十万级事件 | 可验证核心接口 P95 是否接近目标 |
| 小规模生产 | API 2 实例各 1-2 vCPU/2GB；PostgreSQL 2 vCPU/4-8GB；Redis 1GB | 100-300 并发用户 | 十万级词条、千级用户、百万级事件 | 表中 P95 目标在该级别下才有评审意义 |
| 增长期 | API 水平扩展；PostgreSQL 读副本/分区；Redis 托管 | 300+ 并发用户 | 百万级事件以上 | 需要压测报告和容量规划，不再只靠本文估算 |

成本控制原则：

1. 没有真实压测前，不因想象高并发提前引入 Kubernetes、OpenSearch 或复杂微服务；
2. 若小规模生产下 P95 达标，优先保持简单架构；
3. 若瓶颈来自数据库慢查询，先做索引和查询优化，再扩容；
4. 若瓶颈来自 AI 或安全检查，先做缓存、限流和异步化，再拆服务；
5. 每次扩容必须记录触发指标、成本变化和收益。

### 13.2 前端体验指标

| 指标 | 目标 |
|---|---|
| 首页 / 单词 / 阅读 FCP | ≤ 1.5 秒 |
| LCP | ≤ 2.5 秒 |
| 点击、输入视觉反馈 | ≤ 100ms |
| AI/审核外部调用 | 5-8 秒内超时降级 |

### 13.3 后端 API 指标

| 接口类型 | 目标 |
|---|---|
| 缓存命中词库查询 | P95 < 100ms |
| 今日复习列表 | P95 < 150ms |
| 学习提交 | P95 < 200ms |
| 登录注册 | P95 < 300ms |
| AI 生成/语言检查 | 异步或可降级，不阻塞主流程 |

以上为工程目标，需后续压测验证，不代表当前项目已经达到。

### 13.4 优化手段

- 前端代码分割；
- 长列表分页或虚拟滚动；
- 静态资源 CDN；
- API gzip/brotli；
- PostgreSQL 复合索引；
- `review_events` 按月分区；
- 高频读接口缓存；
- 学习提交使用事务；
- 统计异步聚合；
- AI 请求缓存、限流、合并。

---

## 14. 可扩展性与高可用设计

### 14.1 阶段性扩展

MVP 阶段：

```text
单个 API 服务 + PostgreSQL + Redis
```

增长期：

```text
多 API 实例
  -> 负载均衡
  -> PostgreSQL 主从
  -> Redis Sentinel / Cluster
  -> Worker 独立扩容
```

规模化阶段：

```text
API Service
Review Service
AI Service
Safety Service
Analytics Worker
Search Service
```

### 14.2 拆分顺序建议

| 顺序 | 服务 | 拆分原因 |
|---|---|---|
| 1 | AI Service | 外部调用慢、成本高、易限流 |
| 2 | Analytics Worker | 统计可异步重算，适合独立扩容 |
| 3 | Search Service | 搜索索引和主库模型不同 |
| 4 | Safety Service | 审核规则复杂后需要独立维护 |
| 5 | Review Service | 学习提交 QPS 明显升高后拆分 |

---

## 15. 容灾备份与故障恢复

### 15.1 备份策略

| 组件 | 策略 |
|---|---|
| PostgreSQL | 每日全量备份 + WAL 归档 + 定期恢复演练 |
| Redis | 缓存可丢；如承载队列/排行榜则开启 AOF/RDB |
| 对象存储 | 开启版本管理和生命周期策略 |
| 搜索索引 | 可从 PostgreSQL 重建 |
| 配置 | 环境变量与 Secret 独立管理 |

### 15.2 RPO/RTO 建议

| 阶段 | RPO | RTO |
|---|---|---|
| MVP / 毕业设计演示 | 24 小时 | 4 小时 |
| 小规模生产 | 15 分钟 | 1 小时 |
| 高可用阶段 | 5 分钟 | 30 分钟 |

### 15.3 故障处理原则

1. 数据库故障优先恢复核心学习数据；
2. Redis 故障时核心读写走 PostgreSQL 降级；
3. AI 故障时关闭 AI 增强，不影响草稿保存和基础学习；
4. 搜索故障时降级为数据库基础查询；
5. 安全检查服务异常时保留草稿，提示重试或使用本地规则降级，不提示发送成功。

### 15.4 备份恢复后的反删除流程

数据库从备份恢复后，必须执行“反删除”校验，防止已注销用户的数据因恢复旧备份而复活：

1. 读取恢复点之后产生的 `user_deletion_logs` 和 `account_deletion_requests` 完成记录；
2. 对状态为 `completed` 或 `force_completed` 的注销请求重新执行用户数据清理脚本；
3. 对保留的聚合统计再次执行不可逆匿名化；
4. 校验 `users`、`user_profiles`、`user_word_states`、`user_resume_snapshots`、`letter_drafts` 等表中不存在已注销用户的可定位记录；
5. 将脚本执行结果写入 `admin_audit_logs` 或恢复审计记录。

该步骤应纳入容灾恢复预案，作为数据库恢复后的强制收尾步骤；未执行前不得对外恢复服务。

---

## 16. 部署架构与运行环境

### 16.1 本地与测试环境

推荐 Docker Compose：

```text
proxy      Nginx / Caddy，可选
frontend   React/Vite 构建产物
api        Go API 或现有 Node/Express 过渡服务
worker     异步任务
postgres   主数据库
redis      缓存与队列
```

当前仓库尚未提供真实 `Dockerfile`、`.dockerignore`、`docker-compose.yml`。后续落地时应补齐这些文件，并根据真实源码目录修订构建路径。

### 16.2 生产环境

```text
CDN
  |
Nginx / Caddy / Cloud Load Balancer
  |
Frontend Static Hosting
  |
API Service Replicas
  |
Worker Service
  |
Managed PostgreSQL
Managed Redis
Object Storage
Monitoring Stack
```

### 16.3 环境变量

```text
APP_ENV
APP_URL
API_BASE_URL
DATABASE_URL
REDIS_URL
JWT_SECRET
COOKIE_DOMAIN
CORS_ALLOWED_ORIGINS
GEMINI_API_KEY        # 可选
AI_FEATURE_ENABLED    # 可选
SAFETY_RULE_VERSION
```

所有密钥不得提交到仓库。

---

## 17. 研发协作与测试策略

### 17.1 协作流程

```text
需求确认
  -> 接口设计
  -> 数据库迁移设计
  -> 前后端并行开发
  -> 联调
  -> 自动化测试
  -> 评审
  -> 测试环境发布
  -> 验收
  -> 正式发布
```

### 17.2 测试分层

| 测试类型 | 覆盖内容 |
|---|---|
| 单元测试 | 复习算法、队列生成、安全规则、统计口径 |
| 组件测试 | 任务卡、练习题、阅读题、草稿保存状态 |
| API 集成测试 | 登录、复习提交、阅读提交、写信发送 |
| E2E 测试 | 单词闭环、阅读闭环、写信闭环、今日成果 |
| 安全测试 | 越权访问、关系解除后发信、XSS、CSRF、限流 |
| 性能测试 | 今日任务、复习队列、学习提交、首页加载 |

### 17.3 必须覆盖的 E2E 场景

1. 完成一次单词主动回忆；
2. 单词练习中断后恢复；
3. 完成一篇阅读并查看解析；
4. 阅读中加入生词；
5. 写信草稿保存、安全检查、发送成功；
6. 联系方式拦截且不丢稿；
7. 解除关系后不能发信；
8. 今日成果随真实行为更新。

---

## 18. 监控告警与日志追踪

### 18.1 结构化日志

日志采用 JSON 格式：

```json
{
  "level": "info",
  "time": "2026-06-13T10:00:00+08:00",
  "requestId": "req_xxx",
  "userId": "uuid",
  "method": "POST",
  "path": "/api/v1/reviews/submit",
  "status": 200,
  "latencyMs": 42
}
```

### 18.2 监控指标

重点监控：

- QPS；
- P50/P95/P99 延迟；
- 5xx 错误率；
- 登录失败次数；
- 数据库连接池；
- 慢查询；
- Redis 命中率；
- Outbox pending / failed 事件数；
- Redis Streams 队列堆积；
- AI 调用失败率；
- 安全拦截率；
- 草稿保存失败率；
- 备份成功率。

### 18.3 告警建议

| 告警项 | 建议阈值 |
|---|---|
| API 5xx | 5 分钟内 > 1% |
| 学习提交 P95 | 连续 10 分钟 > 500ms |
| 数据库连接池 | 使用率 > 80% |
| Outbox pending 积压 | 超过处理能力 10 分钟或 `failed` 持续增长 |
| Redis Streams 队列堆积 | 超过处理能力 10 分钟 |
| 草稿保存失败率 | 明显高于基线 |
| 备份失败 | 任一次失败立即告警 |

---

## 19. 发布运维流程

### 19.1 CI/CD 流程

```text
提交代码
  -> 安装依赖
  -> 格式检查
  -> 类型检查
  -> 单元测试
  -> API 集成测试
  -> 前端构建
  -> 后端构建
  -> Docker 镜像构建
  -> 数据库迁移检查
  -> 部署测试环境
  -> E2E 冒烟测试
  -> 人工确认
  -> 灰度/正式发布
  -> 健康检查
  -> 失败回滚
```

### 19.2 发布策略

- 数据库迁移向前兼容；
- 新功能使用 Feature Flag；
- AI、审核、推荐等外部依赖可一键关闭；
- 发布前备份数据库；
- 发布后执行核心 E2E 冒烟；
- 保留上一版本镜像用于回滚。

---

## 20. 关键架构决策记录

| 决策 | 原因 | 适用场景 | 预期收益 |
|---|---|---|---|
| 模块化单体优先 | MVP 阶段微服务成本过高 | 早期开发、毕业设计、小规模上线 | 降低部署与联调复杂度 |
| PostgreSQL 为主库 | 关系数据、事务、JSONB、FTS 兼顾 | 用户、单词、阅读、信件、统计 | 数据一致性好，扩展成熟 |
| Redis 辅助而非主存 | 缓存和队列可能短暂不可用 | 今日任务缓存、限流、Outbox 发布后的轻量队列 | 提升性能但不牺牲可靠性 |
| 数据库 Outbox 发布异步事件 | 同步 API 不能因 Redis 不可用回滚主流程 | 统计、搜索刷新、缓存失效、通知 | 主事务与异步逻辑解耦，支持重试和补偿 |
| 事件驱动统计 | 学习提交不能被统计拖慢 | 完成单词/阅读/写信后 | 主流程更快，统计可重算 |
| 安全检查页内完成 | 写信体验不能跳离编辑器 | 发送前审核 | 不丢稿、错误可解释 |
| AI 可选降级 | 外部 AI 不稳定且有隐私风险 | 语言检查、解释、生成 | 保证核心流程可用 |
| PostgreSQL 英文 FTS + 基础匹配起步 | 默认 `english` FTS 不适合中文分词 | 英文词库、标题、中文释义基础搜索 | 避免过早引入搜索集群，同时不误承诺中文搜索能力 |
| 技术选型先过资产基线门禁 | 文档提到 Express 但源码未核验，直接 Go 重写风险高 | 后端语言和框架决策 | 保护已有资产，降低 MVP 交付风险 |
| 社交滥用治理闭环 | 内容过滤无法覆盖持续骚扰和事后纠纷 | 笔友写信、举报、屏蔽、解除关系 | 提升安全可信度，降低法律和信任风险 |
| 前端本地恢复 + 服务端事实确认 | 只说可恢复无法防止刷新/断网丢进度 | 单词、阅读、写信核心流程 | 降低数据丢失和重复提交风险 |
| 设备级恢复快照 | 多设备登录可能让旧断点无提示复活 | `LocalRecoveryItem`、`user_resume_snapshots`、草稿恢复 | 退出登录只清当前设备，注销才清全部设备 |
| 学习会话拆分为 Today 任务卡、会话、恢复快照和事件 | 单表混合计划与恢复状态会造成职责混乱 | Today 聚合、学习会话、统计 | API 更清晰，统计事实更可靠 |
| 性能目标绑定容量基线 | 脱离硬件和并发的 P95 指标不可评审 | 性能评审、部署预算 | 避免过度设计或性能承诺失真 |
| Admin 权限码 + 强制审计 | 角色不足以表达具体操作边界 | 后台管理、举报处置、内容维护 | 降低越权和不可追溯风险 |
| AI 用户设置与授权记录 | 合规不能只靠原则声明 | AI 语言检查、生成、推荐 | 支持用户关闭、撤回和可解释处理 |

---

## 21. 风险识别与缓解措施

| 风险 | 影响 | 缓解措施 |
|---|---|---|
| `front/` 源码缺失或文档与代码不一致 | 实施方案无法直接对接现有代码 | 开发前先恢复或确认真实代码基线 |
| 技术选型与现有资产冲突 | 若已有 Node/Express 资产，直接 Go 重写会造成沉没成本和延期 | 建立技术选型门禁；未完成资产盘点前不得强制 Go；优先复用可运行资产 |
| 账号策略未定 | 影响用户隔离、笔友权限、学习记录 | MVP 可用测试账号，正式上线前必须确认 |
| 内容来源未定 | 版权与质量风险 | 记录 source/license，优先授权或自建内容 |
| AI 不稳定 | 阻塞语言检查/生成 | AI 可关闭、超时、缓存、规则降级 |
| 安全误判 | 用户挫败、草稿损失 | 不清空草稿，返回高亮范围和解释 |
| 范围膨胀 | 延误 MVP | 坚持 P0 闭环，社区/付费/复杂推荐延后 |
| 学习记录失真 | 用户误判进度 | 所有统计来自事件和完成记录 |
| 写信越权 | 隐私与安全事故 | 关系状态 + RBAC + 业务校验 |
| 社交滥用处置缺失 | 举报无闭环、关系解除后果不清，可能造成骚扰持续和信任危机 | 建立举报状态机、处置动作、通知申诉、关系状态后果和审计日志 |
| 性能指标未压测 | 上线后体验不确定 | 发布前做接口压测和前端性能检查 |
| 未成年人合规未确认 | 隐私与通信风险 | 上线前明确用户范围；若包含未成年人需单独机制 |
| 前端恢复机制缺失 | 刷新或断网导致学习进度、阅读位置或草稿丢失 | 实现 LocalRecoveryItem、pending 队列、幂等键和冲突恢复流程 |
| 性能目标与成本脱钩 | 过度优化或资源不足，性能承诺无法兑现 | 将 P95 指标绑定运行环境、并发和数据规模，压测后再承诺 |
| 数据字段口径不清 | `mastery`、`study_seconds` 等统计失真 | 建立数据字典、值域、计算版本和后端聚合规则 |
| 学习会话职责混乱 | 计划、恢复状态、事件混在一表导致 API 复杂 | Today 任务卡按需聚合，持久化拆分为 `learning_sessions`、`user_resume_snapshots`、`activity_events` |
| Admin 权限过粗 | 管理员越权或操作不可追溯 | 使用权限码矩阵并强制所有高风险 Admin 操作写审计日志 |
| AI 用户控制缺失 | 数据处理透明度不足，用户无法关闭或撤回 | 将 AI 开关、授权状态和隐私偏好统一落到 `user_profiles.settings` 与设置 API |
| Redis 队列语义不清 | 队列不可用时可能阻塞单词提交、阅读答题或信件发送 | 使用数据库 Outbox，先提交业务事务和 `activity_events`，再由 Worker 发布 Redis Streams 并重试 |
| 中文搜索能力被误承诺 | PostgreSQL 默认 `english` FTS 对中文释义和中英混合文本效果差 | MVP 只承诺基础匹配；需要中文分词时再配置 `zhparser` / jieba 或独立搜索服务 |
| 草稿版本冲突频繁 | 多设备自动保存可能反复打断写信体验 | 自动保存默认 LWW；仅在手动保存或发送时检查版本冲突并提示选择 |
| 恢复快照跨设备复活 | 退出登录后旧设备状态可能在其他设备无提示恢复 | `user_resume_snapshots` 绑定 `client_id` / `device_id`，跨设备恢复需用户主动选择 |
| 强制注销同步执行超时 | 管理员强制注销涉及多表清理，同步 API 可能超时或半失败 | `force-deletion` 只创建任务，删除 Worker 异步执行，提供进度查询和幂等重试 |

---

## 22. 后续演进路线

### 22.1 阶段 0：架构确认与基线补齐

- 确认 `front/` 源码是否恢复；
- 确认账号策略；
- 确认内容来源；
- 输出 ER 图、OpenAPI、测试计划；
- 补充 Dockerfile、Compose。

### 22.2 阶段 1：MVP 闭环

- 首页今日任务；
- 单词 4 选 1、复习排程；
- 阅读文章、题目、解析；
- 受控笔友、草稿、安全检查；
- 今日成果；
- 核心 E2E。

### 22.3 阶段 2：工程化增强

- PostgreSQL 持久化；
- Redis 缓存与限流；
- 异步统计；
- 结构化日志；
- 监控告警；
- 基础管理后台。

### 22.4 阶段 3：性能与规模化

- API 多实例；
- Worker 独立扩容；
- PostgreSQL 分区与读副本；
- 搜索服务独立；
- AI/Safety 服务拆分。

### 22.5 阶段 4：智能化与运营扩展

- 个性化推荐；
- 学习报告；
- 内容质量预警；
- 人工审核工作台；
- 多端同步；
- 更细粒度学习档案导出。
- 数据主体访问请求（DSAR）异步导出任务、短期下载链接和二次验证。

---

## 23. 阶段结论

第四阶段的技术架构结论是：EnglishLover 首版应坚持“清晰学习闭环、模块化单体、技术选型先完成现有资产基线调查、前端可恢复状态与服务端事实确认结合、PostgreSQL 真实数据源、Redis 辅助加速但不阻断主流程、数据库 Outbox 承接异步事件、中文搜索能力不误承诺、数据字典口径明确、Admin 细粒度权限与强制审计、安全可解释写信、社交滥用治理闭环、AI 用户可控与可降级、性能目标绑定容量基线、Docker/Compose 可重复部署、E2E 验收保障”的建设路线。

该方案能够支撑当前文档定义的 MVP：单词、阅读、受控笔友写信和今日成果四条核心路径；同时为后续搜索、AI、统计、审核后台和高可用部署保留演进空间。后续所有开发与论文写作应继续遵守事实边界：未在真实代码、真实接口、真实数据库或真实部署中验证的内容，只能作为设计方案或待实现目标，不应表述为已经完成。

---

## 附录 A：架构评审问题整改记录

| 编号 | 严重性 | 问题摘要 | 整改位置 | 状态 |
|---|---|---|---|---|
| CRIT-01 | 严重 | 技术选型与现有资产冲突：文档曾推荐 Go + Gin/Chi，但现有 Express/Node 资产未完成基线调查，可能导致不必要重写 | 2.1、2.2、7.1、7.2、7.3、20、21、23 | 已整改：增加技术选型门禁，明确 Go 不是未调查前的强制路线，优先复用可运行资产 |
| CRIT-02 | 严重 | 安全设计缺失社交滥用防护闭环：举报表缺少处理状态机、处置动作、通知申诉和关系解除后果 | 8.4、9.2、12.5、20、21、23 | 已整改：补充举报状态机、处置动作、申诉、block/end/suspend 后果、最小 MVP 闭环和审计要求 |
| DES-01 | 建议尽快解决 | 前端可恢复性设计停留在概念，缺少本地持久化和恢复流程 | 5.4、20、21、23 | 已整改：补充 LocalRecoveryItem、本地持久化范围、提交队列、冲突处理和验收口径 |
| DES-02 | 建议尽快解决 | 性能目标未绑定硬件、并发、数据规模和成本 | 13.1、13.3、20、21、23 | 已整改：补充容量与成本基线，明确性能目标仅在对应环境下可评审 |
| DES-03 | 建议尽快解决 | `mastery`、`easiness`、`study_seconds` 等字段口径不清 | 8.7、20、21、23 | 已整改：补充核心数据字典、值域、计算规则、后端聚合和版本化要求 |
| DES-04 | 建议尽快解决 | `learning_sessions` 同时承载计划、恢复和会话状态，职责混乱 | 8.5、20、21、23 | 已整改：Today 任务卡按需聚合，持久化拆分为 `learning_sessions`、`user_resume_snapshots`、`activity_events` |
| DES-05 | 建议尽快解决 | Admin API 缺少资源级和操作级权限控制，审计要求不足 | 11.3、12.1、20、21、23 | 已整改：补充 Admin 权限码矩阵和强制审计规则 |
| DES-06 | 建议尽快解决 | AI 合规缺少用户设置开关、授权记录和 API 契约 | 8.1、9.2、12.4、20、21、23 | 已整改：补充 `user_profiles.settings` 中的 AI 开关、授权状态、隐私偏好、设置 API 和调用前置校验 |
| FINAL-01~04 | 终审一致性 | 隐私设置表、恢复状态表、AI 授权状态和通信历史正文策略与数据留存文档存在交叉不一致风险 | 8.1、8.4、8.5、12.4、数据留存策略 | 已整改：统一使用 `user_profiles.settings`、`user_resume_snapshots` 和“对方历史匿名保留”方案，并同步删除策略 |
| FINAL-05 | 终审一致性 | Admin 强制注销接口与 `suspend_user` 处置边界不够明确 | 9.2、11.3、12.5、数据留存策略 | 已整改：补充 `force-deletion` 接口说明、`user:force_delete` 权限、`force_completed` 状态和数据治理清理流程 |
| FINAL-06 | 终审一致性 | AI 数据留存口径可能被理解为保存文本摘要 | 12.4、数据留存策略 | 已整改：明确平台自身默认只保留不可识别调用统计，不保存正文、响应正文或文本摘要 |
| FINAL-07~11 | 落地风险 | Redis 队列语义、中文搜索、草稿版本冲突、多设备恢复快照、强制注销异步执行存在实施歧义 | 3.2、5.4、6.4、7.2、8.4、8.5、8.6、9.2、10.2、10.3、20、21、23、数据留存策略 | 已整改：明确 Outbox、基础中文匹配/分词扩展、LWW 与发送前冲突检查、`client_id`/`device_id` 隔离、强制注销任务化和进度查询 |
