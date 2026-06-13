@FEAT-WORD-LIST @FEAT-WORD-REVIEW
Feature: 单词主动回忆与复习排程
  单词模块必须形成学习、主动回忆、即时反馈、保存结果和生成复习计划的闭环。

  @TEST-WORD-LIST-01 @REQ-VOC-01 @API-WORD-LIST @NFR-STAB-02
  Scenario: 用户按学习状态查看单词列表
    Given 用户已登录
    When 用户按学习状态筛选单词列表
    Then 系统返回符合状态条件的单词集合
    And 无结果时返回可解释的空状态而不是静默失败

  @TEST-WORD-REVIEW-01 @REQ-VOC-03 @REQ-VOC-04 @REQ-VOC-05 @API-REVIEW-SUBMIT @API-REVIEW-EVENTS @NFR-STAB-03
  Scenario: 完成一次四选一主动回忆练习
    Given 用户正在进行四选一释义选择题
    When 用户提交一次作答结果
    Then 系统展示正确或错误反馈和正确答案
    And 系统保存复习事件并生成下一次复习时间

  @TEST-WORD-RESUME-01 @REQ-VOC-08 @API-REVIEW-SUBMIT @NFR-STAB-04
  Scenario: 单词练习中断后恢复
    Given 用户已经提交部分单词题目
    When 页面刷新或网络中断后用户重新进入练习
    Then 已提交结果不丢失且不重复计数
    And 用户可以继续未完成任务或重新开始未完成会话

  @TEST-WORD-QUEUE-01 @REQ-VOC-06 @REQ-VOC-07 @REQ-VOC-09 @API-WORD-LIST @API-REVIEW-EVENTS @NFR-STAB-01
  Scenario: 复习队列按优先级和每日上限生成
    Given 存在到期词、上一会话错误词和低掌握词
    When 系统生成今日复习队列
    Then 到期词优先进入队列
    And 超出每日上限的候选顺延且不丢弃
