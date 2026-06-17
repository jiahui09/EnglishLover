import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../../components/el_badge.dart';
import '../../components/el_button.dart';
import '../../components/el_card.dart';
import '../../components/el_empty_state.dart';
import '../../components/el_learning_path.dart';
import '../../components/el_section_header.dart';
import '../../design/el_tokens.dart';
import '../../shared/mock_learning_data.dart';

class ReadingPage extends StatelessWidget {
  const ReadingPage({super.key, required this.onNavigate});

  final ValueChanged<int> onNavigate;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('阅读训练', style: theme.textTheme.h1),
          const SizedBox(height: ELTokens.space8),
          Text('把近期单词放入考研阅读语境，再用题目检测理解。', style: theme.textTheme.lead),
          const SizedBox(height: ELTokens.space20),
          _GenerateCard(onGenerate: () {}),
          const SizedBox(height: ELTokens.space16),
          LayoutBuilder(
            builder: (context, constraints) {
              final twoColumns = constraints.maxWidth >= 860;
              if (!twoColumns) {
                return Column(
                  children: [
                    const _ArticleCard(),
                    const SizedBox(height: ELTokens.space16),
                    _QuestionPanel(onOpenCoach: () => onNavigate(3)),
                  ],
                );
              }
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Expanded(flex: 6, child: _ArticleCard()),
                  const SizedBox(width: ELTokens.space16),
                  Expanded(
                    flex: 4,
                    child: _QuestionPanel(onOpenCoach: () => onNavigate(3)),
                  ),
                ],
              );
            },
          ),
          const SizedBox(height: ELTokens.space16),
          ELEmptyState(
            title: 'AI 不可用时不中断学习',
            description: '暂时无法生成新文章时，可使用预置考研阅读继续练习，并透明标注为“基于预置阅读”。',
            actionLabel: '使用预置阅读',
            onAction: () {},
          ),
        ],
      ),
    );
  }
}

class _GenerateCard extends StatelessWidget {
  const _GenerateCard({required this.onGenerate});

  final VoidCallback onGenerate;

  @override
  Widget build(BuildContext context) {
    return ELCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ELSectionHeader(
            title: '生成今日阅读',
            subtitle: '难度：考研英语 · 题型：主旨 / 细节 / 推断 / 词义',
            trailing: Icon(LucideIcons.sparkles, color: ELTokens.coachGreen),
          ),
          const SizedBox(height: ELTokens.space16),
          Wrap(
            spacing: ELTokens.space8,
            runSpacing: ELTokens.space8,
            children: [
              for (final word in targetWords)
                ELBadge(word, tone: ELBadgeTone.word),
            ],
          ),
          const SizedBox(height: ELTokens.space16),
          const ELLearningPath(steps: ['单词', '阅读', '解析', '建议'], activeIndex: 1),
          const SizedBox(height: ELTokens.space16),
          ELButton.primary(label: '生成今日阅读', onPressed: onGenerate),
        ],
      ),
    );
  }
}

class _ArticleCard extends StatelessWidget {
  const _ArticleCard();

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final readingStyle = theme.textTheme.custom['reading'] ?? theme.textTheme.p;
    return ELCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ELBadge('考研英语级别', tone: ELBadgeTone.coach),
          const SizedBox(height: ELTokens.space12),
          Text('Why Vocabulary Needs Context', style: theme.textTheme.h2),
          const SizedBox(height: ELTokens.space16),
          for (final paragraph in readingParagraphs) ...[
            _HighlightedParagraph(text: paragraph, style: readingStyle),
            const SizedBox(height: ELTokens.space16),
          ],
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: ELTokens.paper,
              borderRadius: ELTokens.radius16All,
              border: Border.all(color: ELTokens.line),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  LucideIcons.info,
                  color: ELTokens.coachGreen,
                  size: 18,
                ),
                const SizedBox(width: ELTokens.space8),
                Expanded(
                  child: Text(
                    '目标词轻标记，不打断阅读；词汇提示默认折叠，解析时再回看原文依据。',
                    style: theme.textTheme.muted,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: ELTokens.space16),
          ELButton.primary(label: '开始答题', onPressed: () {}),
        ],
      ),
    );
  }
}

class _HighlightedParagraph extends StatelessWidget {
  const _HighlightedParagraph({required this.text, required this.style});

  final String text;
  final TextStyle style;

  @override
  Widget build(BuildContext context) {
    final spans = <TextSpan>[];
    var remaining = text;
    while (remaining.isNotEmpty) {
      final match = RegExp(
        targetWords.join('|'),
        caseSensitive: false,
      ).firstMatch(remaining);
      if (match == null) {
        spans.add(TextSpan(text: remaining));
        break;
      }
      if (match.start > 0) {
        spans.add(TextSpan(text: remaining.substring(0, match.start)));
      }
      spans.add(
        TextSpan(
          text: remaining.substring(match.start, match.end),
          style: style.copyWith(
            color: ELTokens.wordAmber,
            fontWeight: FontWeight.w700,
            decoration: TextDecoration.underline,
            decorationColor: ELTokens.wordAmber,
          ),
        ),
      );
      remaining = remaining.substring(match.end);
    }

    return RichText(
      text: TextSpan(style: style, children: spans),
    );
  }
}

class _QuestionPanel extends StatelessWidget {
  const _QuestionPanel({required this.onOpenCoach});

  final VoidCallback onOpenCoach;

  @override
  Widget build(BuildContext context) {
    return ELCard(
      shadows: const [],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ELSectionHeader(title: '练习题', subtitle: '提交后给出正确率、错因和原文依据。'),
          const SizedBox(height: ELTokens.space16),
          for (var i = 0; i < questions.length; i++) ...[
            _QuestionCard(question: questions[i], index: i + 1),
            if (i < questions.length - 1)
              const SizedBox(height: ELTokens.space12),
          ],
          const SizedBox(height: ELTokens.space16),
          ELButton.primary(label: '提交答案', onPressed: () {}),
          const SizedBox(height: ELTokens.space8),
          ELButton.ghost(label: '看教练建议', onPressed: onOpenCoach),
        ],
      ),
    );
  }
}

class _QuestionCard extends StatelessWidget {
  const _QuestionCard({required this.question, required this.index});

  final QuestionItem question;
  final int index;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final letters = ['A', 'B', 'C', 'D'];
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: ELTokens.paper,
        borderRadius: ELTokens.radius20All,
        border: Border.all(color: ELTokens.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ELBadge('$index · ${question.type}', tone: ELBadgeTone.coach),
          const SizedBox(height: ELTokens.space12),
          Text(question.question, style: theme.textTheme.h4),
          const SizedBox(height: ELTokens.space12),
          for (var i = 0; i < question.options.length; i++) ...[
            Text(
              '${letters[i]}. ${question.options[i]}',
              style: theme.textTheme.muted,
            ),
            const SizedBox(height: ELTokens.space8),
          ],
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: ELTokens.card,
              borderRadius: ELTokens.radius16All,
              border: Border.all(color: ELTokens.line),
            ),
            child: Text(
              '解析示例：${question.reason}',
              style: theme.textTheme.small,
            ),
          ),
        ],
      ),
    );
  }
}
