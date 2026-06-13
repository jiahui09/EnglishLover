@FEAT-PENPAL-LETTER
Feature: 受控笔友写信闭环
  笔友模块必须在受控关系、安全审核和草稿保护下完成写信流程。

  @TEST-PENPAL-LETTER-01 @REQ-PAL-01 @REQ-PAL-02 @REQ-PAL-03 @REQ-PAL-04 @REQ-PAL-05 @REQ-PAL-08 @API-PENPAL-THREADS @API-PENPAL-LETTER-SEND @NFR-STAB-01
  Scenario: 完成一次笔友写信
    Given 用户存在管理员预配置的受控笔友关系
    When 用户撰写一封非空英文信并发送
    Then 系统保存信件并写入通信历史
    And 草稿保存或发送失败不会导致正文丢失

  @TEST-PENPAL-SAFETY-01 @REQ-PAL-06 @REQ-PAL-07 @API-PENPAL-LETTER-SEND @NFR-SEC-03
  Scenario: 联系方式被安全规则拦截且原文保留
    Given 用户正在编辑一封笔友信件
    When 信件正文命中手机号、Email 或社交账号关键词规则
    Then 系统不能直接发送该信件
    And 编辑器保留原文以便用户修改重试

  @TEST-PENPAL-RELATION-01 @REQ-PAL-09 @API-PENPAL-THREADS @NFR-SEC-02
  Scenario: 解除关系后不能继续发信
    Given 用户已经解除或屏蔽某个笔友关系
    When 对方尝试继续发送私人信件
    Then 系统拒绝发送并返回可理解错误
