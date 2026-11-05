import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../../components/el_badge.dart';
import '../../components/el_button.dart';
import '../../components/el_card.dart';
import '../../components/el_learning_path.dart';
import '../../components/el_section_header.dart';
import '../../design/el_theme.dart';
import '../../design/el_tokens.dart';
import '../../shared/learning_session.dart';

class HomePage extends StatelessWidget {
  const HomePage({
    super.key,
    required this.session,
    required this.onNavigate,
  });

  final LearningSessionController session;
  final ValueChanged<int> onNavigate;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final plan = _buildPlan();

    return SingleChildScrollView(
      padding: ELTokens.homePagePadding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ELBadge('今日学习', tone: ELBadgeTone.coach),
          const SizedBox(height: ELTokens.space16),
          Text('今天的英语学习计划', style: theme.textTheme.h1),
          const SizedBox(height: ELTokens.space8),
          Text(plan.subtitle, style: theme.textTheme.lead),
          const SizedBox(height: ELTokens.space16),
          _GoalCard(session: session),
          const SizedBox(height: ELTokens.space20),
          ELLearningPath(
            steps: const ['单词', '阅读', '解析', '建议'],
            activeIndex: plan.pathIndex,
          ),
          const SizedBox(height: ELTokens.space20),
          _MainTaskCard(plan: plan),
          const SizedBox(height: ELTokens.space16),
          _TaskStatusGrid(session: session, onNavigate: onNavigate),
          const SizedBox(height: ELTokens.space16),
          _CoachSummaryCard(session: session, onNavigate: onNavigate),
        ],
      ),
    );
  }

  _HomePlan _buildPlan() {
    if (session.isTodayComplete) {
      return _HomePlan(
        subtitle: '单词输入、阅读输出和教练建议都已完成，明天优先回到薄弱词。',
        title: '今日学习已完成',
        body: '你已经跑完今天的闭环。明天会优先复习 ${session.weakWords.length} 个薄弱词。',
        actionLabel: '查看教练建议',
        action: () => onNavigate(3),
        pathIndex: 3,
      );
    }
    if (session.readingCompleted) {
      return _HomePlan(
        subtitle: '阅读已经完成，下一步收口到教练建议，明确明天该怎么学。',
        title: '现在去看教练建议',
        body: '本次阅读正确率 ${(session.accuracy * 100).round()}%。先看判断、原因和下一步，再决定是否回炉薄弱词。',
        actionLabel: '查看完整建议',
        action: () => onNavigate(3),
        pathIndex: 2,
      );
    }
    if (session.canGenerateReading) {
      return _HomePlan(
        subtitle: '先把刚复习的词放进阅读里，再用题目检验它们在语境里是否稳定。',
        title: '下一步生成今日阅读',
        body: '本轮单词已完成。优先把模糊和不认识的词放回文章里，继续今天的学习闭环。',
        actionLabel: '生成今日阅读',
        action: () => onNavigate(2),
        pathIndex: 1,
      );
    }
    return _HomePlan(
      subtitle: '先把近期单词过一遍，再用它们完成一篇考研英语阅读。',
      title: session.hasAnyLearningRecord ? '先回到单词训练' : '先开始第一组单词',
      body: session.hasAnyLearningRecord
          ? '今天还没形成完整闭环。先完成一组单词，阅读会更贴合你当下的词汇状态。'
          : '完成一组单词后，我会用这些词生成第一篇阅读，让你直接进入语境复现。',
      actionLabel: session.hasAnyLearningRecord ? '开始单词训练' : '开始第一组单词',
      action: () => onNavigate(1),
      pathIndex: 0,
    );
  }
}

class _GoalCard extends StatelessWidget {
  const _GoalCard({required this.session});

  final LearningSessionController session;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final colors = ELTheme.colorsOf(context);
    final percent = (session.todayProgress * 100).round();

    return ELCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ELSectionHeader(
            title: '今日目标',
            subtitle: '完成 1 组单词复习 + 1 篇阅读理解',
          ),
          const SizedBox(height: ELTokens.space12),
          Row(
            children: [
              Text('预计 15-25 分钟', style: theme.textTheme.small),
              const Spacer(),
              Text('今日完成 $percent%', style: theme.textTheme.small),
            ],
          ),
          const SizedBox(height: ELTokens.space8),
          ShadProgress(
            value: session.todayProgress,
            color: colors.primary,
            backgroundColor: colors.quietSurface,
            minHeight: 8,
            semanticsLabel: '今日学习进度',
            semanticsValue: '$percent%',
          ),
        ],
      ),
    );
  }
}

class _MainTaskCard extends StatelessWidget {
  const _MainTaskCard({required this.plan});

  final _HomePlan plan;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final colors = ELTheme.colorsOf(context);

    return ELCard(
      borderColor: colors.primarySoftBorder,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const ELBadge('当前建议', tone: ELBadgeTone.coach),
                    const SizedBox(height: ELTokens.space12),
                    Text(plan.title, style: theme.textTheme.h2),
                    const SizedBox(height: ELTokens.space8),
                    Text(plan.body, style: theme.textTheme.muted),
                  ],
                ),
              ),
              const SizedBox(width: ELTokens.space16),
              Icon(LucideIcons.route, color: colors.primary, size: 22),
            ],
          ),
          const SizedBox(height: ELTokens.space20),
          ELButton.primary(
            label: plan.actionLabel,
            onPressed: plan.action,
            trailing: const Icon(LucideIcons.arrowRight, size: 18),
          ),
        ],
      ),
    );
  }
}

class _TaskStatusGrid extends StatelessWidget {
  const _TaskStatusGrid({required this.session, required this.onNavigate});

  final LearningSessionController session;
  final ValueChanged<int> onNavigate;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final twoColumns = constraints.maxWidth >= 760;
        final cards = [
          _StatusCard(
            badge: session.wordSessionCompleted ? '已完成' : '待开始',
            title: session.wordSessionCompleted ? '单词训练已完成' : '单词训练',
            description: session.wordSessionCompleted
                ? '认识 ${session.knownCount} 个，模糊 ${session.unsureCount} 个，不认识 ${session.unknownCount} 个。'
                : '复习近期词，准备生成今日阅读。',
            action: ELButton.ghost(
              label: session.wordSessionCompleted ? '再做一组' : '去做单词训练',
              onPressed: () => onNavigate(1),
              trailing: const Icon(LucideIcons.arrowRight, size: 16),
            ),
          ),
          _StatusCard(
            badge: session.readingCompleted ? '已完成' : (session.canGenerateReading ? '可开始' : '待解锁'),
            title: session.readingCompleted ? '阅读训练已完成' : '阅读训练',
            description: session.readingCompleted
                ? '正确率 ${(session.accuracy * 100).round()}%，下一步看教练建议。'
                : (session.canGenerateReading
                      ? '将使用近期词生成考研英语阅读和题目。'
                      : '建议先完成一组单词训练，阅读会更贴合今天的学习内容。'),
            action: ELButton.ghost(
              label: session.canGenerateReading ? '打开阅读训练' : '先去背词',
              onPressed: () => onNavigate(session.canGenerateReading ? 2 : 1),
              trailing: const Icon(LucideIcons.arrowRight, size: 16),
            ),
          ),
        ];

        if (!twoColumns) {
          return Column(
            children: [
              cards[0],
              const SizedBox(height: ELTokens.space16),
              cards[1],
            ],
          );
        }

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: cards[0]),
            const SizedBox(width: ELTokens.space16),
            Expanded(child: cards[1]),
          ],
        );
      },
    );
  }
}

class _StatusCard extends StatelessWidget {
  const _StatusCard({
    required this.badge,
    required this.title,
    required this.description,
    required this.action,
  });

  final String badge;
  final String title;
  final String description;
  final Widget action;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);

    return ELCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ELBadge(badge, tone: ELBadgeTone.neutral),
          const SizedBox(height: ELTokens.space12),
          Text(title, style: theme.textTheme.h3),
          const SizedBox(height: ELTokens.space8),
          Text(description, style: theme.textTheme.muted),
          const SizedBox(height: ELTokens.space16),
          action,
        ],
      ),
    );
  }
}

class _CoachSummaryCard extends StatelessWidget {
  const _CoachSummaryCard({required this.session, required this.onNavigate});

  final LearningSessionController session;
  final ValueChanged<int> onNavigate;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);

    return ELCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ELSectionHeader(title: '教练建议', subtitle: '判断当前状态，并指出下一步。'),
          const SizedBox(height: ELTokens.space12),
          Text(session.coachHeadline, style: theme.textTheme.p),
          const SizedBox(height: ELTokens.space16),
          ELButton.ghost(
            label: '查看完整建议',
            onPressed: () => onNavigate(3),
            trailing: const Icon(LucideIcons.arrowRight, size: 16),
          ),
        ],
      ),
    );
  }
}

class _HomePlan {
  const _HomePlan({
    required this.subtitle,
    required this.title,
    required this.body,
    required this.actionLabel,
    required this.action,
    required this.pathIndex,
  });

  final String subtitle;
  final String title;
  final String body;
  final String actionLabel;
  final VoidCallback action;
  final int pathIndex;
}
