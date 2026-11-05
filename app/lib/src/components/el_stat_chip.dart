import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../design/el_theme.dart';
import '../design/el_tokens.dart';

class ELStatChip extends StatelessWidget {
  const ELStatChip({
    super.key,
    required this.value,
    required this.label,
    this.tone = ELStatTone.neutral,
  });

  final String value;
  final String label;
  final ELStatTone tone;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final colors = ELTheme.colorsOf(context);
    final (background, foreground) = switch (tone) {
      ELStatTone.coach => (colors.primarySoft, colors.primary),
      ELStatTone.word => (colors.wordSoft, colors.word),
      ELStatTone.success => (colors.successSoft, colors.success),
      ELStatTone.neutral => (colors.surfaceElevated, colors.text),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: background,
        borderRadius: ELTokens.radius16All,
        border: Border.all(color: colors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(value, style: theme.textTheme.h4.copyWith(color: foreground)),
          const SizedBox(height: 2),
          Text(label, style: theme.textTheme.small),
        ],
      ),
    );
  }
}

enum ELStatTone { coach, word, success, neutral }
