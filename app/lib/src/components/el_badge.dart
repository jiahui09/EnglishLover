import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../design/el_theme.dart';

enum ELBadgeTone { coach, word, success, neutral, danger }

class ELBadge extends StatelessWidget {
  const ELBadge(this.label, {super.key, this.tone = ELBadgeTone.neutral});

  final String label;
  final ELBadgeTone tone;

  @override
  Widget build(BuildContext context) {
    final colors = ELTheme.colorsOf(context);
    final (background, foreground) = switch (tone) {
      ELBadgeTone.coach => (colors.primarySoft, colors.primary),
      ELBadgeTone.word => (colors.wordSoft, colors.word),
      ELBadgeTone.success => (colors.successSoft, colors.success),
      ELBadgeTone.danger => (colors.errorSoft, colors.error),
      ELBadgeTone.neutral => (colors.surfaceElevated, colors.mutedText),
    };

    return ShadBadge(
      backgroundColor: background,
      foregroundColor: foreground,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      child: Text(
        label,
        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
      ),
    );
  }
}
