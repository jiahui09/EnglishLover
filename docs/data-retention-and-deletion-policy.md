# EnglishLover 数据留存与删除策略

> 文档用途：明确用户注销、数据删除、匿名化、备份留存、用户数据导出和合规处理边界。  
> 适用范围：用户账号、学习记录、单词状态、阅读记录、写信草稿、通信历史、举报与审计数据、AI 调用相关数据。  
> 事实边界：当前仓库未核验到真实数据库或接口实现，本文为目标数据治理策略，后续应随真实数据表、隐私政策和上线地区合规要求修订。数据模型以 [`phase-4-technical-architecture-design.md`](phase-4-technical-architecture-design.md) 第 8 节为准。

---

## 1. 结论概述

EnglishLover 的数据治理应遵循“**默认私有、最小留存、可删除、可匿名化、审计可追踪**”原则。用户注销后，个人资料、学习状态、草稿和本地可恢复状态应删除；确需保留用于安全、举报、审计或聚合统计的数据，必须完成去标识化或访问隔离。

推荐策略：

```text
用户发起注销
  -> 身份校验与风险提示
  -> 检查安全举报、申诉和法定保留条件
  -> 进入冷静期或立即处理（按产品决策）
  -> 停用账号与登录令牌
  -> 删除 user_profiles 及其中 settings
  -> 删除个人学习状态、草稿和 user_resume_snapshots
  -> 匿名化可保留的学习事件与统计
  -> 按规则处理历史信件、举报证据和审计日志
  -> 生成删除任务和审计记录
  -> 备份自然过期；如发生备份恢复，执行反删除脚本
```

---

## 2. 数据分类

| 数据类别 | 示例 | 敏感程度 | 默认留存原则 |
|---|---|---|---|
| 账号身份数据 | 邮箱、密码哈希、昵称、头像 | 高 | 注销后删除或不可逆匿名化 |
| 用户资料与偏好 | 当前阶段、每日目标、时区、语言、隐私偏好 | 中 | 存储在 `user_profiles`；注销后删除 |
| AI 功能开关与授权状态 | 是否开启 AI、语言检查授权、内容生成授权 | 中 | 存储在 `user_profiles.settings`；随用户资料删除 |
| AI 调用内容日志 | 用户主动提交给 AI 的临时文本片段、AI 临时响应、故障排查临时内容 | 高 | 默认不落库、不长期保存；若确需排障，仅限短期临时日志并脱敏；常规日志只保留不可识别调用统计 |
| 单词状态 | 掌握度、复习次数、下次复习时间 | 中 | 注销后删除；仅统计用途可不可逆匿名化 |
| 学习事件 | 答题事件、阅读完成事件、写信完成事件 | 中 | 注销后去标识化用于聚合统计；若用户要求彻底删除则按合规要求处理 |
| 可恢复状态 | 当前题面、阅读位置、断点恢复载荷、设备恢复标识 | 中 | 存储在 `user_resume_snapshots`；注销后必须删除全部设备快照，退出登录只清当前设备 |
| 阅读记录 | 阅读位置、答题结果、生词 | 中 | 注销后删除或匿名化 |
| 写信草稿 | 未发送正文 | 高 | 注销后立即删除 |
| 通信历史 | 已发送信件正文、收发关系 | 高 | 默认保留非注销方已收到/已发送的历史正文，但匿名化注销方身份；举报证据按安全期限隔离保留 |
| 举报与安全数据 | 举报、证据快照、处置动作、申诉 | 高 | 按安全处理期限保留，限制访问 |
| 审计日志 | 管理员操作、权限变更、强制注销 | 高 | 按审计期限保留，不允许普通删除 |
| 备份数据 | 数据库备份、对象存储快照 | 高 | 按备份周期自然过期；备份恢复后必须执行反删除流程 |

---

## 3. 用户注销处理流程

### 3.1 注销前校验

注销前至少完成：

1. 验证当前用户身份，建议重新输入密码或进行二次验证；
2. 提示注销影响，包括学习记录、草稿、通信关系、AI 设置、历史信件展示方式；
3. 检查当前用户发起的举报、申诉或安全处置是否仍未完成；
4. 检查当前用户是否存在处于 `pending` 或 `under_review` 状态的被举报记录，即该用户是 `reports.target_user_id`。若存在，注销请求应自动转为 `rejected`，原因码为 `safety_hold`，或进入安全挂起队列，并通知安全审核员；
5. 检查是否存在法定保留、支付争议、学校管理要求等外部约束；
6. 吊销当前会话和 Refresh Token；
7. 创建 `account_deletion_requests` 记录。

### 3.2 推荐数据表

```text
account_deletion_requests
- id UUID PK
- user_id UUID
- requested_by_user_id UUID
- requested_by_type VARCHAR -- self / admin
- status VARCHAR -- requested / scheduled / processing / completed / rejected / cancelled / force_completed
- reason_code VARCHAR NULL -- user_request / safety_hold / legal_hold / admin_force / duplicate_request
- reason_detail TEXT NULL
- requested_at TIMESTAMP
- scheduled_delete_at TIMESTAMP NULL
- processing_started_at TIMESTAMP NULL
- completed_at TIMESTAMP NULL
- operator_user_id UUID NULL
- last_error TEXT NULL
- created_at TIMESTAMP
- updated_at TIMESTAMP

user_deletion_logs
- id UUID PK
- user_id_hash VARCHAR
- deletion_request_id UUID
- action VARCHAR
- resource_type VARCHAR
- resource_count INT
- result VARCHAR
- created_at TIMESTAMP
```

说明：`user_id_hash` 使用不可逆哈希，不保留明文用户标识；`operator_user_id` 仅用于管理员强制注销或审核介入场景，并应同步写入 `admin_audit_logs`。

### 3.3 注销状态机

```text
用户自助注销：
requested 用户提交注销
  -> rejected(reason_code=safety_hold) 存在未处置的被举报记录，需安全审核员介入
  -> rejected(reason_code=legal_hold) 存在法定或管理保留原因
  -> cancelled 用户在冷静期内取消
  -> processing 开始处理
      -> completed 删除/匿名化完成

管理员强制注销：
requested(requested_by_type=admin, reason_code=admin_force)
  -> scheduled 按 scheduled_delete_at 等待调度执行
  -> processing 由删除 Worker 执行清理任务
      -> force_completed 强制注销完成
      -> rejected(reason_code=legal_hold) 存在更高优先级外部保留要求
```

是否设置冷静期取决于产品和合规要求。MVP 可不设置复杂冷静期，但用户自助注销必须防止误操作，例如二次确认和重新输入密码。管理员强制注销无冷静期，但必须填写原因、记录审计并限制权限。强制注销请求不应在 API 请求内同步删除全部数据，而应创建清理任务，由 Worker 异步执行并支持进度查询、失败重试和审计追踪。

---

## 4. 删除与匿名化规则

| 数据对象 | 注销后处理 | 说明 |
|---|---|---|
| `users` | 删除可识别字段或将账号置为不可登录状态后清理 | 若物理删除会破坏审计外键，可保留最小化壳记录，但邮箱、昵称、头像等可识别信息必须删除或不可逆匿名化 |
| `user_profiles` | 删除 | `settings` 中包含 AI 开关、授权状态和隐私偏好，随资料一并删除 |
| `user_word_states` | 删除 | 用户个人学习状态不再保留 |
| `review_events` | 删除或匿名化 | 若用于聚合统计，使用不可逆匿名用户键，不保留原始 `user_id` |
| Today 任务卡 | 无独立持久表时无需清理 | 今日任务由 Today 模块聚合生成；若后续新增持久化计划表，必须纳入本矩阵 |
| `learning_sessions` | 删除或匿名化 | 会话目标范围与用户强相关，默认删除 |
| `user_resume_snapshots` | 删除 | 注销时清理全部 `client_id` / `device_id` 快照；退出登录或清除此设备时只清当前设备快照 |
| `activity_events` | 删除或匿名化 | 可保留不可逆匿名后的统计事实 |
| `learning_daily_stats` | 删除或匿名化 | 个人视图删除；聚合统计只保留匿名结果 |
| `reading_records` | 删除或匿名化 | 阅读行为默认私有 |
| `reading_answer_events` | 删除或匿名化 | 可保留题目质量聚合，但不能定位用户 |
| `letter_drafts` | 立即删除 | 草稿未发送，用户注销后不应保留 |
| `letters` | 保留非注销方已获得的正文，匿名化注销方身份 | 默认将注销方在保留信件中的 `sender_id` 或 `receiver_id` 替换为系统保留 ID，前端显示“已注销用户” |
| `penpal_relations` | 标记 `ended` 或匿名化参与方 | 防止继续通信，保留必要的关系结束事实 |
| `reports` | 按安全期限保留 | 举报证据涉及安全处置，不应因举报人或被举报人注销立即删除 |
| `report_actions` / `report_appeals` | 按安全期限保留 | 保留处置链路和申诉结论，限制访问 |
| `admin_audit_logs` | 保留 | 审计日志需保留，但应避免含明文私人内容 |
| AI 调用内容日志 | 删除可定位文本、正文、响应正文和文本摘要 | 只保留不可识别的调用统计；用户关闭 AI 后不得继续产生新内容日志 |

---

## 5. 匿名化技术实现规范

### 5.1 聚合统计类匿名化

适用对象：`review_events`、`activity_events`、`reading_answer_events`、匿名化后的 `learning_daily_stats` 等用于统计分析的数据。

推荐规则：

```text
anonymous_user_key = SHA-256(user_id + static_pepper)
```

实施要求：

1. `static_pepper` 必须存储在 Secret 管理系统或环境密钥中，不进入代码仓库和数据库备份明文；
2. 同一用户在不同统计表中使用同一 `static_pepper` 生成一致哈希，以支持跨模块关联分析；
3. 若原表 `user_id` 是 UUID 外键，不应把哈希硬塞回 UUID 字段。推荐将可保留数据迁移到带 `anonymous_user_key` 的统计表，或在匿名化版本中将用户标识字段调整为字符串类型；
4. 匿名化后必须删除或覆盖原始 `user_id`、IP、User-Agent、邮箱、昵称等可重新识别字段；
5. 严禁使用 `NULL` 简单替代 `user_id` 来表示匿名化，避免破坏引用完整性、审计口径和统计能力。

### 5.2 保留内容类匿名化

适用对象：需要保留正文但隐藏用户身份的数据，例如对方已收到的 `letters`。

推荐保留系统用户：

```text
DELETED_USER_ID = 00000000-0000-0000-0000-000000000001
DELETED_USER_DISPLAY_NAME = 已注销用户
```

实施要求：

1. 系统初始化时创建固定保留用户或系统身份记录，禁止登录、禁止被搜索、禁止建立新关系；
2. 当发件人注销且信件需在收件人视图保留时，将 `letters.sender_id` 替换为 `DELETED_USER_ID`，`content` 保留，前端显示“已注销用户”；
3. 当收件人注销但发件人视图仍需保留已发送信件时，可将 `letters.receiver_id` 替换为 `DELETED_USER_ID`；
4. 涉及举报的信件应以 `reports.evidence_snapshot` 保存必要证据快照，到期后再清理或匿名化；
5. 不得用 `NULL` 作为匿名用户外键，避免历史信件、关系视图和审计链路出现不可解释断点。

---

## 6. 通信历史特殊处理

笔友写信涉及双方用户，删除策略不能只考虑单方。基于平台定位，推荐技术方案为：**仅匿名化注销方身份，不删除对方已收到或已发送的信件正文**。若未获产品正式否决，按此技术方案实现，并在隐私说明中明确告知。

推荐理由：

1. 笔友通信是双向互动，一方注销不应单方面销毁另一方已获得的数字资产、学习素材和历史回忆；
2. 该策略类似电子邮件：发件人注销账号后，已发送到对方收件箱的邮件通常仍保留在对方视图中；
3. 技术上通过固定匿名系统用户替换身份，比删除正文更能兼顾引用完整性、用户体验和纠纷处理。

| 场景 | 推荐处理 |
|---|---|
| 用户删除自己未发送草稿 | 立即删除，不影响对方 |
| 发件人注销，历史信件未被举报 | `letters.sender_id` 替换为 `DELETED_USER_ID`，正文在收件人视图保留，前端显示“已注销用户” |
| 收件人注销，发件人查看已发送历史 | `letters.receiver_id` 可替换为 `DELETED_USER_ID`，正文在发件人视图保留 |
| 双方均注销且信件未涉举报 | 可在留存期结束后删除正文，仅保留匿名聚合统计 |
| 信件涉及举报或处置 | 保留必要证据快照到安全期限结束，仅授权审核人员访问 |
| 用户请求删除已发送信件 | 默认删除本人视图；不影响对方已获得视图，除非隐私政策或法律要求另行处理 |
| 关系解除或屏蔽 | 不等于删除历史数据；只限制后续通信 |

---

## 7. 留存期限建议

| 数据类型 | 建议期限 | 说明 |
|---|---|---|
| 未发送草稿 | 用户主动删除或注销后立即删除 | 本地草稿也应提示清理 |
| 可恢复状态 | 会话完成、过期或注销后立即删除 | 包括 `user_resume_snapshots` 和本地 `LocalRecoveryItem` |
| 学习状态与记录 | 账号存续期间保留；注销后删除或匿名化 | 用于学习连续性 |
| AI 调用统计 | 账号存续期间按最小必要保留；注销后删除可定位记录或匿名化 | 只保存功能名、调用状态、耗时、错误码等不可识别统计，不保存正文、响应正文或文本摘要 |
| AI 临时调试内容 | 默认禁用；如确需排障，最长 7 天并需权限控制 | 仅限明确故障排查，必须脱敏，不能进入常规日志或训练数据 |
| 举报证据 | 6-24 个月，按风险和合规要求调整 | 用于处理纠纷和重复违规 |
| 管理审计日志 | 12-36 个月 | 用于安全追溯 |
| 数据库备份 | 7-30 天滚动保留 | 备份中已删除数据随备份过期自然清除 |
| 匿名聚合统计 | 可长期保留 | 必须不可逆去标识化 |

### 7.1 备份恢复后的反删除流程

数据库从备份恢复后，可能把已注销用户的数据恢复出来，因此必须执行反删除流程：

1. 读取备份时间点之后生成的所有 `user_deletion_logs` 和已完成的 `account_deletion_requests`；
2. 对 `completed` 和 `force_completed` 状态的注销请求重新执行删除/匿名化脚本；
3. 校验 `users`、`user_profiles`、`user_word_states`、`user_resume_snapshots`、`letter_drafts`、`letters` 等对象不存在不应恢复的可定位数据；
4. 将反删除脚本结果写入恢复审计记录和 `admin_audit_logs`；
5. 完成校验后才允许恢复对外服务。

该步骤应纳入容灾恢复预案，作为数据库恢复操作的强制收尾步骤。

以上期限是设计建议，不是法律意见。正式上线前应结合服务地区、用户年龄范围和隐私政策确认。

---

## 8. API 契约建议

### 8.1 用户自助数据与注销接口

```text
GET    /api/v1/users/me/data-summary
GET    /api/v1/users/me/data-export
POST   /api/v1/users/me/deletion-request
GET    /api/v1/users/me/deletion-request
DELETE /api/v1/users/me/deletion-request   # 冷静期内取消，可选
```

`GET /api/v1/users/me/data-summary` 应说明：

- 账号资料；
- 学习记录数量；
- 草稿数量；
- 已发送和已接收信件数量；
- 举报、申诉或安全处置处理中状态；
- 注销后各类数据如何处理。

### 8.2 数据导出接口（DSAR）

`GET /api/v1/users/me/data-export` 用于响应数据主体访问请求和数据可携带权需求。

安全要求：

1. 必须登录，且建议进行身份二次验证；
2. 导出任务应限频，例如 24 小时内最多 1 次；
3. 大数据量场景可异步处理：接口先返回 `202 Accepted` 和 `exportTaskId`，任务完成后通知用户下载；
4. 下载链接必须短期有效，并绑定用户身份；
5. 导出包不得包含其他用户的隐私数据。历史信件中对方内容是否导出，应与隐私政策一致，默认只导出当前用户视图中可见内容。

推荐 JSON 结构：

```json
{
  "profile": {},
  "settings": {},
  "vocabulary": {
    "wordStates": [],
    "reviewEvents": []
  },
  "reading": {
    "records": [],
    "answerEvents": []
  },
  "penpal": {
    "relations": [],
    "letters": []
  },
  "reports": {
    "submittedReports": [],
    "appeals": []
  },
  "exportedAt": "2026-06-13T00:00:00Z"
}
```

### 8.3 管理员强制注销接口

```text
POST /api/v1/admin/users/{id}/force-deletion
GET  /api/v1/admin/account-deletion-requests/{id}
```

请求体：

```json
{
  "reason": "policy_violation",
  "reasonDetail": "严重骚扰或违规账号处置",
  "scheduledDeleteAt": null
}
```

规则：

1. 无冷静期，但 `POST` 仅创建强制注销任务，建议返回 `202 Accepted`、`deletionRequestId`、当前状态和查询地址；
2. `reason` 必填，且必须来自受控枚举；
3. 调用者必须具备用户治理或安全处置权限；
4. 操作必须写入 `admin_audit_logs`，包括操作者、目标用户、原因、影响资源和请求 ID；
5. 若传入 `scheduledDeleteAt`，请求进入 `scheduled` 状态，由调度器或 Worker 到期执行；不得让同步 API 长时间阻塞等待；
6. 删除 Worker 负责执行数据删除、匿名化和日志写入；任务应幂等，可在失败后从最近完成的资源继续；
7. `GET /api/v1/admin/account-deletion-requests/{id}` 返回状态、计划执行时间、开始/完成时间、已处理资源计数、失败原因和是否可重试；
8. 完成后 `account_deletion_requests.status` 记为 `force_completed`，以区分用户自助注销。

---

## 9. 本地数据清理

前端必须支持清理本地可恢复数据：

| 数据 | 清理时机 |
|---|---|
| `LocalRecoveryItem` | 会话完成、过期、注销、用户手动清理 |
| 写信草稿本地副本 | 发送成功、用户删除草稿、注销、切换账号确认清理 |
| pending 提交队列 | 服务端确认、用户放弃、注销 |
| AI 检查临时结果 | 内容变更、会话结束、超时、关闭 AI、注销 |

设备与账号边界：

1. `LocalRecoveryItem`、本地草稿和服务端 `user_resume_snapshots` 必须绑定 `client_id` 或 `device_id`；
2. 用户退出登录或点击“清除此设备草稿”时，只清理当前设备的本地数据和当前设备对应的服务端恢复快照；
3. 同一账号在其他设备上的恢复快照不应被当前设备退出登录误删，除非用户选择“清除所有设备数据”或发起账号注销；
4. 跨设备恢复应由用户主动选择，并展示来源设备和最后保存时间，避免旧设备状态无提示复活；
5. 切换账号时必须防止 A 用户的草稿或学习状态展示给 B 用户。

---

## 10. 风险与待确认事项

| 编号 | 待确认事项 | 影响 |
|---|---|---|
| D-01 | 用户自助注销是否设置冷静期 | API 和交互设计 |
| D-02 | 隐私政策是否已明确告知“对方已收到/已发送的历史正文默认保留，并匿名化注销方身份” | 若未告知，不得上线该策略；若产品正式否决，需调整 `letters` 处理 |
| D-03 | 举报证据保留期限 | 安全与合规 |
| D-04 | DSAR 导出中历史信件的对方内容边界 | 数据导出范围和隐私政策 |
| D-05 | 未成年人是否在服务范围内 | 删除、监护人同意和通信限制 |
| D-06 | 第三方 AI 服务商是否保留请求内容或用于训练 | 用户授权、供应商合同与隐私告知；平台自身默认不保存正文、响应正文或文本摘要 |
| D-07 | `static_pepper` 的密钥托管和轮换方式 | 匿名化一致性和安全性 |

---

## 11. 策略结论

EnglishLover 应在开发前明确数据留存与删除策略，尤其是写信草稿、通信历史、举报证据、AI 调用数据、设备级恢复快照和备份恢复后的反删除流程。用户注销不能只删除账号表，而应覆盖 `user_profiles.settings`、学习状态、阅读记录、草稿、本地恢复数据、`user_resume_snapshots`、AI 授权状态和统计匿名化。管理员强制注销不应在同步 API 内完成全部清理，应创建任务并由删除 Worker 异步执行。涉及举报、审计和安全处置的数据可以按最小必要原则保留，但必须限制访问并记录审计。默认技术建议是保留非注销方已获得的历史信件正文，同时把注销方身份替换为“已注销用户”；若产品未正式否决，应按该方案推进详细设计。
