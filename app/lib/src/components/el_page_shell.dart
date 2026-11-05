import 'package:flutter/material.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../design/el_theme.dart';
import '../design/el_tokens.dart';
import 'el_badge.dart';
import 'el_button.dart';
import 'el_card.dart';

class ELPageShell extends StatelessWidget {
  const ELPageShell({
    super.key,
    required this.title,
    required this.subtitle,
    required this.children,
    this.badge,
    this.trailing,
    this.padding = ELTokens.pagePadding,
  });

  final Widget? badge;
  final Widget? trailing;
  final String title;
  final String subtitle;
  final List<Widget> children;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);

    return SingleChildScrollView(
      padding: padding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (badge != null) ...[
            badge!,
            const SizedBox(height: ELTokens.space12),
          ],
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: theme.textTheme.h1),
                    const SizedBox(height: ELTokens.space8),
                    Text(subtitle, style: theme.textTheme.lead),
                  ],
                ),
              ),
              if (trailing != null) ...[
                const SizedBox(width: ELTokens.space12),
                trailing!,
              ],
            ],
          ),
          if (children.isNotEmpty) ...[
            const SizedBox(height: ELTokens.space20),
            for (var i = 0; i < children.length; i++) ...[
              if (i > 0) const SizedBox(height: ELTokens.space16),
              children[i],
            ],
          ],
        ],
      ),
    );
  }
}

class ELFocusShell extends StatelessWidget {
  const ELFocusShell({
    super.key,
    required this.stageLabel,
    required this.title,
    required this.subtitle,
    required this.progressLabel,
    required this.progressValue,
    required this.child,
    required this.onExit,
    this.stageTone = ELBadgeTone.word,
    this.exitLabel = '返回今日学习',
  });

  final String stageLabel;
  final ELBadgeTone stageTone;
  final String title;
  final String subtitle;
  final String progressLabel;
  final double progressValue;
  final Widget child;
  final VoidCallback onExit;
  final String exitLabel;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final colors = ELTheme.colorsOf(context);
    final percent = (progressValue.clamp(0.0, 1.0) * 100).round();

    return SingleChildScrollView(
      padding: ELTokens.pagePadding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              ELBadge(stageLabel, tone: stageTone),
              const Spacer(),
              ELButton.ghost(
                label: exitLabel,
                onPressed: onExit,
                size: ShadButtonSize.sm,
                leading: const Icon(LucideIcons.arrowLeft, size: 16),
              ),
            ],
          ),
          const SizedBox(height: ELTokens.space12),
          ELCard(
            level: ELSurfaceLevel.level2,
            borderColor: colors.primarySoftBorder,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: theme.textTheme.h2),
                const SizedBox(height: ELTokens.space8),
                Text(subtitle, style: theme.textTheme.lead),
                const SizedBox(height: ELTokens.space16),
                Row(
                  children: [
                    Expanded(
                      child: Text(progressLabel, style: theme.textTheme.small),
                    ),
                    Text('$percent%', style: theme.textTheme.small),
                  ],
                ),
                const SizedBox(height: ELTokens.space8),
                ShadProgress(
                  value: progressValue,
                  color: colors.primary,
                  backgroundColor: colors.quietSurface,
                  minHeight: 10,
                  semanticsLabel: progressLabel,
                  semanticsValue: '$percent%',
                ),
                const SizedBox(height: ELTokens.space20),
                child,
              ],
            ),
          ),
        ],
      ),
    );
  }
}
