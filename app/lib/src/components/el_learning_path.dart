import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../design/el_tokens.dart';

class ELLearningPath extends StatelessWidget {
  const ELLearningPath({super.key, required this.steps, this.activeIndex = 0});

  final List<String> steps;
  final int activeIndex;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: ELTokens.space8,
      runSpacing: ELTokens.space8,
      children: [
        for (var i = 0; i < steps.length; i++) ...[
          _PathNode(
            label: steps[i],
            active: i == activeIndex,
            complete: i < activeIndex,
            textStyle: theme.textTheme.small,
          ),
          if (i < steps.length - 1)
            Container(
              width: 22,
              height: 1.5,
              color: i < activeIndex ? ELTokens.coachGreen : ELTokens.line,
            ),
        ],
      ],
    );
  }
}

class _PathNode extends StatelessWidget {
  const _PathNode({
    required this.label,
    required this.active,
    required this.complete,
    required this.textStyle,
  });

  final String label;
  final bool active;
  final bool complete;
  final TextStyle textStyle;

  @override
  Widget build(BuildContext context) {
    final color = active || complete ? ELTokens.coachGreen : ELTokens.mutedInk;
    final background = active || complete
        ? ELTokens.coachGreenSoft
        : ELTokens.card;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: active ? ELTokens.coachGreen : ELTokens.line),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 6),
          Text(label, style: textStyle.copyWith(color: color)),
        ],
      ),
    );
  }
}
