# Feature Development Workflow

## Table of Contents
1. [Overview](#overview)
2. [Feature Planning](#feature-planning)
3. [Architecture Setup](#architecture-setup)
4. [Implementation Workflow](#implementation-workflow)
5. [Testing Workflow](#testing-workflow)
6. [Code Review Process](#code-review-process)
7. [Example: Complete Feature Implementation](#example-complete-feature-implementation)
8. [Common Patterns](#common-patterns)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides a step-by-step workflow for implementing new features in Prodigy Pro v2.0. Following this process ensures consistency, quality, and maintainability across all features.

### Development Principles
- **Clean Architecture**: Maintain clear separation between layers
- **Test-Driven Development**: Write tests before or alongside implementation
- **Incremental Development**: Build features incrementally with regular testing
- **Documentation First**: Document interfaces before implementation
- **Code Review**: All code must be reviewed before merging

---

## Feature Planning

### 1. Feature Analysis

Before starting development, analyze the feature requirements:

```markdown
## Feature: Goal Planning for Retirement

### User Story
As a user, I want to set and track my retirement savings goals so that I can plan my financial future effectively.

### Acceptance Criteria
- [ ] User can create a new retirement goal
- [ ] User can specify target amount and timeline
- [ ] System calculates required monthly savings
- [ ] User can view progress towards goal
- [ ] User can edit or delete existing goals

### Technical Requirements
- [ ] API integration for goal management
- [ ] Local storage for offline access
- [ ] Real-time calculations
- [ ] Data validation and error handling
- [ ] Performance optimization for calculations

### Dependencies
- [ ] User authentication (existing)
- [ ] Calculator engine (existing)
- [ ] Portfolio data (existing)
```

### 2. Architecture Planning

Define the architecture components needed:

```markdown
## Architecture Components

### Domain Layer
- [ ] Goal entity
- [ ] GoalRepository interface
- [ ] CalculateGoalProgress use case
- [ ] CreateGoal use case

### Data Layer
- [ ] GoalModel (API response/request)
- [ ] GoalRemoteDataSource
- [ ] GoalLocalDataSource
- [ ] GoalRepositoryImpl

### Presentation Layer
- [ ] GoalPlanningBloc
- [ ] GoalPlanningEvents
- [ ] GoalPlanningStates
- [ ] Goal creation screen
- [ ] Goal list screen
- [ ] Goal details screen
```

---

## Architecture Setup

### Step 1: Domain Layer Implementation

Start with the core business logic:

#### 1.1 Create Domain Entity

```dart
// domain/entities/goal.dart
class Goal {
  final String id;
  final String userId;
  final String name;
  final GoalType type;
  final double targetAmount;
  final DateTime targetDate;
  final double currentAmount;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Goal({
    required this.id,
    required this.userId,
    required this.name,
    required this.type,
    required this.targetAmount,
    required this.targetDate,
    required this.currentAmount,
    required this.createdAt,
    required this.updatedAt,
  });

  // Business logic methods
  double get progressPercentage {
    if (targetAmount <= 0) return 0.0;
    return (currentAmount / targetAmount).clamp(0.0, 1.0) * 100;
  }

  double get remainingAmount => (targetAmount - currentAmount).clamp(0.0, double.infinity);

  Duration get timeRemaining => targetDate.difference(DateTime.now());

  double get requiredMonthlySavings {
    final monthsRemaining = timeRemaining.inDays / 30;
    if (monthsRemaining <= 0) return remainingAmount;
    return remainingAmount / monthsRemaining;
  }

  bool get isCompleted => currentAmount >= targetAmount;

  Goal copyWith({
    String? id,
    String? userId,
    String? name,
    GoalType? type,
    double? targetAmount,
    DateTime? targetDate,
    double? currentAmount,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Goal(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      type: type ?? this.type,
      targetAmount: targetAmount ?? this.targetAmount,
      targetDate: targetDate ?? this.targetDate,
      currentAmount: currentAmount ?? this.currentAmount,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

enum GoalType {
  retirement,
  education,
  house,
  vacation,
  emergency,
  other,
}
```

#### 1.2 Create Repository Interface

```dart
// domain/repositories/goal_repository.dart
abstract class GoalRepository {
  Future<List<Goal>> getUserGoals(String userId);

  Future<Goal> getGoalById(String goalId);

  Future<Goal> createGoal(Goal goal);

  Future<Goal> updateGoal(Goal goal);

  Future<void> deleteGoal(String goalId);

  Future<void> updateGoalProgress(String goalId, double currentAmount);

  Stream<List<Goal>> watchUserGoals(String userId);
}
```

#### 1.3 Create Use Cases

```dart
// domain/usecases/create_goal.dart
class CreateGoal {
  final GoalRepository _goalRepository;

  CreateGoal(this._goalRepository);

  Future<Goal> call(CreateGoalParams params) async {
    // Validate goal data
    _validateGoalData(params);

    final goal = Goal(
      id: '', // Will be set by the backend
      userId: params.userId,
      name: params.name,
      type: params.type,
      targetAmount: params.targetAmount,
      targetDate: params.targetDate,
      currentAmount: 0.0,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );

    return await _goalRepository.createGoal(goal);
  }

  void _validateGoalData(CreateGoalParams params) {
    if (params.name.trim().isEmpty) {
      throw ValidationException(message: 'Goal name cannot be empty');
    }

    if (params.targetAmount <= 0) {
      throw ValidationException(message: 'Target amount must be greater than 0');
    }

    if (params.targetDate.isBefore(DateTime.now())) {
      throw ValidationException(message: 'Target date cannot be in the past');
    }
  }
}

class CreateGoalParams {
  final String userId;
  final String name;
  final GoalType type;
  final double targetAmount;
  final DateTime targetDate;

  CreateGoalParams({
    required this.userId,
    required this.name,
    required this.type,
    required this.targetAmount,
    required this.targetDate,
  });
}
```

### Step 2: Data Layer Implementation

#### 2.1 Create Data Models

```dart
// data/models/goal_model.dart
class GoalModel {
  final String id;
  final String userId;
  final String name;
  final String type;
  final double targetAmount;
  final String targetDate;
  final double currentAmount;
  final String createdAt;
  final String updatedAt;

  GoalModel({
    required this.id,
    required this.userId,
    required this.name,
    required this.type,
    required this.targetAmount,
    required this.targetDate,
    required this.currentAmount,
    required this.createdAt,
    required this.updatedAt,
  });

  factory GoalModel.fromJson(Map<String, dynamic> json) {
    return GoalModel(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] ?? '',
      targetAmount: (json['target_amount'] ?? 0).toDouble(),
      targetDate: json['target_date'] ?? '',
      currentAmount: (json['current_amount'] ?? 0).toDouble(),
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'name': name,
      'type': type,
      'target_amount': targetAmount,
      'target_date': targetDate,
      'current_amount': currentAmount,
      'created_at': createdAt,
      'updated_at': updatedAt,
    };
  }

  Goal toDomain() {
    return Goal(
      id: id,
      userId: userId,
      name: name,
      type: _parseGoalType(type),
      targetAmount: targetAmount,
      targetDate: DateTime.parse(targetDate),
      currentAmount: currentAmount,
      createdAt: DateTime.parse(createdAt),
      updatedAt: DateTime.parse(updatedAt),
    );
  }

  static GoalModel fromDomain(Goal goal) {
    return GoalModel(
      id: goal.id,
      userId: goal.userId,
      name: goal.name,
      type: goal.type.name,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate.toIso8601String(),
      currentAmount: goal.currentAmount,
      createdAt: goal.createdAt.toIso8601String(),
      updatedAt: goal.updatedAt.toIso8601String(),
    );
  }

  GoalType _parseGoalType(String type) {
    return GoalType.values.firstWhere(
      (e) => e.name == type,
      orElse: () => GoalType.other,
    );
  }
}
```

#### 2.2 Create Data Sources

```dart
// data/datasources/goal_remote_data_source.dart
abstract class GoalRemoteDataSource {
  Future<List<GoalModel>> getUserGoals(String userId);
  Future<GoalModel> getGoalById(String goalId);
  Future<GoalModel> createGoal(GoalModel goal);
  Future<GoalModel> updateGoal(GoalModel goal);
  Future<void> deleteGoal(String goalId);
  Future<void> updateGoalProgress(String goalId, double currentAmount);
}

class GoalRemoteDataSourceImpl implements GoalRemoteDataSource {
  final Dio _dio;

  GoalRemoteDataSourceImpl(this._dio);

  @override
  Future<List<GoalModel>> getUserGoals(String userId) async {
    try {
      final response = await _dio.get('/api/v1/goals', queryParameters: {
        'user_id': userId,
      });

      if (response.statusCode == 200) {
        final List<dynamic> goalsJson = response.data['data'] ?? [];
        return goalsJson.map((json) => GoalModel.fromJson(json)).toList();
      } else {
        throw ServerException(
          message: 'Failed to fetch goals',
          statusCode: response.statusCode ?? 500,
        );
      }
    } on DioException catch (e) {
      throw NetworkException(
        message: _getNetworkErrorMessage(e),
        statusCode: e.response?.statusCode,
      );
    }
  }

  @override
  Future<GoalModel> createGoal(GoalModel goal) async {
    try {
      final response = await _dio.post('/api/v1/goals', data: goal.toJson());

      if (response.statusCode == 201) {
        return GoalModel.fromJson(response.data['data']);
      } else {
        throw ServerException(
          message: response.data['message'] ?? 'Failed to create goal',
          statusCode: response.statusCode ?? 500,
        );
      }
    } on DioException catch (e) {
      throw NetworkException(
        message: _getNetworkErrorMessage(e),
        statusCode: e.response?.statusCode,
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

  // Implement other methods...
}
```

#### 2.3 Create Repository Implementation

```dart
// data/repositories/goal_repository_impl.dart
class GoalRepositoryImpl implements GoalRepository {
  final GoalRemoteDataSource _remoteDataSource;
  final GoalLocalDataSource _localDataSource;
  final NetworkInfo _networkInfo;

  final StreamController<List<Goal>> _goalsController = StreamController.broadcast();

  GoalRepositoryImpl({
    required GoalRemoteDataSource remoteDataSource,
    required GoalLocalDataSource localDataSource,
    required NetworkInfo networkInfo,
  })  : _remoteDataSource = remoteDataSource,
        _localDataSource = localDataSource,
        _networkInfo = networkInfo;

  @override
  Future<List<Goal>> getUserGoals(String userId) async {
    try {
      if (await _networkInfo.isConnected) {
        // Fetch from remote and cache locally
        final remoteGoals = await _remoteDataSource.getUserGoals(userId);
        await _localDataSource.cacheGoals(remoteGoals);

        final goals = remoteGoals.map((model) => model.toDomain()).toList();
        _goalsController.add(goals);
        return goals;
      } else {
        // Fetch from local cache
        final cachedGoals = await _localDataSource.getCachedGoals(userId);
        final goals = cachedGoals.map((model) => model.toDomain()).toList();
        return goals;
      }
    } catch (e) {
      // Fallback to local cache on error
      final cachedGoals = await _localDataSource.getCachedGoals(userId);
      final goals = cachedGoals.map((model) => model.toDomain()).toList();

      if (goals.isEmpty && e is! NetworkException) {
        rethrow;
      }

      return goals;
    }
  }

  @override
  Future<Goal> createGoal(Goal goal) async {
    if (await _networkInfo.isConnected) {
      try {
        final goalModel = GoalModel.fromDomain(goal);
        final createdGoal = await _remoteDataSource.createGoal(goalModel);

        // Cache the new goal
        await _localDataSource.cacheGoal(createdGoal);

        // Update the stream
        final updatedGoals = await getUserGoals(goal.userId);
        _goalsController.add(updatedGoals);

        return createdGoal.toDomain();
      } catch (e) {
        throw GoalCreationException('Failed to create goal: ${e.toString()}');
      }
    } else {
      throw NetworkException(message: 'No internet connection available');
    }
  }

  @override
  Stream<List<Goal>> watchUserGoals(String userId) {
    // Initial data load
    getUserGoals(userId);

    return _goalsController.stream;
  }

  @override
  void dispose() {
    _goalsController.close();
  }

  // Implement other methods...
}
```

### Step 3: Presentation Layer Implementation

#### 3.1 Create BLoC Events

```dart
// presentation/goal_planning/bloc/goal_planning_event.dart
abstract class GoalPlanningEvent extends Equatable {
  const GoalPlanningEvent();

  @override
  List<Object?> get props => [];
}

class LoadUserGoals extends GoalPlanningEvent {
  final String userId;

  const LoadUserGoals({required this.userId});

  @override
  List<Object> get props => [userId];
}

class CreateGoalRequested extends GoalPlanningEvent {
  final String name;
  final GoalType type;
  final double targetAmount;
  final DateTime targetDate;

  const CreateGoalRequested({
    required this.name,
    required this.type,
    required this.targetAmount,
    required this.targetDate,
  });

  @override
  List<Object> get props => [name, type, targetAmount, targetDate];
}

class UpdateGoalRequested extends GoalPlanningEvent {
  final Goal goal;

  const UpdateGoalRequested({required this.goal});

  @override
  List<Object> get props => [goal];
}

class DeleteGoalRequested extends GoalPlanningEvent {
  final String goalId;

  const DeleteGoalRequested({required this.goalId});

  @override
  List<Object> get props => [goalId];
}

class RefreshGoals extends GoalPlanningEvent {}
```

#### 3.2 Create BLoC States

```dart
// presentation/goal_planning/bloc/goal_planning_state.dart
abstract class GoalPlanningState extends Equatable {
  const GoalPlanningState();

  @override
  List<Object?> get props => [];
}

class GoalPlanningInitial extends GoalPlanningState {}

class GoalPlanningLoading extends GoalPlanningState {}

class GoalsLoaded extends GoalPlanningState {
  final List<Goal> goals;

  const GoalsLoaded({required this.goals});

  @override
  List<Object> get props => [goals];
}

class GoalCreated extends GoalPlanningState {
  final Goal goal;

  const GoalCreated({required this.goal});

  @override
  List<Object> get props => [goal];
}

class GoalUpdated extends GoalPlanningState {
  final Goal goal;

  const GoalUpdated({required this.goal});

  @override
  List<Object> get props => [goal];
}

class GoalDeleted extends GoalPlanningState {
  final String goalId;

  const GoalDeleted({required this.goalId});

  @override
  List<Object> get props => [goalId];
}

class GoalPlanningError extends GoalPlanningState {
  final String message;
  final String? errorCode;

  const GoalPlanningError({
    required this.message,
    this.errorCode,
  });

  @override
  List<Object?> get props => [message, errorCode];
}
```

#### 3.3 Create BLoC Implementation

```dart
// presentation/goal_planning/bloc/goal_planning_bloc.dart
class GoalPlanningBloc extends Bloc<GoalPlanningEvent, GoalPlanningState> {
  final GoalRepository _goalRepository;
  final CreateGoal _createGoal;
  final String _userId;

  GoalPlanningBloc({
    required GoalRepository goalRepository,
    required CreateGoal createGoal,
    required String userId,
  })  : _goalRepository = goalRepository,
        _createGoal = createGoal,
        _userId = userId,
        super(GoalPlanningInitial()) {
    on<LoadUserGoals>(_onLoadUserGoals);
    on<CreateGoalRequested>(_onCreateGoalRequested);
    on<UpdateGoalRequested>(_onUpdateGoalRequested);
    on<DeleteGoalRequested>(_onDeleteGoalRequested);
    on<RefreshGoals>(_onRefreshGoals);
  }

  Future<void> _onLoadUserGoals(
    LoadUserGoals event,
    Emitter<GoalPlanningState> emit,
  ) async {
    try {
      emit(GoalPlanningLoading());

      final goals = await _goalRepository.getUserGoals(event.userId);

      emit(GoalsLoaded(goals: goals));
    } on NetworkException catch (e) {
      emit(GoalPlanningError(
        message: e.message,
        errorCode: e.code,
      ));
    } catch (e) {
      emit(const GoalPlanningError(
        message: 'Failed to load goals. Please try again.',
      ));
    }
  }

  Future<void> _onCreateGoalRequested(
    CreateGoalRequested event,
    Emitter<GoalPlanningState> emit,
  ) async {
    try {
      emit(GoalPlanningLoading());

      final goal = await _createGoal(CreateGoalParams(
        userId: _userId,
        name: event.name,
        type: event.type,
        targetAmount: event.targetAmount,
        targetDate: event.targetDate,
      ));

      emit(GoalCreated(goal: goal));

      // Reload goals to get updated list
      add(LoadUserGoals(userId: _userId));
    } on ValidationException catch (e) {
      emit(GoalPlanningError(
        message: e.message,
        errorCode: e.code,
      ));
    } on NetworkException catch (e) {
      emit(GoalPlanningError(
        message: e.message,
        errorCode: e.code,
      ));
    } catch (e) {
      emit(const GoalPlanningError(
        message: 'Failed to create goal. Please try again.',
      ));
    }
  }

  Future<void> _onRefreshGoals(
    RefreshGoals event,
    Emitter<GoalPlanningState> emit,
  ) async {
    add(LoadUserGoals(userId: _userId));
  }

  // Implement other event handlers...
}
```

---

## Implementation Workflow

### Step 1: Set up Feature Structure

```bash
# Create feature directory structure
mkdir -p lib/presentation/goal_planning/{bloc,view,widgets,models}
mkdir -p lib/data/{repositories,datasources,models}/goal
mkdir -p lib/domain/{entities,repositories,usecases}/goal
```

### Step 2: Implement Domain Layer First

1. **Create entity** with business logic
2. **Define repository interface**
3. **Implement use cases** for business operations
4. **Write unit tests** for domain logic

### Step 3: Implement Data Layer

1. **Create data models** for API/database
2. **Implement data sources** (remote and local)
3. **Implement repository** following interface
4. **Write unit tests** for data layer

### Step 4: Implement Presentation Layer

1. **Define events and states** for BLoC
2. **Implement BLoC** with business logic
3. **Create UI screens** and widgets
4. **Write widget tests** for UI components

### Step 5: Integration and Testing

1. **Set up dependency injection**
2. **Write integration tests**
3. **Test end-to-end flows**
4. **Performance testing**

---

## Testing Workflow

### Unit Tests First

```dart
// test/domain/usecases/create_goal_test.dart
void main() {
  group('CreateGoal', () {
    late CreateGoal createGoal;
    late MockGoalRepository mockRepository;

    setUp(() {
      mockRepository = MockGoalRepository();
      createGoal = CreateGoal(mockRepository);
    });

    test('should create goal successfully with valid data', () async {
      // Arrange
      final params = CreateGoalParams(
        userId: 'user123',
        name: 'Retirement Fund',
        type: GoalType.retirement,
        targetAmount: 1000000.0,
        targetDate: DateTime.now().add(Duration(days: 365 * 20)),
      );

      final expectedGoal = Goal(
        id: 'goal123',
        userId: params.userId,
        name: params.name,
        type: params.type,
        targetAmount: params.targetAmount,
        targetDate: params.targetDate,
        currentAmount: 0.0,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      when(mockRepository.createGoal(any)).thenAnswer((_) async => expectedGoal);

      // Act
      final result = await createGoal(params);

      // Assert
      expect(result, equals(expectedGoal));
      verify(mockRepository.createGoal(any)).called(1);
    });

    test('should throw ValidationException for empty goal name', () async {
      // Arrange
      final params = CreateGoalParams(
        userId: 'user123',
        name: '',
        type: GoalType.retirement,
        targetAmount: 1000000.0,
        targetDate: DateTime.now().add(Duration(days: 365 * 20)),
      );

      // Act & Assert
      expect(
        () => createGoal(params),
        throwsA(isA<ValidationException>()),
      );
    });
  });
}
```

### BLoC Tests

```dart
// test/presentation/goal_planning/bloc/goal_planning_bloc_test.dart
void main() {
  group('GoalPlanningBloc', () {
    late GoalPlanningBloc bloc;
    late MockGoalRepository mockRepository;
    late MockCreateGoal mockCreateGoal;

    setUp(() {
      mockRepository = MockGoalRepository();
      mockCreateGoal = MockCreateGoal();
      bloc = GoalPlanningBloc(
        goalRepository: mockRepository,
        createGoal: mockCreateGoal,
        userId: 'user123',
      );
    });

    tearDown(() {
      bloc.close();
    });

    blocTest<GoalPlanningBloc, GoalPlanningState>(
      'emits [GoalPlanningLoading, GoalsLoaded] when LoadUserGoals succeeds',
      build: () {
        when(mockRepository.getUserGoals(any))
            .thenAnswer((_) async => [mockGoal]);
        return bloc;
      },
      act: (bloc) => bloc.add(LoadUserGoals(userId: 'user123')),
      expect: () => [
        GoalPlanningLoading(),
        GoalsLoaded(goals: [mockGoal]),
      ],
    );
  });
}
```

---

## Code Review Process

### Pre-Review Checklist

- [ ] All tests passing
- [ ] Code follows architecture patterns
- [ ] Documentation updated
- [ ] Error handling implemented
- [ ] Performance considerations addressed

### Review Areas

1. **Architecture Compliance**
   - Clean architecture principles
   - Proper layer separation
   - Dependency inversion

2. **Code Quality**
   - Naming conventions
   - Code organization
   - Error handling

3. **Testing**
   - Test coverage
   - Test quality
   - Edge cases covered

4. **Performance**
   - Efficient algorithms
   - Memory usage
   - Network optimization

---

## Example: Complete Feature Implementation

Here's a complete example showing the goal planning feature implementation:

### Directory Structure
```
lib/
├── domain/
│   ├── entities/
│   │   └── goal.dart
│   ├── repositories/
│   │   └── goal_repository.dart
│   └── usecases/
│       ├── create_goal.dart
│       ├── get_user_goals.dart
│       └── update_goal.dart
├── data/
│   ├── models/
│   │   └── goal_model.dart
│   ├── datasources/
│   │   ├── goal_remote_data_source.dart
│   │   └── goal_local_data_source.dart
│   └── repositories/
│       └── goal_repository_impl.dart
└── presentation/
    └── goal_planning/
        ├── bloc/
        │   ├── goal_planning_bloc.dart
        │   ├── goal_planning_event.dart
        │   └── goal_planning_state.dart
        ├── view/
        │   ├── goal_planning_screen.dart
        │   ├── create_goal_screen.dart
        │   └── goal_details_screen.dart
        └── widgets/
            ├── goal_card.dart
            ├── goal_progress_indicator.dart
            └── goal_form.dart
```

### Screen Implementation

```dart
// presentation/goal_planning/view/goal_planning_screen.dart
class GoalPlanningScreen extends StatelessWidget {
  static const String routeName = '/goal-planning';

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => GoalPlanningBloc(
        goalRepository: context.read<GoalRepository>(),
        createGoal: context.read<CreateGoal>(),
        userId: context.read<AuthBloc>().state.user?.id ?? '',
      )..add(LoadUserGoals(
          userId: context.read<AuthBloc>().state.user?.id ?? '',
        )),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Goal Planning'),
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: () {
                context.read<GoalPlanningBloc>().add(RefreshGoals());
              },
            ),
          ],
        ),
        body: BlocBuilder<GoalPlanningBloc, GoalPlanningState>(
          builder: (context, state) {
            if (state is GoalPlanningLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            if (state is GoalPlanningError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 64,
                      color: Colors.red,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      state.message,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        context.read<GoalPlanningBloc>().add(RefreshGoals());
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }

            if (state is GoalsLoaded) {
              if (state.goals.isEmpty) {
                return _buildEmptyState(context);
              }

              return _buildGoalsList(context, state.goals);
            }

            return const SizedBox.shrink();
          },
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            Navigator.pushNamed(context, CreateGoalScreen.routeName);
          },
          child: const Icon(Icons.add),
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.track_changes,
            size: 64,
            color: Colors.grey,
          ),
          const SizedBox(height: 16),
          const Text(
            'No goals yet',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Create your first financial goal to get started',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, color: Colors.grey),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pushNamed(context, CreateGoalScreen.routeName);
            },
            icon: const Icon(Icons.add),
            label: const Text('Create Goal'),
          ),
        ],
      ),
    );
  }

  Widget _buildGoalsList(BuildContext context, List<Goal> goals) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: goals.length,
      itemBuilder: (context, index) {
        final goal = goals[index];
        return GoalCard(
          goal: goal,
          onTap: () {
            Navigator.pushNamed(
              context,
              GoalDetailsScreen.routeName,
              arguments: goal,
            );
          },
        );
      },
    );
  }
}
```

---

## Common Patterns

### 1. Loading States Pattern

```dart
// Common pattern for handling loading states
BlocBuilder<FeatureBloc, FeatureState>(
  builder: (context, state) {
    if (state is FeatureLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state is FeatureError) {
      return ErrorWidget(
        message: state.message,
        onRetry: () => context.read<FeatureBloc>().add(RetryRequested()),
      );
    }

    if (state is FeatureLoaded) {
      return FeatureContent(data: state.data);
    }

    return const SizedBox.shrink();
  },
)
```

### 2. Form Validation Pattern

```dart
class FormBloc extends Bloc<FormEvent, FormState> {
  Future<void> _onFormSubmitted(
    FormSubmitted event,
    Emitter<FormState> emit,
  ) async {
    // Validate form data
    final validationErrors = _validateForm(event.formData);
    if (validationErrors.isNotEmpty) {
      emit(FormValidationError(errors: validationErrors));
      return;
    }

    try {
      emit(FormSubmitting());

      // Submit form
      await _repository.submitForm(event.formData);

      emit(FormSubmissionSuccess());
    } catch (e) {
      emit(FormSubmissionError(message: e.toString()));
    }
  }

  Map<String, String> _validateForm(FormData data) {
    final errors = <String, String>{};

    if (data.name.trim().isEmpty) {
      errors['name'] = 'Name is required';
    }

    if (data.email.isEmpty || !_isValidEmail(data.email)) {
      errors['email'] = 'Valid email is required';
    }

    return errors;
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. BLoC Not Updating UI

**Problem**: UI doesn't update when BLoC emits new state.

**Solution**:
- Ensure state classes implement `Equatable` properly
- Check that `props` getter includes all relevant fields
- Verify BLoC is properly provided to widget tree

#### 2. Repository Tests Failing

**Problem**: Repository tests fail due to dependency issues.

**Solution**:
- Mock all dependencies properly
- Use `setUp` and `tearDown` for test isolation
- Verify mock configurations match actual usage

#### 3. State Management Issues

**Problem**: Complex state not handled properly.

**Solution**:
- Break down complex states into smaller, focused states
- Use proper state hierarchy
- Implement proper error handling

---

*This workflow ensures consistent, high-quality feature development across the Prodigy Pro v2.0 project. Follow this process for all new features to maintain code quality and architectural integrity.*
