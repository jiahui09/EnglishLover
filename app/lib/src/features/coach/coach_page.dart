import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../../components/el_badge.dart';
import '../../components/el_button.dart';
import '../../components/el_card.dart';
import '../../components/el_section_header.dart';
import '../../components/el_stat_chip.dart';
import '../../design/el_tokens.dart';
import '../../shared/mock_learning_data.dart';

class CoachPage extends StatelessWidget {
  const CoachPage({super.key, required this.onNavigate});

  final ValueChanged<int> onNavigate;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('教练建议', style: theme.textTheme.h1),
          const SizedBox(height: ELTokens.space8),
          Text('把学习记录转化为具体下一步，而不是展示复杂统计。', style: theme.textTheme.lead),
          const SizedBox(height: ELTokens.space20),
          _HeroCoachCard(onStartTask: () => onNavigate(1)),
          const SizedBox(height: ELTokens.space16),
          LayoutBuilder(
            builder: (context, constraints) {
              final twoColumns = constraints.maxWidth >= 780;
              final children = [const _InsightList(), const _LearningProfile()];
              if (!twoColumns) {
                return Column(
                  children: [
                    children[0],
                    const SizedBox(height: ELTokens.space16),
                    children[1],
                  ],
                );
              }
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(flex: 6, child: children[0]),
                  const SizedBox(width: ELTokens.space16),
                  Expanded(flex: 4, child: children[1]),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _HeroCoachCard extends StatelessWidget {
  const _HeroCoachCard({required this.onStartTask});

  final VoidCallback onStartTask;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return ELCard(
      backgroundColor: ELTokens.coachGreenSoft,
      borderColor: const Color(0xFFD7E6DC),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ELBadge('今日一句话建议', tone: ELBadgeTone.coach),
          const SizedBox(height: ELTokens.space12),
          Text('先复习 4 个薄弱词，再做一篇推断题更明显的阅读。', style: theme.textTheme.h2),
          const SizedBox(height: ELTokens.space12),
          Text('依据：最近阅读正确率 75%，词汇识别稳定，但推断题错了 2 道。', style: theme.textTheme.p),
          const SizedBox(height: ELTokens.space20),
          ELButton.primary(
            label: '开始推荐任务',
            onPressed: onStartTask,
            leading: const Icon(LucideIcons.target, size: 18),
          ),
        ],
      ),
    );
  }
}

class _InsightList extends StatelessWidget {
  const _InsightList();

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return ELCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ELSectionHeader(
            title: '私人教练分析',
            subtitle: '固定为“判断 / 原因 / 下一步”，保证建议具体可执行。',
          ),
          const SizedBox(height: ELTokens.space16),
          for (var i = 0; i < coachInsights.length; i++) ...[
            _InsightRow(insight: coachInsights[i]),
            if (i < coachInsights.length - 1)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: ELTokens.space12),
                child: ShadSeparator.horizontal(color: ELTokens.line),
              ),
          ],
          const SizedBox(height: ELTokens.space16),
          Text(
            '数据不足时会透明说明：完成一次单词和阅读后，我会给出更准确的建议。',
            style: theme.textTheme.small,
          ),
        ],
      ),
    );
  }
}

class _InsightRow extends StatelessWidget {
  const _InsightRow({required this.insight});

  final CoachInsight insight;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: const BoxDecoration(
            color: ELTokens.coachGreenSoft,
            borderRadius: ELTokens.radius16All,
          ),
          child: Icon(insight.icon, color: ELTokens.coachGreen, size: 20),
        ),
        const SizedBox(width: ELTokens.space12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(insight.title, style: theme.textTheme.h4),
              const SizedBox(height: ELTokens.space4),
              Text(insight.description, style: theme.textTheme.muted),
            ],
          ),
        ),
      ],
    );
  }
}

class _LearningProfile extends StatelessWidget {
  const _LearningProfile();

  @override
  Widget build(BuildContext context) {
    return ELCard(
      shadows: const [],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ELSectionHeader(title: '学习画像摘要', subtitle: '首版摘要化呈现，主动查看再展开。'),
          const SizedBox(height: ELTokens.space16),
          const Wrap(
            spacing: ELTokens.space8,
            runSpacing: ELTokens.space8,
            children: [
              ELStatChip(value: '86%', label: '词汇识别', tone: ELStatTone.coach),
              ELStatChip(
                value: '75%',
                label: '阅读正确率',
                tone: ELStatTone.neutral,
              ),
              ELStatChip(value: '2 道', label: '推断题错因', tone: ELStatTone.word),
            ],
          ),
          const SizedBox(height: ELTokens.space16),
          _ProfileRow(
            label: '薄弱词回流',
            value: 'significant · maintain · evaluate',
          ),
          _ProfileRow(label: '下一轮重点', value: '观点句、转折句、作者态度'),
          _ProfileRow(label: '连续学习', value: '3 天'),
        ],
      ),
    );
  }
}

class _ProfileRow extends StatelessWidget {
  const _ProfileRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: ELTokens.space12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: theme.textTheme.small),
          const SizedBox(height: ELTokens.space4),
          Text(value, style: theme.textTheme.p),
        ],
      ),
    );
  }
}
