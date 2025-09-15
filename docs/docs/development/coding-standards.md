# Coding Standards Guide

## Table of Contents
1. [Overview](#overview)
2. [Dart Language Standards](#dart-language-standards)
3. [Flutter Widget Standards](#flutter-widget-standards)
4. [BLoC Pattern Standards](#bloc-pattern-standards)
5. [Documentation Standards](#documentation-standards)
6. [Error Handling Standards](#error-handling-standards)
7. [Testing Standards](#testing-standards)
8. [Performance Guidelines](#performance-guidelines)
9. [Security Standards](#security-standards)
10. [Code Review Checklist](#code-review-checklist)

---

## Overview

This document establishes coding standards for Prodigy Pro v2.0 to ensure code consistency, maintainability, and quality across the entire team. These standards should be followed by all developers working on the project.

### Principles
- **Consistency**: Code should look like it was written by a single person
- **Readability**: Code should be self-documenting and easy to understand
- **Maintainability**: Code should be easy to modify and extend
- **Performance**: Code should be efficient and optimized
- **Testability**: Code should be easily testable

---

## Dart Language Standards

### 1. Code Formatting

Follow the official Dart style guide and use `dart format`:

```dart
// Good: Proper formatting
class UserRepository {
  final ApiClient _apiClient;
  final DatabaseHelper _databaseHelper;

  UserRepository({
    required ApiClient apiClient,
    required DatabaseHelper databaseHelper,
  })  : _apiClient = apiClient,
        _databaseHelper = databaseHelper;

  Future<User> getUser(String id) async {
    try {
      final userData = await _apiClient.getUser(id);
      return User.fromJson(userData);
    } catch (e) {
      throw UserNotFoundException('User with id $id not found');
    }
  }
}

// Bad: Poor formatting
class UserRepository{
final ApiClient _apiClient;final DatabaseHelper _databaseHelper;
UserRepository({required ApiClient apiClient,required DatabaseHelper databaseHelper,}):_apiClient=apiClient,_databaseHelper=databaseHelper;
Future<User>getUser(String id)async{try{final userData=await _apiClient.getUser(id);return User.fromJson(userData);}catch(e){throw UserNotFoundException('User with id $id not found');}}
}
```

### 2. Naming Conventions

#### Class Names
```dart
// Good: PascalCase
class AuthenticationBloc {}
class UserRepository {}
class CalculatorResult {}

// Bad
class authenticationBloc {}
class user_repository {}
class calculatorresult {}
```

#### Variable and Method Names
```dart
// Good: camelCase
String phoneNumber = '+1234567890';
bool isLoading = false;
List<Fund> availableFunds = [];

Future<void> calculateSipResult() async {}
void updateMonthlyAmount(double amount) {}

// Bad
String phone_number = '+1234567890';
bool IsLoading = false;
List<Fund> available_funds = [];

Future<void> CalculateSipResult() async {}
void Update_Monthly_Amount(double amount) {}
```

#### Constants
```dart
// Good: SCREAMING_SNAKE_CASE for compile-time constants
static const String API_BASE_URL = 'https://api.prodigypro.com';
static const int MAX_RETRY_ATTEMPTS = 3;
static const Duration REQUEST_TIMEOUT = Duration(seconds: 30);

// Good: camelCase for runtime constants
final String databasePath = await getDatabasesPath();
final DateTime currentDate = DateTime.now();
```

#### Private Members
```dart
// Good: Prefix with underscore
class AuthBloc {
  final AuthRepository _authRepository;
  StreamSubscription<User>? _userSubscription;

  void _handleAuthStateChange() {}
  Future<void> _saveUserData(User user) async {}
}
```

### 3. Variable Declarations

```dart
// Good: Use final for immutable variables
final String userName = 'John Doe';
final List<String> items = ['item1', 'item2'];

// Good: Use var when type is obvious
var response = await apiClient.getUser();
var currentIndex = 0;

// Good: Use explicit types when clarity is needed
Map<String, dynamic> requestData = {};
Future<ApiResponse<User>> userResponse = apiClient.getUser();

// Bad: Unnecessary explicit typing when obvious
String userName = 'John Doe';
int currentIndex = 0;
```

### 4. Function Declarations

```dart
// Good: Clear function signatures
Future<User> authenticateUser({
  required String phoneNumber,
  required String otp,
}) async {
  // Implementation
}

// Good: Use positional parameters for required single parameters
void updateAmount(double amount) {
  // Implementation
}

// Good: Use named parameters for multiple parameters
void calculateSip({
  required double monthlyAmount,
  required int period,
  required double rateOfReturn,
}) {
  // Implementation
}

// Bad: Mixed positional and named without clear reason
void calculateSip(double monthlyAmount, {required int period, required double rateOfReturn}) {
  // Implementation
}
```

### 5. String Handling

```dart
// Good: Use string interpolation
String message = 'Welcome, $userName!';
String amount = 'Amount: ${formatCurrency(totalAmount)}';

// Good: Use raw strings for complex strings
String regexPattern = r'^[+]?[0-9]{10,14}$';

// Good: Use multiline strings for long text
String description = '''
This is a long description that spans
multiple lines and provides detailed
information about the feature.
''';

// Bad: String concatenation
String message = 'Welcome, ' + userName + '!';
String amount = 'Amount: ' + formatCurrency(totalAmount);
```

---

## Flutter Widget Standards

### 1. Widget Structure

```dart
// Good: Proper widget structure
class CalculatorScreen extends StatelessWidget {
  static const String routeName = '/calculator';

  final CalculatorType type;
  final String? title;

  const CalculatorScreen({
    Key? key,
    required this.type,
    this.title,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(context),
      body: _buildBody(context),
      floatingActionButton: _buildFloatingActionButton(context),
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context) {
    return AppBar(
      title: Text(title ?? 'Calculator'),
    );
  }

  Widget _buildBody(BuildContext context) {
    return BlocBuilder<CalculatorBloc, CalculatorState>(
      builder: (context, state) {
        return _buildContent(context, state);
      },
    );
  }

  Widget _buildContent(BuildContext context, CalculatorState state) {
    if (state is CalculatorLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state is CalculatorError) {
      return ErrorWidget(message: state.message);
    }

    return const CalculatorForm();
  }

  Widget? _buildFloatingActionButton(BuildContext context) {
    return FloatingActionButton(
      onPressed: () => _handleCalculate(context),
      child: const Icon(Icons.calculate),
    );
  }

  void _handleCalculate(BuildContext context) {
    context.read<CalculatorBloc>().add(const CalculateRequested());
  }
}
```

### 2. Widget Composition

```dart
// Good: Extract widgets for reusability
class UserProfileCard extends StatelessWidget {
  final User user;
  final VoidCallback? onEdit;

  const UserProfileCard({
    Key? key,
    required this.user,
    this.onEdit,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(),
            const SizedBox(height: 12),
            _buildUserInfo(),
            if (onEdit != null) ...[
              const SizedBox(height: 16),
              _buildEditButton(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        CircleAvatar(
          backgroundImage: NetworkImage(user.profilePictureUrl),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            user.name,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildUserInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Email: ${user.email}'),
        Text('Phone: ${user.phoneNumber}'),
        Text('Member since: ${formatDate(user.createdAt)}'),
      ],
    );
  }

  Widget _buildEditButton() {
    return ElevatedButton.icon(
      onPressed: onEdit,
      icon: const Icon(Icons.edit),
      label: const Text('Edit Profile'),
    );
  }
}
```

### 3. State Management

```dart
// Good: Proper state management with BLoC
class AuthScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => AuthBloc(
        authRepository: context.read<AuthRepository>(),
      ),
      child: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthSuccess) {
            Navigator.pushReplacementNamed(context, '/dashboard');
          } else if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          }
        },
        child: BlocBuilder<AuthBloc, AuthState>(
          builder: (context, state) {
            return Scaffold(
              body: _buildBody(context, state),
            );
          },
        ),
      ),
    );
  }

  Widget _buildBody(BuildContext context, AuthState state) {
    if (state is AuthLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return const AuthForm();
  }
}
```

---

## BLoC Pattern Standards

### 1. Event Design

```dart
// Good: Descriptive event names with proper data
abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class LoginRequested extends AuthEvent {
  final String phoneNumber;
  final String password;

  const LoginRequested({
    required this.phoneNumber,
    required this.password,
  });

  @override
  List<Object> get props => [phoneNumber, password];
}

class OTPVerificationRequested extends AuthEvent {
  final String otp;

  const OTPVerificationRequested({required this.otp});

  @override
  List<Object> get props => [otp];
}

class LogoutRequested extends AuthEvent {}
```

### 2. State Design

```dart
// Good: Clear state hierarchy with immutable data
abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class OTPRequired extends AuthState {
  final String phoneNumber;

  const OTPRequired({required this.phoneNumber});

  @override
  List<Object> get props => [phoneNumber];
}

class AuthSuccess extends AuthState {
  final User user;

  const AuthSuccess({required this.user});

  @override
  List<Object> get props => [user];
}

class AuthError extends AuthState {
  final String message;
  final String? errorCode;

  const AuthError({
    required this.message,
    this.errorCode,
  });

  @override
  List<Object?> get props => [message, errorCode];
}
```

### 3. BLoC Implementation

```dart
// Good: Clean BLoC implementation
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;

  AuthBloc({required AuthRepository authRepository})
      : _authRepository = authRepository,
        super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<OTPVerificationRequested>(_onOTPVerificationRequested);
    on<LogoutRequested>(_onLogoutRequested);
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(AuthLoading());

      final result = await _authRepository.login(
        phoneNumber: event.phoneNumber,
        password: event.password,
      );

      if (result.requiresOTP) {
        emit(OTPRequired(phoneNumber: event.phoneNumber));
      } else {
        emit(AuthSuccess(user: result.user));
      }
    } on AuthException catch (e) {
      emit(AuthError(
        message: e.message,
        errorCode: e.code,
      ));
    } catch (e) {
      emit(const AuthError(
        message: 'An unexpected error occurred. Please try again.',
      ));
    }
  }

  Future<void> _onOTPVerificationRequested(
    OTPVerificationRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(AuthLoading());

      final user = await _authRepository.verifyOTP(
        otp: event.otp,
      );

      emit(AuthSuccess(user: user));
    } on OTPException catch (e) {
      emit(AuthError(
        message: e.message,
        errorCode: e.code,
      ));
    } catch (e) {
      emit(const AuthError(
        message: 'OTP verification failed. Please try again.',
      ));
    }
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      await _authRepository.logout();
      emit(AuthInitial());
    } catch (e) {
      // Handle logout error if needed
      emit(AuthInitial()); // Still logout on error
    }
  }
}
```

---

## Documentation Standards

### 1. Class Documentation

```dart
/// Repository for managing user authentication operations.
///
/// This repository provides methods for user login, logout, OTP verification,
/// and session management. It handles both remote API calls and local storage
/// for offline support.
///
/// Example usage:
/// ```dart
/// final authRepo = AuthRepository();
/// final user = await authRepo.login(
///   phoneNumber: '+1234567890',
///   password: 'password123',
/// );
/// ```
class AuthRepository {
  /// Creates an [AuthRepository] with required dependencies.
  ///
  /// The [apiClient] is used for remote authentication operations,
  /// while [localStorage] handles offline data and caching.
  AuthRepository({
    required ApiClient apiClient,
    required LocalStorage localStorage,
  })  : _apiClient = apiClient,
        _localStorage = localStorage;

  /// Authenticates a user with phone number and password.
  ///
  /// Returns a [User] object on successful authentication.
  /// Throws [AuthException] if authentication fails.
  /// Throws [NetworkException] if network is unavailable.
  ///
  /// The [phoneNumber] must be in international format (e.g., +1234567890).
  /// The [password] must meet the minimum security requirements.
  Future<User> login({
    required String phoneNumber,
    required String password,
  }) async {
    // Implementation
  }
}
```

### 2. Method Documentation

```dart
/// Calculates the future value of a SIP investment.
///
/// This method computes the maturity amount for a Systematic Investment Plan
/// based on monthly contribution, investment period, and expected returns.
///
/// Parameters:
/// * [monthlyAmount] - Monthly investment amount (₹500 - ₹1,00,000)
/// * [period] - Investment period in years (1 - 30 years)
/// * [rateOfReturn] - Expected annual rate of return (1% - 50%)
///
/// Returns a [SipCalculatorResult] containing:
/// * Future value of the investment
/// * Total amount invested
/// * Total returns earned
/// * Year-wise breakdown
///
/// Throws [ValidationException] if any parameter is out of valid range.
///
/// Example:
/// ```dart
/// final result = await calculator.calculateSIP(
///   monthlyAmount: 5000.0,
///   period: 10,
///   rateOfReturn: 12.0,
/// );
/// print('Future Value: ₹${result.futureValue}');
/// ```
Future<SipCalculatorResult> calculateSIP({
  required double monthlyAmount,
  required int period,
  required double rateOfReturn,
}) async {
  // Implementation
}
```

### 3. TODO and FIXME Comments

```dart
class PortfolioRepository {
  Future<Portfolio> getPortfolio(String userId) async {
    // TODO(username): Implement caching mechanism for offline support
    // Expected completion: Sprint 12

    // FIXME: Handle the case when user has no investments
    // This currently throws an exception instead of returning empty portfolio
    // Bug ID: #PRO-456

    // HACK: Temporary workaround for API inconsistency
    // Remove this when backend fixes the response format in v2.1
    if (response.data['portfolio'] == null) {
      response.data['portfolio'] = [];
    }

    // Implementation
  }
}
```

---

## Error Handling Standards

### 1. Exception Hierarchy

```dart
// Good: Well-defined exception hierarchy
abstract class AppException implements Exception {
  final String message;
  final String? code;
  final dynamic originalError;

  const AppException({
    required this.message,
    this.code,
    this.originalError,
  });

  @override
  String toString() => 'AppException: $message${code != null ? ' (Code: $code)' : ''}';
}

class NetworkException extends AppException {
  final int? statusCode;

  const NetworkException({
    required String message,
    String? code,
    this.statusCode,
    dynamic originalError,
  }) : super(
          message: message,
          code: code,
          originalError: originalError,
        );
}

class ValidationException extends AppException {
  final Map<String, String>? fieldErrors;

  const ValidationException({
    required String message,
    String? code,
    this.fieldErrors,
    dynamic originalError,
  }) : super(
          message: message,
          code: code,
          originalError: originalError,
        );
}
```

### 2. Error Handling Patterns

```dart
// Good: Comprehensive error handling
Future<User> getUser(String id) async {
  try {
    // Validate input
    if (id.isEmpty) {
      throw ValidationException(
        message: 'User ID cannot be empty',
        code: 'INVALID_USER_ID',
      );
    }

    // Make API call
    final response = await _apiClient.get('/users/$id');

    // Handle API response
    if (response.statusCode == 200) {
      return User.fromJson(response.data);
    } else if (response.statusCode == 404) {
      throw UserNotFoundException(
        message: 'User with ID $id not found',
        code: 'USER_NOT_FOUND',
      );
    } else {
      throw ServerException(
        message: 'Failed to fetch user data',
        code: 'SERVER_ERROR',
        statusCode: response.statusCode,
      );
    }
  } on DioException catch (e) {
    // Handle network errors
    throw NetworkException(
      message: _getNetworkErrorMessage(e),
      code: 'NETWORK_ERROR',
      statusCode: e.response?.statusCode,
      originalError: e,
    );
  } catch (e) {
    // Handle unexpected errors
    if (e is AppException) rethrow;

    throw ServerException(
      message: 'An unexpected error occurred',
      code: 'UNEXPECTED_ERROR',
      originalError: e,
    );
  }
}

String _getNetworkErrorMessage(DioException e) {
  switch (e.type) {
    case DioExceptionType.connectionTimeout:
      return 'Connection timeout. Please check your internet connection.';
    case DioExceptionType.receiveTimeout:
      return 'Server response timeout. Please try again.';
    case DioExceptionType.connectionError:
      return 'No internet connection. Please check your network.';
    default:
      return 'Network error occurred. Please try again.';
  }
}
```

---

## Testing Standards

### 1. Unit Test Structure

```dart
// Good: Well-structured unit tests
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';

@GenerateMocks([AuthRepository])
import 'auth_bloc_test.mocks.dart';

void main() {
  group('AuthBloc', () {
    late AuthBloc authBloc;
    late MockAuthRepository mockAuthRepository;

    setUp(() {
      mockAuthRepository = MockAuthRepository();
      authBloc = AuthBloc(authRepository: mockAuthRepository);
    });

    tearDown(() {
      authBloc.close();
    });

    group('LoginRequested', () {
      const phoneNumber = '+1234567890';
      const password = 'password123';
      final user = User(id: '1', name: 'Test User', phoneNumber: phoneNumber);

      blocTest<AuthBloc, AuthState>(
        'emits [AuthLoading, AuthSuccess] when login succeeds',
        build: () {
          when(mockAuthRepository.login(
            phoneNumber: anyNamed('phoneNumber'),
            password: anyNamed('password'),
          )).thenAnswer((_) async => LoginResult(user: user));
          return authBloc;
        },
        act: (bloc) => bloc.add(LoginRequested(
          phoneNumber: phoneNumber,
          password: password,
        )),
        expect: () => [
          AuthLoading(),
          AuthSuccess(user: user),
        ],
        verify: (_) {
          verify(mockAuthRepository.login(
            phoneNumber: phoneNumber,
            password: password,
          )).called(1);
        },
      );

      blocTest<AuthBloc, AuthState>(
        'emits [AuthLoading, AuthError] when login fails',
        build: () {
          when(mockAuthRepository.login(
            phoneNumber: anyNamed('phoneNumber'),
            password: anyNamed('password'),
          )).thenThrow(AuthException(
            message: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS',
          ));
          return authBloc;
        },
        act: (bloc) => bloc.add(LoginRequested(
          phoneNumber: phoneNumber,
          password: password,
        )),
        expect: () => [
          AuthLoading(),
          AuthError(
            message: 'Invalid credentials',
            errorCode: 'INVALID_CREDENTIALS',
          ),
        ],
      );
    });
  });
}
```

### 2. Widget Test Standards

```dart
// Good: Comprehensive widget tests
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mocktail/mocktail.dart';

class MockAuthBloc extends MockBloc<AuthEvent, AuthState> implements AuthBloc {}

void main() {
  group('AuthScreen', () {
    late MockAuthBloc mockAuthBloc;

    setUp(() {
      mockAuthBloc = MockAuthBloc();
    });

    Widget createWidgetUnderTest() {
      return MaterialApp(
        home: BlocProvider<AuthBloc>.value(
          value: mockAuthBloc,
          child: AuthScreen(),
        ),
      );
    }

    testWidgets(
      'displays loading indicator when state is AuthLoading',
      (tester) async {
        // Arrange
        when(() => mockAuthBloc.state).thenReturn(AuthLoading());

        // Act
        await tester.pumpWidget(createWidgetUnderTest());

        // Assert
        expect(find.byType(CircularProgressIndicator), findsOneWidget);
      },
    );

    testWidgets(
      'displays login form when state is AuthInitial',
      (tester) async {
        // Arrange
        when(() => mockAuthBloc.state).thenReturn(AuthInitial());

        // Act
        await tester.pumpWidget(createWidgetUnderTest());

        // Assert
        expect(find.byType(TextField), findsNWidgets(2)); // Phone and password fields
        expect(find.text('Login'), findsOneWidget);
      },
    );

    testWidgets(
      'triggers login event when login button is pressed',
      (tester) async {
        // Arrange
        when(() => mockAuthBloc.state).thenReturn(AuthInitial());

        await tester.pumpWidget(createWidgetUnderTest());

        // Act
        await tester.enterText(find.byKey(Key('phoneField')), '+1234567890');
        await tester.enterText(find.byKey(Key('passwordField')), 'password123');
        await tester.tap(find.text('Login'));

        // Assert
        verify(() => mockAuthBloc.add(LoginRequested(
          phoneNumber: '+1234567890',
          password: 'password123',
        ))).called(1);
      },
    );
  });
}
```

---

## Performance Guidelines

### 1. Widget Optimization

```dart
// Good: Performance-optimized widgets
class OptimizedListItem extends StatelessWidget {
  final Fund fund;
  final VoidCallback? onTap;

  const OptimizedListItem({
    Key? key,
    required this.fund,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      child: ListTile(
        leading: const _FundIcon(), // Const widget
        title: Text(fund.name),
        subtitle: Text(fund.category),
        trailing: _buildTrailing(),
        onTap: onTap,
      ),
    );
  }

  Widget _buildTrailing() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(
          formatCurrency(fund.currentPrice),
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        Text(
          '${fund.changePercentage.toStringAsFixed(2)}%',
          style: TextStyle(
            color: fund.changePercentage >= 0 ? Colors.green : Colors.red,
          ),
        ),
      ],
    );
  }
}

// Const widget for better performance
class _FundIcon extends StatelessWidget {
  const _FundIcon();

  @override
  Widget build(BuildContext context) {
    return const CircleAvatar(
      child: Icon(Icons.account_balance),
    );
  }
}
```

### 2. List Performance

```dart
// Good: Efficient list building
class FundListView extends StatelessWidget {
  final List<Fund> funds;
  final void Function(Fund) onFundTap;

  const FundListView({
    Key? key,
    required this.funds,
    required this.onFundTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: funds.length,
      itemBuilder: (context, index) {
        final fund = funds[index];
        return OptimizedListItem(
          key: ValueKey(fund.id), // Proper key for efficient updates
          fund: fund,
          onTap: () => onFundTap(fund),
        );
      },
    );
  }
}
```

---

## Security Standards

### 1. Data Sanitization

```dart
// Good: Input validation and sanitization
class UserValidator {
  static String? validatePhoneNumber(String? phoneNumber) {
    if (phoneNumber == null || phoneNumber.isEmpty) {
      return 'Phone number is required';
    }

    // Remove all non-digit characters
    final sanitized = phoneNumber.replaceAll(RegExp(r'[^\d+]'), '');

    // Validate format
    if (!RegExp(r'^\+?[1-9]\d{9,14}$').hasMatch(sanitized)) {
      return 'Please enter a valid phone number';
    }

    return null;
  }

  static String? validateAmount(String? amount) {
    if (amount == null || amount.isEmpty) {
      return 'Amount is required';
    }

    final numericValue = double.tryParse(amount);
    if (numericValue == null) {
      return 'Please enter a valid amount';
    }

    if (numericValue < 500) {
      return 'Minimum amount is ₹500';
    }

    if (numericValue > 1000000) {
      return 'Maximum amount is ₹10,00,000';
    }

    return null;
  }
}
```

### 2. Secure Storage

```dart
// Good: Secure sensitive data handling
class SecureStorageHelper {
  static const _tokenKey = 'auth_token';
  static const _pinKey = 'user_pin';

  static Future<void> storeAuthToken(String token) async {
    await FlutterSecureStorage().write(
      key: _tokenKey,
      value: token,
    );
  }

  static Future<String?> getAuthToken() async {
    return await FlutterSecureStorage().read(key: _tokenKey);
  }

  static Future<void> clearAuthToken() async {
    await FlutterSecureStorage().delete(key: _tokenKey);
  }

  // Never store sensitive data in SharedPreferences
  static Future<void> storeUserPin(String pin) async {
    // Hash the PIN before storing
    final hashedPin = await _hashPin(pin);
    await FlutterSecureStorage().write(
      key: _pinKey,
      value: hashedPin,
    );
  }

  static Future<String> _hashPin(String pin) async {
    // Implementation for secure pin hashing
    return pin; // Placeholder
  }
}
```

---

## Code Review Checklist

### Before Submitting PR
- [ ] Code follows naming conventions
- [ ] All methods have proper documentation
- [ ] Error handling is implemented
- [ ] Unit tests are written and passing
- [ ] Widget tests cover UI behavior
- [ ] Performance considerations are addressed
- [ ] Security validations are in place
- [ ] Code is properly formatted (`dart format`)
- [ ] No lint warnings (`dart analyze`)

### Code Review Guidelines
- [ ] Architecture follows clean architecture principles
- [ ] BLoC pattern is correctly implemented
- [ ] Repository pattern is used for data access
- [ ] Proper separation of concerns
- [ ] No business logic in UI layer
- [ ] Consistent error handling
- [ ] Adequate test coverage
- [ ] No hardcoded strings or values
- [ ] Proper asset management
- [ ] Accessibility considerations

### Performance Review
- [ ] No unnecessary widget rebuilds
- [ ] Efficient list implementations
- [ ] Proper use of const constructors
- [ ] Image optimization
- [ ] Network request optimization
- [ ] Memory leak prevention

### Security Review
- [ ] Input validation implemented
- [ ] Sensitive data encrypted
- [ ] No sensitive data in logs
- [ ] Proper authentication checks
- [ ] API security measures

---

*These coding standards ensure high-quality, maintainable, and secure code across the Prodigy Pro v2.0 project. All team members should follow these guidelines consistently.*
