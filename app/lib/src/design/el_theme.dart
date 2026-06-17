import 'package:flutter/material.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import 'el_tokens.dart';

abstract final class ELTheme {
  const ELTheme._();

  static ShadThemeData get shadTheme => ShadThemeData(
    brightness: Brightness.light,
    colorScheme: const ShadStoneColorScheme.light().copyWith(
      background: ELTokens.paper,
      foreground: ELTokens.ink,
      card: ELTokens.card,
      cardForeground: ELTokens.ink,
      popover: ELTokens.card,
      popoverForeground: ELTokens.ink,
      primary: ELTokens.coachGreen,
      primaryForeground: ELTokens.card,
      secondary: ELTokens.coachGreenSoft,
      secondaryForeground: ELTokens.ink,
      muted: ELTokens.quietLine,
      mutedForeground: ELTokens.mutedInk,
      accent: ELTokens.wordAmberSoft,
      accentForeground: ELTokens.ink,
      destructive: ELTokens.softRed,
      destructiveForeground: ELTokens.card,
      border: ELTokens.line,
      input: ELTokens.line,
      ring: ELTokens.coachGreen,
      selection: ELTokens.coachGreenSoft,
      custom: const {
        'wordAmber': ELTokens.wordAmber,
        'wordAmberSoft': ELTokens.wordAmberSoft,
        'softRed': ELTokens.softRed,
        'softRedSoft': ELTokens.softRedSoft,
      },
    ),
    radius: ELTokens.radius16All,
    textTheme: ShadTextTheme(
      family: 'packages/shadcn_ui/Geist',
      h1: const TextStyle(
        fontSize: 28,
        height: 1.16,
        fontWeight: FontWeight.w700,
        color: ELTokens.ink,
      ),
      h2: const TextStyle(
        fontSize: 24,
        height: 1.22,
        fontWeight: FontWeight.w700,
        color: ELTokens.ink,
      ),
      h3: const TextStyle(
        fontSize: 20,
        height: 1.28,
        fontWeight: FontWeight.w700,
        color: ELTokens.ink,
      ),
      h4: const TextStyle(
        fontSize: 17,
        height: 1.35,
        fontWeight: FontWeight.w700,
        color: ELTokens.ink,
      ),
      p: const TextStyle(
        fontSize: 16,
        height: 1.55,
        fontWeight: FontWeight.w400,
        color: ELTokens.ink,
      ),
      lead: const TextStyle(
        fontSize: 17,
        height: 1.55,
        fontWeight: FontWeight.w400,
        color: ELTokens.mutedInk,
      ),
      small: const TextStyle(
        fontSize: 13,
        height: 1.4,
        fontWeight: FontWeight.w500,
        color: ELTokens.mutedInk,
      ),
      muted: const TextStyle(
        fontSize: 14,
        height: 1.45,
        fontWeight: FontWeight.w400,
        color: ELTokens.mutedInk,
      ),
      custom: const {
        'reading': TextStyle(
          fontSize: 17,
          height: 1.68,
          fontWeight: FontWeight.w400,
          color: ELTokens.ink,
        ),
        'label': TextStyle(
          fontSize: 12,
          height: 1.35,
          fontWeight: FontWeight.w700,
          letterSpacing: .4,
          color: ELTokens.mutedInk,
        ),
      },
    ),
    cardTheme: const ShadCardTheme(
      backgroundColor: ELTokens.card,
      padding: EdgeInsets.all(20),
      radius: ELTokens.radius24All,
      shadows: ELTokens.softShadow,
      columnMainAxisSize: MainAxisSize.min,
      rowMainAxisSize: MainAxisSize.max,
    ),
    buttonSizesTheme: const ShadButtonSizesTheme(
      regular: ShadButtonSizeTheme(
        height: 48,
        padding: EdgeInsets.symmetric(horizontal: 18, vertical: 12),
      ),
      lg: ShadButtonSizeTheme(
        height: 52,
        padding: EdgeInsets.symmetric(horizontal: 22, vertical: 14),
      ),
      sm: ShadButtonSizeTheme(
        height: 40,
        padding: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      ),
    ),
    primaryButtonTheme: const ShadButtonTheme(
      backgroundColor: ELTokens.coachGreen,
      hoverBackgroundColor: ELTokens.coachGreenDark,
      pressedBackgroundColor: ELTokens.coachGreenDark,
      foregroundColor: ELTokens.card,
      hoverForegroundColor: ELTokens.card,
      textStyle: TextStyle(fontWeight: FontWeight.w700),
    ),
    secondaryButtonTheme: const ShadButtonTheme(
      backgroundColor: ELTokens.coachGreenSoft,
      hoverBackgroundColor: Color(0xFFDDE9E1),
      pressedBackgroundColor: Color(0xFFD4E1D9),
      foregroundColor: ELTokens.ink,
      hoverForegroundColor: ELTokens.ink,
      textStyle: TextStyle(fontWeight: FontWeight.w700),
    ),
    outlineButtonTheme: const ShadButtonTheme(
      backgroundColor: ELTokens.card,
      hoverBackgroundColor: ELTokens.paper,
      foregroundColor: ELTokens.ink,
      textStyle: TextStyle(fontWeight: FontWeight.w700),
    ),
    primaryBadgeTheme: const ShadBadgeTheme(
      backgroundColor: ELTokens.coachGreenSoft,
      foregroundColor: ELTokens.coachGreen,
      padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
    ),
    secondaryBadgeTheme: const ShadBadgeTheme(
      backgroundColor: ELTokens.wordAmberSoft,
      foregroundColor: ELTokens.wordAmber,
      padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
    ),
  );

  static ThemeData materialThemeBuilder(BuildContext context, ThemeData theme) {
    return theme.copyWith(
      scaffoldBackgroundColor: ELTokens.paper,
      appBarTheme: const AppBarTheme(
        backgroundColor: ELTokens.paper,
        foregroundColor: ELTokens.ink,
        elevation: 0,
        centerTitle: false,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: ELTokens.card,
        indicatorColor: ELTokens.coachGreenSoft,
        labelTextStyle: WidgetStateProperty.resolveWith(
          (states) => TextStyle(
            color: states.contains(WidgetState.selected)
                ? ELTokens.coachGreen
                : ELTokens.mutedInk,
            fontSize: 12,
            fontWeight: FontWeight.w700,
          ),
        ),
        iconTheme: WidgetStateProperty.resolveWith(
          (states) => IconThemeData(
            color: states.contains(WidgetState.selected)
                ? ELTokens.coachGreen
                : ELTokens.mutedInk,
            size: 22,
          ),
        ),
      ),
      navigationRailTheme: const NavigationRailThemeData(
        backgroundColor: ELTokens.paper,
        selectedIconTheme: IconThemeData(color: ELTokens.coachGreen, size: 22),
        unselectedIconTheme: IconThemeData(color: ELTokens.mutedInk, size: 22),
        selectedLabelTextStyle: TextStyle(
          color: ELTokens.coachGreen,
          fontWeight: FontWeight.w700,
        ),
        unselectedLabelTextStyle: TextStyle(
          color: ELTokens.mutedInk,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
