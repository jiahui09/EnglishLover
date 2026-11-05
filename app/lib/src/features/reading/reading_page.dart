import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../../components/el_badge.dart';
import '../../components/el_button.dart';
import '../../components/el_card.dart';
import '../../components/el_learning_path.dart';
import '../../components/el_page_shell.dart';
import '../../components/el_section_header.dart';
import '../../design/el_theme.dart';
import '../../design/el_tokens.dart';
import '../../shared/mock_learning_data.dart';

class ReadingPage extends StatelessWidget {
  const ReadingPage({
    super.key,
    required this.onNavigate,
    required this.onExitFocus,
  });

  final ValueChanged<int> onNavigate;
  final VoidCallback onExitFocus;

  @override
  Widget build(BuildContext context) {
    return ELFocusShell(
      stageLabel: '阅读专注模式',
      title: '生成今日阅读',
      subtitle: '把近期词放入考研阅读语境，再用题目检测理解。',
      progressLabel: '阅读生成与答题 · 目标词 ${targetWords.length} 个',
      progressValue: .62,
      onExit: onExitFocus,
      child: _ReadingFocusContent(onOpenCoach: () => onNavigate(3)),
    );
  }
}

class _ReadingFocusContent extends StatelessWidget {
  const _ReadingFocusContent({required this.onOpenCoach});

  final VoidCallback onOpenCoach;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _GenerateBrief(),
        const SizedBox(height: ELTokens.space16),
        const _ArticleCard(),
        const SizedBox(height: ELTokens.space16),
        _QuestionPanel(onOpenCoach: onOpenCoach),
        const SizedBox(height: ELTokens.space16),
        const _FallbackNotice(),
      ],
    );
  }
}

class _GenerateBrief extends StatelessWidget {
  const _GenerateBrief();

  @override
  Widget build(BuildContext context) {
    final colors = ELTheme.colorsOf(context);
    return ELCard(
      level: ELSurfaceLevel.flat,
      backgroundColor: colors.wordSoft,
      borderColor: colors.wordSoftBorder,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ELSectionHeader(
            title: '本篇阅读使用这些近期词',
            subtitle: '词汇提示默认收起；正文中的目标词会用轻下划线标出。',
            trailing: Icon(LucideIcons.bookMarked, color: colors.word),
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
    final colors = ELTheme.colorsOf(context);
    final readingStyle = theme.textTheme.custom['reading'] ?? theme.textTheme.p;
    return ELCard(
      level: ELSurfaceLevel.level2,
      padding: ELTokens.focusPadding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const ELBadge('考研英语级别', tone: ELBadgeTone.coach),
              const Spacer(),
              Icon(LucideIcons.bookOpenText, color: colors.primary, size: 20),
            ],
          ),
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
              color: colors.wordSoft,
              borderRadius: ELTokens.radius16All,
              border: Border.all(color: colors.wordSoftBorder),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(LucideIcons.info, color: colors.word, size: 18),
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
    final colors = ELTheme.colorsOf(context);
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
            color: colors.word,
            fontWeight: FontWeight.w700,
            decoration: TextDecoration.underline,
            decorationColor: colors.word,
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
      level: ELSurfaceLevel.level2,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ELSectionHeader(title: '练习题', subtitle: '先完成选择，提交后再看答案和错因。'),
          const SizedBox(height: ELTokens.space16),
          for (var i = 0; i < questions.length; i++) ...[
            _QuestionCard(question: questions[i], index: i + 1),
            if (i < questions.length - 1)
              const SizedBox(height: ELTokens.space12),
          ],
          const SizedBox(height: ELTokens.space16),
          ELButton.primary(
            expands: true,
            label: '提交答案',
            onPressed: () {},
            trailing: const Icon(LucideIcons.check, size: 18),
          ),
          const SizedBox(height: ELTokens.space12),
          _AnalysisPreview(onOpenCoach: onOpenCoach),
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
    final colors = ELTheme.colorsOf(context);
    final letters = ['A', 'B', 'C', 'D'];
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: colors.surfaceElevated,
        borderRadius: ELTokens.radius20All,
        border: Border.all(color: colors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ELBadge('$index · ${question.type}', tone: ELBadgeTone.coach),
          const SizedBox(height: ELTokens.space12),
          Text(question.question, style: theme.textTheme.h4),
          const SizedBox(height: ELTokens.space12),
          for (var i = 0; i < question.options.length; i++) ...[
            _OptionRow(label: letters[i], text: question.options[i]),
            if (i < question.options.length - 1)
              const SizedBox(height: ELTokens.space8),
          ],
        ],
      ),
    );
  }
}

class _OptionRow extends StatelessWidget {
  const _OptionRow({required this.label, required this.text});

  final String label;
  final String text;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final colors = ELTheme.colorsOf(context);
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 24,
          height: 24,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: colors.surface,
            borderRadius: BorderRadius.circular(999),
            border: Border.all(color: colors.border),
          ),
          child: Text(
            label,
            style: theme.textTheme.small.copyWith(color: colors.text),
          ),
        ),
        const SizedBox(width: ELTokens.space8),
        Expanded(child: Text(text, style: theme.textTheme.muted)),
      ],
    );
  }
}

class _AnalysisPreview extends StatelessWidget {
  const _AnalysisPreview({required this.onOpenCoach});

  final VoidCallback onOpenCoach;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final colors = ELTheme.colorsOf(context);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: colors.surface,
        borderRadius: ELTokens.radius16All,
        border: Border.all(color: colors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('提交后解析', style: theme.textTheme.h4),
          const SizedBox(height: ELTokens.space8),
          Text(
            '解析会按“答案 / 原文依据 / 错因 / 薄弱词回流”展示，不在答题前暴露答案。',
            style: theme.textTheme.muted,
          ),
          const SizedBox(height: ELTokens.space12),
          ELButton.ghost(
            label: '看教练建议',
            onPressed: onOpenCoach,
            trailing: const Icon(LucideIcons.arrowRight, size: 16),
          ),
        ],
      ),
    );
  }
}

class _FallbackNotice extends StatelessWidget {
  const _FallbackNotice();

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final colors = ELTheme.colorsOf(context);
    return ELCard(
      shadows: const [],
      backgroundColor: colors.errorSoft,
      borderColor: colors.error,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(LucideIcons.triangleAlert, color: colors.error, size: 20),
          const SizedBox(width: ELTokens.space12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('AI 不可用时不中断学习', style: theme.textTheme.h4),
                const SizedBox(height: ELTokens.space8),
                Text(
                  '暂时无法生成新文章时，可使用预置考研阅读继续练习，并透明标注为“基于预置阅读”。',
                  style: theme.textTheme.muted,
                ),
                const SizedBox(height: ELTokens.space12),
                ELButton.outline(label: '使用预置阅读', onPressed: () {}),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
