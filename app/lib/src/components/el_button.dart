import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

class ELButton extends StatelessWidget {
  const ELButton.primary({
    super.key,
    required this.label,
    this.onPressed,
    this.leading,
    this.trailing,
    this.expands = false,
    this.size = ShadButtonSize.regular,
  }) : _variant = _ELButtonVariant.primary;

  const ELButton.secondary({
    super.key,
    required this.label,
    this.onPressed,
    this.leading,
    this.trailing,
    this.expands = false,
    this.size = ShadButtonSize.regular,
  }) : _variant = _ELButtonVariant.secondary;

  const ELButton.outline({
    super.key,
    required this.label,
    this.onPressed,
    this.leading,
    this.trailing,
    this.expands = false,
    this.size = ShadButtonSize.regular,
  }) : _variant = _ELButtonVariant.outline;

  const ELButton.ghost({
    super.key,
    required this.label,
    this.onPressed,
    this.leading,
    this.trailing,
    this.expands = false,
    this.size = ShadButtonSize.regular,
  }) : _variant = _ELButtonVariant.ghost;

  final String label;
  final VoidCallback? onPressed;
  final Widget? leading;
  final Widget? trailing;
  final bool expands;
  final ShadButtonSize size;
  final _ELButtonVariant _variant;

  @override
  Widget build(BuildContext context) {
    final child = Text(label);
    return switch (_variant) {
      _ELButtonVariant.primary => ShadButton(
        onPressed: onPressed,
        leading: leading,
        trailing: trailing,
        size: size,
        expands: expands,
        child: child,
      ),
      _ELButtonVariant.secondary => ShadButton.secondary(
        onPressed: onPressed,
        leading: leading,
        trailing: trailing,
        size: size,
        expands: expands,
        child: child,
      ),
      _ELButtonVariant.outline => ShadButton.outline(
        onPressed: onPressed,
        leading: leading,
        trailing: trailing,
        size: size,
        expands: expands,
        child: child,
      ),
      _ELButtonVariant.ghost => ShadButton.ghost(
        onPressed: onPressed,
        leading: leading,
        trailing: trailing,
        size: size,
        expands: expands,
        child: child,
      ),
    };
  }
}

enum _ELButtonVariant { primary, secondary, outline, ghost }
