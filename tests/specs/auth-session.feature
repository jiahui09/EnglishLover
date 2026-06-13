@FEAT-AUTH-SESSION
Feature: 认证与会话基础能力
  认证接口必须以 OpenAPI 契约和安全约束为准，避免业务代码绕过会话边界。

  @TEST-AUTH-LOGIN-01 @REQ-AUTH-01 @API-AUTH-LOGIN @NFR-SEC-04
  Scenario: 用户登录并建立会话
    Given 存在一个可用于契约测试的学习者账号
    When 用户提交正确的邮箱和密码
    Then 系统返回当前用户摘要
    And 响应通过 HttpOnly Cookie 设置访问令牌和刷新令牌

  @TEST-AUTH-SESSION-01 @REQ-AUTH-02 @REQ-AUTH-03 @REQ-AUTH-04 @API-AUTH-REFRESH @API-AUTH-LOGOUT @API-AUTH-ME @NFR-SEC-01 @NFR-SEC-04
  Scenario: 会话刷新、查询和退出
    Given 用户已经登录并持有有效会话
    When 用户刷新会话、查询当前用户并退出登录
    Then 刷新后的会话可以继续访问当前用户接口
    And 退出后旧会话不能继续访问受保护接口
