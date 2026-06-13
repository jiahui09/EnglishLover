@FEAT-NAV-CORE
Feature: 首页核心入口与状态提示
  首页必须让用户快速进入核心学习模块，并在异常状态下给出可操作反馈。

  @TEST-NAV-ENTRY-01 @REQ-NAV-01 @REQ-NAV-03 @REQ-NAV-04 @NFR-UX-01 @NFR-UX-04
  Scenario: 首页展示三大入口并保持基础可用性
    Given 用户打开 EnglishLover 首页
    When 页面完成加载
    Then 用户可以一次点击进入单词记忆、阅读练习和笔友写信入口
    And 核心入口在目标桌面和平板布局下没有遮挡或不可点击区域
    And 加载失败或无数据时页面展示可操作提示
