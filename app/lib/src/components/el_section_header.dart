import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../design/el_tokens.dart';

class ELSectionHeader extends StatelessWidget {
  const ELSectionHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.trailing,
  });

  final String title;
  final String? subtitle;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: theme.textTheme.h3),
              _Subtitle(text: subtitle, style: theme.textTheme.muted),
            ],
          ),
        ),
        ?trailing,
      ],
    );
  }
}

class _Subtitle extends StatelessWidget {
  const _Subtitle({required this.text, required this.style});

  final String? text;
  final TextStyle style;

  @override
  Widget build(BuildContext context) {
    final text = this.text;
    if (text == null) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(top: ELTokens.space4),
      child: Text(text, style: style),
    );
  }
}
