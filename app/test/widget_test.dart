import 'package:english_lover/src/app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Future<void> pumpMobileApp(WidgetTester tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(const EnglishLoverApp());
    await tester.pumpAndSettle();
  }

  testWidgets('EnglishLover home renders core learning surfaces', (
    WidgetTester tester,
  ) async {
    await pumpMobileApp(tester);

    expect(find.text('今天的英语学习计划'), findsOneWidget);
    expect(find.text('开始单词训练'), findsWidgets);
    expect(find.text('今日'), findsOneWidget);
    expect(find.text('单词'), findsWidgets);
    expect(find.text('阅读'), findsWidgets);
    expect(find.text('教练'), findsOneWidget);
    expect(find.byType(NavigationBar), findsOneWidget);
  });

  testWidgets('word training uses immersive flip mode and hides navigation', (
    WidgetTester tester,
  ) async {
    await pumpMobileApp(tester);

    await tester.tap(find.text('开始单词训练').first);
    await tester.pumpAndSettle();

    expect(find.byType(NavigationBar), findsNothing);
    expect(find.byTooltip('退出单词训练'), findsOneWidget);
    expect(find.byTooltip('单词训练设置'), findsOneWidget);
    expect(find.text('significant'), findsOneWidget);
    expect(find.text('点击屏幕任意区域显示释义'), findsOneWidget);
    expect(find.text('认识'), findsNothing);
    expect(find.text('模糊'), findsNothing);
    expect(find.text('不认识'), findsNothing);

    await tester.tap(find.text('significant'));
    await tester.pumpAndSettle();

    expect(find.text('adj. 重要的；显著的'), findsOneWidget);
    expect(find.text('认识'), findsOneWidget);
    expect(find.text('模糊'), findsOneWidget);
    expect(find.text('不认识'), findsOneWidget);
  });

  testWidgets('reading training enters focus mode and hides navigation', (
    WidgetTester tester,
  ) async {
    await pumpMobileApp(tester);

    await tester.tap(find.text('开始单词训练').first);
    await tester.pumpAndSettle();
    await tester.tap(find.byTooltip('退出单词训练'));
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.text('生成今日阅读').first);
    await tester.pumpAndSettle();
    await tester.tap(find.text('生成今日阅读').first);
    await tester.pumpAndSettle();

    expect(find.text('阅读专注模式'), findsOneWidget);
    expect(find.text('返回今日学习'), findsOneWidget);
    expect(find.byType(NavigationBar), findsNothing);
  });
}
