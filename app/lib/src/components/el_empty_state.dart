import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../design/el_tokens.dart';
import 'el_button.dart';
import 'el_card.dart';

class ELEmptyState extends StatelessWidget {
  const ELEmptyState({
    super.key,
    required this.title,
    required this.description,
    required this.actionLabel,
    this.onAction,
  });

  final String title;
  final String description;
  final String actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return ELCard(
      backgroundColor: ELTokens.coachGreenSoft,
      shadows: const [],
      borderColor: ELTokens.coachGreenSoft,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: theme.textTheme.h4),
          const SizedBox(height: ELTokens.space8),
          Text(description, style: theme.textTheme.muted),
          const SizedBox(height: ELTokens.space16),
          ELButton.secondary(label: actionLabel, onPressed: onAction),
        ],
      ),
    );
  }
}
