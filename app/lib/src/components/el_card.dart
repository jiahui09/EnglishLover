import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../design/el_theme.dart';
import '../design/el_tokens.dart';

enum ELSurfaceLevel { level1, level2, flat }

class ELCard extends StatelessWidget {
  const ELCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.backgroundColor,
    this.borderColor,
    this.shadows,
    this.radius = ELTokens.radius24All,
    this.level = ELSurfaceLevel.level1,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final Color? backgroundColor;
  final Color? borderColor;
  final List<BoxShadow>? shadows;
  final BorderRadius radius;
  final ELSurfaceLevel level;

  @override
  Widget build(BuildContext context) {
    final colors = ELTheme.colorsOf(context);
    final resolvedBackground =
        backgroundColor ??
        switch (level) {
          ELSurfaceLevel.level2 => colors.surfaceElevated,
          ELSurfaceLevel.level1 || ELSurfaceLevel.flat => colors.surface,
        };
    final resolvedShadows =
        shadows ??
        switch (level) {
          ELSurfaceLevel.level2 => colors.level2Shadow,
          ELSurfaceLevel.level1 => colors.level1Shadow,
          ELSurfaceLevel.flat => ELTokens.noShadow,
        };

    return ShadCard(
      padding: padding,
      radius: radius,
      backgroundColor: resolvedBackground,
      border: ShadBorder.all(color: borderColor ?? colors.border),
      shadows: resolvedShadows,
      width: double.infinity,
      child: child,
    );
  }
}
