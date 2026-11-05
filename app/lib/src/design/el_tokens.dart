import 'package:flutter/widgets.dart';

const _englishLoverLevel1Shadow = <BoxShadow>[
  BoxShadow(color: Color(0x0F24252B), blurRadius: 18, offset: Offset(0, 8)),
];

const _englishLoverLevel2Shadow = <BoxShadow>[
  BoxShadow(color: Color(0x1224252B), blurRadius: 24, offset: Offset(0, 12)),
];

/// EnglishLover design tokens.
///
/// Keep raw visual constants here so pages and feature widgets do not scatter
/// one-off colors, spacing, and radii.
abstract final class ELTokens {
  const ELTokens._();

  // Raw color constants.
  static const inkColor = Color(0xFF24252B);
  static const mutedInkColor = Color(0xFF6B6870);
  static const studyPaperColor = Color(0xFFF6F1E8);
  static const warmCardColor = Color(0xFFFFFCF6);
  static const focusSurfaceColor = Color(0xFFFFFFFF);
  static const oxfordBlueColor = Color(0xFF334E7E);
  static const oxfordBlueDarkColor = Color(0xFF263B60);
  static const oxfordBlueSoftColor = Color(0xFFE8EEF8);
  static const oxfordBlueSoftHoverColor = Color(0xFFDCE6F5);
  static const oxfordBlueSoftPressedColor = Color(0xFFD2DEF0);
  static const oxfordBlueSoftBorderColor = Color(0xFFD3DDEA);
  static const successColor = Color(0xFF20C997);
  static const successSoftColor = Color(0xFFDDF9F1);
  static const wordOchreColor = Color(0xFF94551F);
  static const wordOchreSoftColor = Color(0xFFF7E8D2);
  static const wordOchreSoftBorderColor = Color(0xFFE4C58F);
  static const brickRedColor = Color(0xFFA34A3F);
  static const brickRedSoftColor = Color(0xFFF7E6E2);
  static const deskLineColor = Color(0xFFE5D8C6);
  static const quietSurfaceColor = Color(0xFFEFE6D8);

  // Transitional aliases.
  static const ink = inkColor;
  static const mutedInk = mutedInkColor;
  static const studyPaper = studyPaperColor;
  static const warmCard = warmCardColor;
  static const focusSurface = focusSurfaceColor;
  static const oxfordBlue = oxfordBlueColor;
  static const oxfordBlueDark = oxfordBlueDarkColor;
  static const oxfordBlueSoft = oxfordBlueSoftColor;
  static const oxfordBlueSoftHover = oxfordBlueSoftHoverColor;
  static const oxfordBlueSoftPressed = oxfordBlueSoftPressedColor;
  static const oxfordBlueSoftBorder = oxfordBlueSoftBorderColor;
  static const success = successColor;
  static const successSoft = successSoftColor;
  static const wordOchre = wordOchreColor;
  static const wordOchreSoft = wordOchreSoftColor;
  static const wordOchreSoftBorder = wordOchreSoftBorderColor;
  static const brickRed = brickRedColor;
  static const brickRedSoft = brickRedSoftColor;
  static const deskLine = deskLineColor;
  static const quietSurface = quietSurfaceColor;

  static const space4 = 4.0;
  static const space8 = 8.0;
  static const space12 = 12.0;
  static const space16 = 16.0;
  static const space20 = 20.0;
  static const space24 = 24.0;
  static const space32 = 32.0;
  static const space40 = 40.0;
  static const space56 = 56.0;
  static const space64 = 64.0;
  static const space72 = 72.0;

  static const pagePadding = EdgeInsets.fromLTRB(20, 18, 20, 28);
  static const homePagePadding = EdgeInsets.fromLTRB(24, 24, 24, 32);
  static const cardPadding = EdgeInsets.all(20);
  static const compactCardPadding = EdgeInsets.all(16);
  static const focusPadding = EdgeInsets.all(24);

  static const radius12 = Radius.circular(12);
  static const radius16 = Radius.circular(16);
  static const radius20 = Radius.circular(20);
  static const radius24 = Radius.circular(24);

  static const radius16All = BorderRadius.all(radius16);
  static const radius20All = BorderRadius.all(radius20);
  static const radius24All = BorderRadius.all(radius24);

  static const secondaryPanelHeight = 192.0;

  static const maxContentWidth = 1040.0;
  static const sideRailBreakpoint = 820.0;

  static const level1Shadow = _englishLoverLevel1Shadow;
  static const level2Shadow = _englishLoverLevel2Shadow;
  static const noShadow = <BoxShadow>[];

  // Transitional alias. Prefer level1Shadow / level2Shadow in new code.
  static const softShadow = _englishLoverLevel1Shadow;

  static const light = ELColorScheme(
    background: studyPaperColor,
    surface: warmCardColor,
    surfaceElevated: focusSurfaceColor,
    primary: oxfordBlueColor,
    primaryDark: oxfordBlueDarkColor,
    primarySoft: oxfordBlueSoftColor,
    primarySoftHover: oxfordBlueSoftHoverColor,
    primarySoftPressed: oxfordBlueSoftPressedColor,
    primarySoftBorder: oxfordBlueSoftBorderColor,
    success: successColor,
    successSoft: successSoftColor,
    word: wordOchreColor,
    wordSoft: wordOchreSoftColor,
    wordSoftBorder: wordOchreSoftBorderColor,
    error: brickRedColor,
    errorSoft: brickRedSoftColor,
    text: inkColor,
    mutedText: mutedInkColor,
    border: deskLineColor,
    quietSurface: quietSurfaceColor,
    level1Shadow: _englishLoverLevel1Shadow,
    level2Shadow: _englishLoverLevel2Shadow,
  );

  static const dark = ELColorScheme(
    background: Color(0xFF0F172A),
    surface: Color(0xFF111827),
    surfaceElevated: Color(0xFF1E293B),
    primary: Color(0xFF8BA4F9),
    primaryDark: Color(0xFF6F8EEA),
    primarySoft: Color(0xFF1E2A44),
    primarySoftHover: Color(0xFF243252),
    primarySoftPressed: Color(0xFF2B3A5E),
    primarySoftBorder: Color(0xFF334664),
    success: Color(0xFF34D399),
    successSoft: Color(0xFF123326),
    word: Color(0xFFE0A34B),
    wordSoft: Color(0xFF2A2116),
    wordSoftBorder: Color(0xFF594025),
    error: Color(0xFFF87171),
    errorSoft: Color(0xFF3A1F23),
    text: Color(0xFFE2E8F0),
    mutedText: Color(0xFF94A3B8),
    border: Color(0xFF334155),
    quietSurface: Color(0xFF1E293B),
    level1Shadow: <BoxShadow>[],
    level2Shadow: <BoxShadow>[],
  );
}

@immutable
final class ELColorScheme {
  const ELColorScheme({
    required this.background,
    required this.surface,
    required this.surfaceElevated,
    required this.primary,
    required this.primaryDark,
    required this.primarySoft,
    required this.primarySoftHover,
    required this.primarySoftPressed,
    required this.primarySoftBorder,
    required this.success,
    required this.successSoft,
    required this.word,
    required this.wordSoft,
    required this.wordSoftBorder,
    required this.error,
    required this.errorSoft,
    required this.text,
    required this.mutedText,
    required this.border,
    required this.quietSurface,
    required this.level1Shadow,
    required this.level2Shadow,
  });

  final Color background;
  final Color surface;
  final Color surfaceElevated;
  final Color primary;
  final Color primaryDark;
  final Color primarySoft;
  final Color primarySoftHover;
  final Color primarySoftPressed;
  final Color primarySoftBorder;
  final Color success;
  final Color successSoft;
  final Color word;
  final Color wordSoft;
  final Color wordSoftBorder;
  final Color error;
  final Color errorSoft;
  final Color text;
  final Color mutedText;
  final Color border;
  final Color quietSurface;
  final List<BoxShadow> level1Shadow;
  final List<BoxShadow> level2Shadow;

  // Level 1 is the default card elevation. Kept for compatibility.
  List<BoxShadow> get shadow => level1Shadow;
}
