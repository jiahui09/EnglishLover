import 'package:flutter/widgets.dart';

/// EnglishLover design tokens.
///
/// Keep raw visual constants here so pages and feature widgets do not scatter
/// one-off colors, spacing, and radii.
abstract final class ELTokens {
  const ELTokens._();

  static const ink = Color(0xFF17211B);
  static const mutedInk = Color(0xFF5F6B62);
  static const paper = Color(0xFFF7F5EF);
  static const card = Color(0xFFFFFFFF);
  static const coachGreen = Color(0xFF2F6B4F);
  static const coachGreenDark = Color(0xFF214A37);
  static const coachGreenSoft = Color(0xFFE8F0EA);
  static const wordAmber = Color(0xFFC7832B);
  static const wordAmberSoft = Color(0xFFF7ECD9);
  static const softRed = Color(0xFFB85C50);
  static const softRedSoft = Color(0xFFF6E7E4);
  static const line = Color(0xFFE6E0D3);
  static const quietLine = Color(0xFFF0EADD);

  static const space4 = 4.0;
  static const space8 = 8.0;
  static const space12 = 12.0;
  static const space16 = 16.0;
  static const space20 = 20.0;
  static const space24 = 24.0;
  static const space32 = 32.0;
  static const space40 = 40.0;

  static const radius12 = Radius.circular(12);
  static const radius16 = Radius.circular(16);
  static const radius20 = Radius.circular(20);
  static const radius24 = Radius.circular(24);

  static const radius16All = BorderRadius.all(radius16);
  static const radius20All = BorderRadius.all(radius20);
  static const radius24All = BorderRadius.all(radius24);

  static const maxContentWidth = 1040.0;
  static const sideRailBreakpoint = 820.0;

  static const softShadow = <BoxShadow>[
    BoxShadow(color: Color(0x0F17211B), blurRadius: 24, offset: Offset(0, 12)),
  ];
}
