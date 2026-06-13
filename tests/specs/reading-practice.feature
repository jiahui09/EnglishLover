@FEAT-READING-PRACTICE @FEAT-READING-WORD-QUEUE
Feature: 阅读练习闭环
  阅读模块必须支持选材、阅读、答题、解析、记录保存和生词加入单词队列。

  @TEST-READING-PRACTICE-01 @REQ-RD-01 @REQ-RD-02 @REQ-RD-03 @REQ-RD-05 @REQ-RD-06 @REQ-RD-07 @API-READING-LIST @API-READING-DETAIL @NFR-STAB-03
  Scenario: 完成一篇阅读并答题
    Given 用户进入阅读模块且没有历史阅读记录
    When 用户选择推荐文章、阅读正文并提交基础题目
    Then 系统保存阅读记录
    And 每道题展示正确答案、解析和原文依据

  @TEST-READING-WORD-QUEUE-01 @REQ-RD-04 @REQ-VOC-01 @API-READING-WORD-QUEUE @NFR-STAB-01
  Scenario: 阅读中加入重点词到单词学习队列
    Given 用户正在阅读一篇包含重点词的文章
    When 用户点击重点词的加入学习入口
    Then 系统创建或确认一条待学习队列记录
    And 该操作不直接把单词计为已掌握
