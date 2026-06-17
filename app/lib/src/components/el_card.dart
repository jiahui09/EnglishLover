import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../design/el_tokens.dart';

class ELCard extends StatelessWidget {
  const ELCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.backgroundColor,
    this.borderColor = ELTokens.line,
    this.shadows,
    this.radius = ELTokens.radius24All,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final Color? backgroundColor;
  final Color borderColor;
  final List<BoxShadow>? shadows;
  final BorderRadius radius;

  @override
  Widget build(BuildContext context) {
    return ShadCard(
      padding: padding,
      radius: radius,
      backgroundColor: backgroundColor ?? ELTokens.card,
      border: ShadBorder.all(color: borderColor),
      shadows: shadows ?? ELTokens.softShadow,
      width: double.infinity,
      child: child,
    );
  }
}
