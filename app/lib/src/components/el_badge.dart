import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../design/el_tokens.dart';

enum ELBadgeTone { coach, word, neutral, danger }

class ELBadge extends StatelessWidget {
  const ELBadge(this.label, {super.key, this.tone = ELBadgeTone.neutral});

  final String label;
  final ELBadgeTone tone;

  @override
  Widget build(BuildContext context) {
    final (background, foreground) = switch (tone) {
      ELBadgeTone.coach => (ELTokens.coachGreenSoft, ELTokens.coachGreen),
      ELBadgeTone.word => (ELTokens.wordAmberSoft, ELTokens.wordAmber),
      ELBadgeTone.danger => (ELTokens.softRedSoft, ELTokens.softRed),
      ELBadgeTone.neutral => (ELTokens.paper, ELTokens.mutedInk),
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
