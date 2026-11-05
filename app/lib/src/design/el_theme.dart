import 'package:flutter/material.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import 'el_tokens.dart';

abstract final class ELTheme {
  const ELTheme._();

  static ELColorScheme colorsOf(BuildContext context) {
    return ShadTheme.of(context).brightness == Brightness.dark
        ? ELTokens.dark
        : ELTokens.light;
  }

  static ShadThemeData get lightShadTheme =>
      _buildShadTheme(brightness: Brightness.light, colors: ELTokens.light);

  static ShadThemeData get darkShadTheme =>
      _buildShadTheme(brightness: Brightness.dark, colors: ELTokens.dark);

  static ShadThemeData get shadTheme => lightShadTheme;

  static ShadThemeData _buildShadTheme({
    required Brightness brightness,
    required ELColorScheme colors,
  }) {
    final isDark = brightness == Brightness.dark;
    final foreground = colors.text;
    final cardForeground = colors.text;
    final primaryForeground = isDark ? colors.background : colors.surface;
    return ShadThemeData(
      brightness: brightness,
      colorScheme:
          (isDark
                  ? const ShadStoneColorScheme.dark()
                  : const ShadStoneColorScheme.light())
              .copyWith(
                background: colors.background,
                foreground: foreground,
                card: colors.surface,
                cardForeground: cardForeground,
                popover: colors.surface,
                popoverForeground: cardForeground,
                primary: colors.primary,
                primaryForeground: primaryForeground,
                secondary: colors.primarySoft,
                secondaryForeground: foreground,
                muted: colors.quietSurface,
                mutedForeground: colors.mutedText,
                accent: colors.wordSoft,
                accentForeground: isDark ? colors.word : colors.word,
                destructive: colors.error,
                destructiveForeground: isDark
                    ? colors.background
                    : colors.surface,
                border: colors.border,
                input: colors.border,
                ring: colors.primary,
                selection: isDark
                    ? const Color(0xFF355172)
                    : colors.primarySoft,
                custom: {
                  'wordOchre': colors.word,
                  'wordOchreSoft': colors.wordSoft,
                  'wordOchreSoftBorder': colors.wordSoftBorder,
                  'brickRed': colors.error,
                  'brickRedSoft': colors.errorSoft,
                  'success': colors.success,
                  'successSoft': colors.successSoft,
                  'surfaceElevated': colors.surfaceElevated,
                },
              ),
      radius: ELTokens.radius16All,
      textTheme: ShadTextTheme(
        family: 'packages/shadcn_ui/Geist',
        h1: TextStyle(
          fontSize: 28,
          height: 1.16,
          fontWeight: FontWeight.w700,
          color: foreground,
        ),
        h2: TextStyle(
          fontSize: 24,
          height: 1.22,
          fontWeight: FontWeight.w700,
          color: foreground,
        ),
        h3: TextStyle(
          fontSize: 20,
          height: 1.28,
          fontWeight: FontWeight.w700,
          color: foreground,
        ),
        h4: TextStyle(
          fontSize: 17,
          height: 1.35,
          fontWeight: FontWeight.w700,
          color: foreground,
        ),
        p: TextStyle(
          fontSize: 16,
          height: 1.55,
          fontWeight: FontWeight.w400,
          color: foreground,
        ),
        lead: TextStyle(
          fontSize: 17,
          height: 1.55,
          fontWeight: FontWeight.w400,
          color: colors.mutedText,
        ),
        small: TextStyle(
          fontSize: 13,
          height: 1.4,
          fontWeight: FontWeight.w500,
          color: colors.mutedText,
        ),
        muted: TextStyle(
          fontSize: 14,
          height: 1.45,
          fontWeight: FontWeight.w400,
          color: colors.mutedText,
        ),
        custom: {
          'reading': TextStyle(
            fontSize: 17,
            height: 1.68,
            fontWeight: FontWeight.w400,
            color: foreground,
          ),
          'label': TextStyle(
            fontSize: 12,
            height: 1.35,
            fontWeight: FontWeight.w700,
            letterSpacing: .4,
            color: colors.mutedText,
          ),
        },
      ),
      cardTheme: ShadCardTheme(
        backgroundColor: colors.surface,
        padding: const EdgeInsets.all(20),
        radius: ELTokens.radius24All,
        shadows: colors.shadow,
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
      primaryButtonTheme: ShadButtonTheme(
        backgroundColor: colors.primary,
        hoverBackgroundColor: colors.primaryDark,
        pressedBackgroundColor: colors.primaryDark,
        foregroundColor: primaryForeground,
        hoverForegroundColor: primaryForeground,
        pressedForegroundColor: primaryForeground,
        textStyle: const TextStyle(fontWeight: FontWeight.w700),
      ),
      secondaryButtonTheme: ShadButtonTheme(
        backgroundColor: colors.primarySoft,
        hoverBackgroundColor: colors.primarySoftHover,
        pressedBackgroundColor: colors.primarySoftPressed,
        foregroundColor: foreground,
        hoverForegroundColor: foreground,
        pressedForegroundColor: foreground,
        textStyle: const TextStyle(fontWeight: FontWeight.w700),
      ),
      outlineButtonTheme: ShadButtonTheme(
        backgroundColor: colors.surface,
        hoverBackgroundColor: isDark
            ? colors.surfaceElevated
            : colors.background,
        foregroundColor: foreground,
        pressedForegroundColor: foreground,
        textStyle: const TextStyle(fontWeight: FontWeight.w700),
      ),
      primaryBadgeTheme: ShadBadgeTheme(
        backgroundColor: colors.primarySoft,
        foregroundColor: colors.primary,
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      ),
      secondaryBadgeTheme: ShadBadgeTheme(
        backgroundColor: colors.wordSoft,
        foregroundColor: colors.word,
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      ),
    );
  }

  static ThemeData materialThemeBuilder(BuildContext context, ThemeData theme) {
    final colors = colorsOf(context);
    final brightness = ShadTheme.of(context).brightness;
    final isDark = brightness == Brightness.dark;
    return theme.copyWith(
      colorScheme: theme.colorScheme.copyWith(
        brightness: brightness,
        primary: colors.primary,
        onPrimary: isDark ? colors.background : colors.surface,
        secondary: colors.primarySoft,
        onSecondary: colors.text,
        surface: colors.surface,
        onSurface: colors.text,
        error: colors.error,
        onError: isDark ? colors.background : colors.surface,
      ),
      scaffoldBackgroundColor: colors.background,
      appBarTheme: AppBarTheme(
        backgroundColor: colors.background,
        foregroundColor: colors.text,
        surfaceTintColor: colors.background,
        elevation: 0,
        centerTitle: false,
      ),
      dividerTheme: DividerThemeData(color: colors.border, thickness: 1),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: colors.surface,
        indicatorColor: colors.primarySoft,
        labelTextStyle: WidgetStateProperty.resolveWith(
          (states) => TextStyle(
            color: states.contains(WidgetState.selected)
                ? colors.primary
                : colors.mutedText,
            fontSize: 12,
            fontWeight: FontWeight.w700,
          ),
        ),
        iconTheme: WidgetStateProperty.resolveWith(
          (states) => IconThemeData(
            color: states.contains(WidgetState.selected)
                ? colors.primary
                : colors.mutedText,
            size: 22,
          ),
        ),
      ),
      navigationRailTheme: NavigationRailThemeData(
        backgroundColor: colors.background,
        selectedIconTheme: IconThemeData(color: colors.primary, size: 22),
        unselectedIconTheme: IconThemeData(color: colors.mutedText, size: 22),
        selectedLabelTextStyle: TextStyle(
          color: colors.primary,
          fontWeight: FontWeight.w700,
        ),
        unselectedLabelTextStyle: TextStyle(
          color: colors.mutedText,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
