import 'package:english_lover/src/app.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('EnglishLover home renders core learning surfaces', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const EnglishLoverApp());
    await tester.pumpAndSettle();

    expect(find.text('今天的英语学习计划'), findsOneWidget);
    expect(find.text('开始单词训练'), findsWidgets);
    expect(find.text('今日'), findsWidgets);
    expect(find.text('单词'), findsWidgets);
    expect(find.text('阅读'), findsWidgets);
    expect(find.text('教练'), findsWidgets);
  });
}
