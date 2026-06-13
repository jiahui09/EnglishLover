@FEAT-ANALYTICS-DAILY
Feature: 今日成果与学习记录摘要
  学习记录必须来自真实学习行为，不能用固定假数据替代。

  @TEST-ANALYTICS-SUMMARY-01 @REQ-REC-01 @REQ-REC-02 @REQ-REC-03 @API-ANALYTICS-DAILY-SUMMARY @NFR-STAB-01
  Scenario: 学习记录随真实行为更新
    Given 用户完成单词、阅读或笔友写作中的至少一种真实学习行为
    When 用户查看今日学习摘要
    Then 今日完成度、连续天数和模块完成数量来自行为记录或完成事件
    And 只打开页面不会计入完成数量或连续学习
