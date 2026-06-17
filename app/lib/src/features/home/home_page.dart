import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../../components/el_badge.dart';
import '../../components/el_button.dart';
import '../../components/el_card.dart';
import '../../components/el_learning_path.dart';
import '../../components/el_section_header.dart';
import '../../components/el_stat_chip.dart';
import '../../design/el_tokens.dart';
import '../../shared/mock_learning_data.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key, required this.onNavigate});

  final ValueChanged<int> onNavigate;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const _HomeHeader(),
          const SizedBox(height: ELTokens.space20),
          _TodayPlanCard(onStartWords: () => onNavigate(1)),
          const SizedBox(height: ELTokens.space16),
          LayoutBuilder(
            builder: (context, constraints) {
              final twoColumns = constraints.maxWidth >= 760;
              final cards = [
                _TaskCard(
                  icon: LucideIcons.bookMarked,
                  badge: '知识输入',
                  title: '单词输入',
                  description: '新词 8 个 · 复习 12 个 · 薄弱词 4 个',
                  actionLabel: '开始单词训练',
                  onPressed: () => onNavigate(1),
                ),
                _TaskCard(
                  icon: LucideIcons.bookOpenText,
                  badge: '知识输出',
                  title: '阅读输出',
                  description: '使用近期词生成 1 篇考研英语阅读理解。',
                  actionLabel: '生成今日阅读',
                  onPressed: () => onNavigate(2),
                  tone: ELBadgeTone.word,
                ),
              ];

              if (!twoColumns) {
                return Column(
                  children: [
                    cards[0],
                    const SizedBox(height: ELTokens.space12),
                    cards[1],
                  ],
                );
              }

              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: cards[0]),
                  const SizedBox(width: ELTokens.space12),
                  Expanded(child: cards[1]),
                ],
              );
            },
          ),
          const SizedBox(height: ELTokens.space16),
          _CoachNote(onOpenCoach: () => onNavigate(3)),
          const SizedBox(height: ELTokens.space16),
          const _ProgressSummary(),
        ],
      ),
    );
  }
}

class _HomeHeader extends StatelessWidget {
  const _HomeHeader();

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const ELBadge('EnglishLover AI Coach', tone: ELBadgeTone.coach),
        const SizedBox(height: ELTokens.space12),
        Text('今天的英语学习计划', style: theme.textTheme.h1),
        const SizedBox(height: ELTokens.space8),
        Text('先把近期单词过一遍，再用它们完成一篇考研英语阅读。', style: theme.textTheme.lead),
      ],
    );
  }
}

class _TodayPlanCard extends StatelessWidget {
  const _TodayPlanCard({required this.onStartWords});

  final VoidCallback onStartWords;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return ELCard(
      backgroundColor: ELTokens.coachGreen,
      borderColor: ELTokens.coachGreen,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '今天先把近期词放进阅读里',
            style: theme.textTheme.h2.copyWith(color: ELTokens.card),
          ),
          const SizedBox(height: ELTokens.space8),
          Text(
            '15–25 分钟 · 单词 20 个 · 阅读 1 篇',
            style: theme.textTheme.p.copyWith(color: const Color(0xFFE8F0EA)),
          ),
          const SizedBox(height: ELTokens.space20),
          const ELLearningPath(steps: ['单词', '阅读', '解析', '建议'], activeIndex: 0),
          const SizedBox(height: ELTokens.space20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0x1FFFFFFF),
              borderRadius: ELTokens.radius20All,
              border: Border.all(color: const Color(0x33FFFFFF)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  LucideIcons.sparkles,
                  color: ELTokens.card,
                  size: 22,
                ),
                const SizedBox(width: ELTokens.space12),
                Expanded(
                  child: Text(
                    '当前建议：先完成一组单词训练，阅读会更贴合你今天的词。',
                    style: theme.textTheme.p.copyWith(color: ELTokens.card),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: ELTokens.space20),
          ELButton.secondary(
            label: '开始单词训练',
            onPressed: onStartWords,
            leading: const Icon(LucideIcons.arrowRight, size: 18),
          ),
        ],
      ),
    );
  }
}

class _TaskCard extends StatelessWidget {
  const _TaskCard({
    required this.icon,
    required this.badge,
    required this.title,
    required this.description,
    required this.actionLabel,
    required this.onPressed,
    this.tone = ELBadgeTone.coach,
  });

  final IconData icon;
  final String badge;
  final String title;
  final String description;
  final String actionLabel;
  final VoidCallback onPressed;
  final ELBadgeTone tone;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return ELCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: tone == ELBadgeTone.word
                      ? ELTokens.wordAmberSoft
                      : ELTokens.coachGreenSoft,
                  borderRadius: ELTokens.radius16All,
                ),
                child: Icon(
                  icon,
                  color: tone == ELBadgeTone.word
                      ? ELTokens.wordAmber
                      : ELTokens.coachGreen,
                ),
              ),
              const Spacer(),
              ELBadge(badge, tone: tone),
            ],
          ),
          const SizedBox(height: ELTokens.space16),
          Text(title, style: theme.textTheme.h3),
          const SizedBox(height: ELTokens.space8),
          Text(description, style: theme.textTheme.muted),
          const SizedBox(height: ELTokens.space16),
          ELButton.outline(label: actionLabel, onPressed: onPressed),
        ],
      ),
    );
  }
}

class _CoachNote extends StatelessWidget {
  const _CoachNote({required this.onOpenCoach});

  final VoidCallback onOpenCoach;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return ELCard(
      shadows: const [],
      backgroundColor: ELTokens.wordAmberSoft,
      borderColor: const Color(0xFFEACD9A),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ELSectionHeader(
            title: '教练便签',
            subtitle: '词汇识别不错，推断题需要把单词放回段落逻辑。',
            trailing: Icon(
              LucideIcons.messageCircle,
              color: ELTokens.wordAmber,
            ),
          ),
          const SizedBox(height: ELTokens.space16),
          Text('下一轮建议：少量复习薄弱词，再练 1 篇推断题更明显的阅读。', style: theme.textTheme.p),
          const SizedBox(height: ELTokens.space16),
          ELButton.ghost(label: '查看完整建议', onPressed: onOpenCoach),
        ],
      ),
    );
  }
}

class _ProgressSummary extends StatelessWidget {
  const _ProgressSummary();

  @override
  Widget build(BuildContext context) {
    return ELCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ELSectionHeader(
            title: '今日完成进度',
            subtitle: '数据只服务下一步行动，不做复杂看板。',
          ),
          const SizedBox(height: ELTokens.space16),
          ShadProgress(
            value: .35,
            color: ELTokens.coachGreen,
            backgroundColor: ELTokens.quietLine,
            minHeight: 10,
            semanticsLabel: '今日学习进度',
            semanticsValue: '35%',
          ),
          const SizedBox(height: ELTokens.space16),
          Wrap(
            spacing: ELTokens.space8,
            runSpacing: ELTokens.space8,
            children: [
              for (final metric in todayMetrics)
                ELStatChip(value: metric.value, label: metric.label),
            ],
          ),
        ],
      ),
    );
  }
}
