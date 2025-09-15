# Project Structure Guide

## Table of Contents
1. [Overview](#overview)
2. [Root Directory Structure](#root-directory-structure)
3. [Library Structure (lib/)](#library-structure-lib)
4. [Feature Organization](#feature-organization)
5. [Naming Conventions](#naming-conventions)
6. [File Organization Guidelines](#file-organization-guidelines)
7. [Import Organization](#import-organization)
8. [Asset Organization](#asset-organization)

---

## Overview

Prodigy Pro v2.0 follows a **feature-based clean architecture** structure that promotes separation of concerns, scalability, and maintainability. The project is organized into clear layers with well-defined responsibilities.

### Architecture Principles
- **Feature-First**: Organization by business features rather than technical layers
- **Layer Separation**: Clear boundaries between presentation, domain, and data layers
- **Dependency Inversion**: Dependencies flow inward toward the domain layer
- **Single Responsibility**: Each file/folder has a single, well-defined purpose

---

## Root Directory Structure

```
flutter_prodigypro/
├── android/                    # Android-specific configuration
├── ios/                        # iOS-specific configuration
├── lib/                        # Main Dart code
├── test/                       # Unit and widget tests
├── integration_test/           # Integration tests
├── assets/                     # Static assets
│   ├── fonts/                  # Custom fonts
│   ├── images/                 # Images and icons
│   └── logo/                   # App logos
├── docs/                       # Project documentation
├── .github/                    # GitHub workflows and templates
├── pubspec.yaml               # Package dependencies
├── README.md                  # Project overview
└── analysis_options.yaml     # Dart analyzer configuration
```

---

## Library Structure (lib/)

### High-Level Structure

```
lib/
├── presentation/              # UI Layer - Screens, Widgets, BLoCs
├── data/                     # Data Layer - Repositories, Data Sources, Models
├── domain/                   # Business Logic - Entities, Use Cases, Interfaces
├── core/                     # Shared Components
├── injection/                # Dependency Injection Setup
├── routes/                   # Navigation and Routing
└── main.dart                 # Application Entry Point
```

### Detailed Structure

```
lib/
├── presentation/                           # 📱 UI Layer
│   ├── auth_phone_input_screen/           # Feature: Phone Authentication
│   │   ├── auth_phone_input_screen.dart   # Main screen widget
│   │   ├── bloc/                          # State management
│   │   │   ├── auth_phone_input_bloc.dart
│   │   │   ├── auth_phone_input_event.dart
│   │   │   └── auth_phone_input_state.dart
│   │   ├── widgets/                       # Feature-specific widgets
│   │   │   ├── phone_input_field.dart
│   │   │   └── country_code_picker.dart
│   │   └── models/                        # UI-specific models
│   │       └── phone_input_ui_model.dart
│   │
│   ├── financial_calculators/             # Feature: Calculators
│   │   ├── sip_calculator/
│   │   │   ├── view/
│   │   │   │   └── sip_calculator_screen.dart
│   │   │   ├── bloc/
│   │   │   │   ├── sip_calculator_bloc.dart
│   │   │   │   ├── sip_calculator_event.dart
│   │   │   │   └── sip_calculator_state.dart
│   │   │   └── widgets/
│   │   │       ├── amount_input_widget.dart
│   │   │       ├── period_selector_widget.dart
│   │   │       └── result_chart_widget.dart
│   │   │
│   │   ├── retirement_calculator/
│   │   ├── education_calculator/
│   │   └── calculator_widgets/            # Shared calculator widgets
│   │       ├── input_slider_widget.dart
│   │       └── calculation_result_card.dart
│   │
│   ├── portfolio_screen/                  # Feature: Portfolio Management
│   │   ├── portfolio_screen.dart
│   │   ├── bloc/
│   │   ├── widgets/
│   │   └── models/
│   │
│   └── shared/                            # Shared UI components
│       ├── widgets/                       # Reusable widgets
│       │   ├── buttons/
│       │   ├── inputs/
│       │   ├── cards/
│       │   └── indicators/
│       └── dialogs/                       # Common dialogs
│
├── data/                                  # 💾 Data Layer
│   ├── repositories/                      # Repository implementations
│   │   ├── auth_repository_impl.dart
│   │   ├── portfolio_repository_impl.dart
│   │   └── calculator_repository_impl.dart
│   │
│   ├── datasources/                       # Data source implementations
│   │   ├── remote/                        # API data sources
│   │   │   ├── auth_remote_data_source.dart
│   │   │   ├── portfolio_remote_data_source.dart
│   │   │   └── calculator_remote_data_source.dart
│   │   └── local/                         # Local storage data sources
│   │       ├── auth_local_data_source.dart
│   │       ├── portfolio_local_data_source.dart
│   │       └── database/
│   │           ├── app_database.dart
│   │           └── dao/
│   │
│   └── models/                            # Data transfer objects
│       ├── auth/
│       │   ├── login_request_model.dart
│       │   ├── login_response_model.dart
│       │   └── user_model.dart
│       ├── portfolio/
│       └── calculator/
│
├── domain/                                # 🧠 Business Logic Layer
│   ├── entities/                          # Business entities
│   │   ├── user.dart
│   │   ├── portfolio.dart
│   │   ├── fund.dart
│   │   └── calculator_result.dart
│   │
│   ├── repositories/                      # Repository interfaces
│   │   ├── auth_repository.dart
│   │   ├── portfolio_repository.dart
│   │   └── calculator_repository.dart
│   │
│   └── usecases/                          # Business use cases
│       ├── auth/
│       │   ├── login_with_phone.dart
│       │   ├── verify_otp.dart
│       │   └── logout.dart
│       ├── portfolio/
│       │   ├── get_portfolio_summary.dart
│       │   └── refresh_portfolio.dart
│       └── calculator/
│           ├── calculate_sip.dart
│           └── calculate_retirement_corpus.dart
│
├── core/                                  # 🔧 Shared Components
│   ├── constants/                         # App-wide constants
│   │   ├── app_constants.dart
│   │   ├── api_endpoints.dart
│   │   └── storage_keys.dart
│   │
│   ├── network/                           # Network configuration
│   │   ├── dio_client.dart
│   │   ├── network_info.dart
│   │   └── api_interceptors.dart
│   │
│   ├── theme/                             # Design system
│   │   ├── app_theme.dart
│   │   ├── app_colors.dart
│   │   ├── app_text_styles.dart
│   │   ├── app_spacing.dart
│   │   └── app_dimensions.dart
│   │
│   ├── utils/                             # Utility functions
│   │   ├── validators.dart
│   │   ├── formatters.dart
│   │   ├── date_utils.dart
│   │   └── string_extensions.dart
│   │
│   ├── error/                             # Error handling
│   │   ├── exceptions.dart
│   │   ├── failures.dart
│   │   └── error_handler.dart
│   │
│   └── widgets/                           # Core shared widgets
│       ├── loading_widget.dart
│       ├── error_widget.dart
│       └── empty_state_widget.dart
│
├── injection/                             # 🔌 Dependency Injection
│   ├── injection.dart                     # Main DI setup
│   ├── injection.config.dart              # Generated DI config
│   └── modules/                           # DI modules
│       ├── network_module.dart
│       ├── database_module.dart
│       └── repository_module.dart
│
├── routes/                                # 🧭 Navigation
│   ├── app_router.dart                    # Main router configuration
│   ├── route_names.dart                   # Route name constants
│   └── route_guards.dart                  # Navigation guards
│
└── main.dart                              # 🚀 App Entry Point
```

---

## Feature Organization

### Feature Structure Template

Each feature follows this consistent structure:

```
presentation/feature_name/
├── feature_screen.dart              # Main screen(s)
├── bloc/                            # State management
│   ├── feature_bloc.dart
│   ├── feature_event.dart
│   └── feature_state.dart
├── widgets/                         # Feature-specific widgets
│   ├── feature_widget_1.dart
│   └── feature_widget_2.dart
├── models/                          # UI models (if needed)
│   └── feature_ui_model.dart
└── enums/                          # Feature-specific enums
    └── feature_enums.dart
```

### Feature Examples

#### Authentication Feature
```
presentation/auth_phone_input_screen/
├── auth_phone_input_screen.dart     # Main authentication screen
├── bloc/
│   ├── auth_phone_input_bloc.dart   # Authentication BLoC
│   ├── auth_phone_input_event.dart  # Authentication events
│   └── auth_phone_input_state.dart  # Authentication states
├── widgets/
│   ├── phone_input_field.dart       # Phone number input widget
│   ├── country_code_picker.dart     # Country code selection
│   └── otp_timer_widget.dart        # OTP countdown timer
└── models/
    └── phone_validation_model.dart  # Phone validation UI model
```

#### Calculator Feature
```
presentation/financial_calculators/sip_calculator/
├── view/
│   └── sip_calculator_screen.dart   # SIP calculator screen
├── bloc/
│   ├── sip_calculator_bloc.dart     # Calculator BLoC
│   ├── sip_calculator_event.dart    # Calculator events
│   └── sip_calculator_state.dart    # Calculator states
├── widgets/
│   ├── amount_input_widget.dart     # Monthly amount input
│   ├── period_selector_widget.dart  # Investment period selector
│   ├── rate_slider_widget.dart      # Rate of return slider
│   └── result_chart_widget.dart     # Results visualization
└── enums/
    └── calculator_input_type.dart   # Input type enumerations
```

---

## Naming Conventions

### File Naming
- **Screens**: `feature_name_screen.dart`
- **BLoCs**: `feature_name_bloc.dart`
- **Events**: `feature_name_event.dart`
- **States**: `feature_name_state.dart`
- **Widgets**: `descriptive_name_widget.dart`
- **Models**: `entity_name_model.dart`
- **Repositories**: `feature_name_repository.dart`
- **Data Sources**: `feature_name_data_source.dart`

### Class Naming
- **Screens**: `FeatureNameScreen`
- **BLoCs**: `FeatureNameBloc`
- **Events**: `FeatureNameEvent` (abstract), `SpecificActionName` (concrete)
- **States**: `FeatureNameState` (abstract), `FeatureNameLoading` (concrete)
- **Widgets**: `DescriptiveNameWidget`
- **Models**: `EntityNameModel`
- **Repositories**: `FeatureNameRepository` (interface), `FeatureNameRepositoryImpl` (implementation)

### Variable Naming
```dart
// Good examples
final UserRepository userRepository;
final AuthBloc authBloc;
final String phoneNumber;
final bool isLoading;
final List<Fund> availableFunds;

// Bad examples
final repo;
final controller;
final str;
final flag;
final list;
```

### Method Naming
```dart
// Good examples
Future<void> loginWithPhoneNumber(String phoneNumber);
void updateMonthlyAmount(double amount);
bool isValidPhoneNumber(String phone);
String formatCurrency(double amount);

// Bad examples
Future<void> doLogin(String phone);
void update(double amt);
bool check(String p);
String format(double a);
```

---

## File Organization Guidelines

### Import Organization

```dart
// 1. Dart core imports
import 'dart:async';
import 'dart:convert';

// 2. Flutter framework imports
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

// 3. Third-party package imports (alphabetical)
import 'package:dio/dio.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

// 4. Internal imports (alphabetical)
import 'package:prodigy_pro/core/constants/app_constants.dart';
import 'package:prodigy_pro/core/network/dio_client.dart';
import 'package:prodigy_pro/domain/entities/user.dart';
import 'package:prodigy_pro/presentation/auth/bloc/auth_bloc.dart';

// 5. Relative imports last
import '../widgets/phone_input_field.dart';
import 'auth_phone_input_event.dart';
import 'auth_phone_input_state.dart';
```

### Class Structure Organization

```dart
class ExampleWidget extends StatelessWidget {
  // 1. Constants
  static const String routeName = '/example';
  static const double _defaultPadding = 16.0;

  // 2. Final fields (constructor parameters)
  final String title;
  final VoidCallback? onPressed;

  // 3. Constructor
  const ExampleWidget({
    Key? key,
    required this.title,
    this.onPressed,
  }) : super(key: key);

  // 4. Override methods
  @override
  Widget build(BuildContext context) {
    return _buildContent();
  }

  // 5. Private helper methods
  Widget _buildContent() {
    return Container();
  }

  void _handlePress() {
    onPressed?.call();
  }

  // 6. Static methods
  static void staticMethod() {}
}
```

---

## Asset Organization

### Asset Directory Structure

```
assets/
├── fonts/                          # Custom fonts
│   ├── Roboto/
│   │   ├── Roboto-Regular.ttf
│   │   ├── Roboto-Medium.ttf
│   │   └── Roboto-Bold.ttf
│   └── OpenSans/
│
├── images/                         # Image assets
│   ├── icons/                      # App icons
│   │   ├── app_icon.png
│   │   └── notification_icon.png
│   ├── onboarding/                 # Onboarding images
│   │   ├── welcome_1.png
│   │   ├── welcome_2.png
│   │   └── welcome_3.png
│   ├── calculator/                 # Calculator-specific images
│   └── portfolio/                  # Portfolio-specific images
│
└── logo/                           # App logos
    ├── app_logo.png
    ├── app_logo_white.png
    └── splash_logo.png
```

### Asset Naming Conventions

- **Icons**: `icon_name.png` (e.g., `icon_home.png`, `icon_profile.png`)
- **Images**: `descriptive_name.png` (e.g., `welcome_screen_1.png`)
- **Logos**: `logo_variant.png` (e.g., `logo_primary.png`, `logo_white.png`)

### Asset Reference Organization

```dart
// core/constants/app_assets.dart
class AppAssets {
  // Icons
  static const String iconHome = 'assets/images/icons/icon_home.png';
  static const String iconProfile = 'assets/images/icons/icon_profile.png';

  // Images
  static const String welcomeImage1 = 'assets/images/onboarding/welcome_1.png';
  static const String welcomeImage2 = 'assets/images/onboarding/welcome_2.png';

  // Logos
  static const String appLogo = 'assets/logo/app_logo.png';
  static const String appLogoWhite = 'assets/logo/app_logo_white.png';
}
```

---

## Best Practices

### Folder Creation Guidelines

1. **Feature-First**: Create folders by business feature, not technical layer
2. **Consistent Structure**: Follow the same structure for all features
3. **Single Responsibility**: Each folder should have a clear, single purpose
4. **Logical Grouping**: Group related files together

### File Size Guidelines

- **Screens**: Maximum 300 lines (split into multiple widgets if larger)
- **BLoCs**: Maximum 500 lines (consider splitting events/states if larger)
- **Widgets**: Maximum 200 lines (extract sub-widgets if larger)
- **Models**: Maximum 150 lines (split into multiple models if larger)

### Dependency Guidelines

- **Presentation** can depend on **Domain**
- **Data** can depend on **Domain**
- **Domain** should not depend on **Presentation** or **Data**
- **Core** can be used by all layers

### Code Organization Checklist

- [ ] Files are in the correct layer (presentation/data/domain)
- [ ] Naming conventions are followed consistently
- [ ] Imports are organized properly
- [ ] Classes have single responsibility
- [ ] Related files are grouped logically
- [ ] Dependencies flow in the correct direction

---

*This project structure guide ensures consistency, maintainability, and scalability across the Prodigy Pro v2.0 codebase. All new features and modifications should follow these organizational principles.*
