---
name: flutter-patterns
description: Flutter development patterns with Dart for cross-platform iOS and Android apps
triggers:
  - "flutter"
  - "dart"
  - "cross-platform"
---

# Flutter Development Patterns

Modern Flutter development patterns with Dart for building beautiful cross-platform applications.

## Widget Fundamentals

### StatelessWidget vs StatefulWidget

```dart
// ✅ StatelessWidget - immutable, no internal state
class ProfileCard extends StatelessWidget {
  final User user;
  final VoidCallback onTap;
  
  const ProfileCard({
    super.key,
    required this.user,
    required this.onTap,
  });
  
  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(backgroundImage: NetworkImage(user.avatarUrl)),
        title: Text(user.name),
        subtitle: Text(user.email),
        onTap: onTap,
      ),
    );
  }
}

// ✅ StatefulWidget - mutable internal state
class Counter extends StatefulWidget {
  const Counter({super.key});
  
  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;
  
  void _increment() => setState(() => _count++);
  
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: _increment,
      child: Text('Count: $_count'),
    );
  }
}
```

### Widget Composition

```dart
// ✅ Break down into smaller, reusable widgets
class MarketListScreen extends StatelessWidget {
  const MarketListScreen({super.key});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const MarketAppBar(),
      body: const MarketList(),
      floatingActionButton: const CreateMarketFab(),
    );
  }
}

class MarketAppBar extends StatelessWidget implements PreferredSizeWidget {
  const MarketAppBar({super.key});
  
  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: const Text('Markets'),
      actions: [
        IconButton(
          icon: const Icon(Icons.search),
          onPressed: () => _showSearch(context),
        ),
      ],
    );
  }
  
  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
  
  void _showSearch(BuildContext context) { /* ... */ }
}
```

## State Management

### Provider Pattern

```dart
// Model
class MarketState extends ChangeNotifier {
  List<Market> _markets = [];
  bool _isLoading = false;
  String? _error;
  
  List<Market> get markets => _markets;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  Future<void> loadMarkets() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _markets = await MarketService.fetchMarkets();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}

// Provider setup
void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => MarketState()),
        ChangeNotifierProvider(create: (_) => UserState()),
      ],
      child: const MyApp(),
    ),
  );
}

// Consumer widget
class MarketListView extends StatelessWidget {
  const MarketListView({super.key});
  
  @override
  Widget build(BuildContext context) {
    return Consumer<MarketState>(
      builder: (context, state, child) {
        if (state.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        
        if (state.error != null) {
          return ErrorWidget(message: state.error!);
        }
        
        return ListView.builder(
          itemCount: state.markets.length,
          itemBuilder: (context, index) => MarketTile(market: state.markets[index]),
        );
      },
    );
  }
}
```

### Riverpod (Recommended)

```dart
// Providers
final marketsProvider = FutureProvider<List<Market>>((ref) async {
  return ref.read(marketServiceProvider).fetchMarkets();
});

final selectedMarketProvider = StateProvider<Market?>((ref) => null);

final filteredMarketsProvider = Provider<List<Market>>((ref) {
  final markets = ref.watch(marketsProvider).value ?? [];
  final filter = ref.watch(marketFilterProvider);
  return markets.where((m) => m.status == filter).toList();
});

// Widget usage
class MarketListScreen extends ConsumerWidget {
  const MarketListScreen({super.key});
  
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final marketsAsync = ref.watch(marketsProvider);
    
    return marketsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stack) => ErrorWidget(error: error),
      data: (markets) => ListView.builder(
        itemCount: markets.length,
        itemBuilder: (context, index) => MarketTile(
          market: markets[index],
          onTap: () => ref.read(selectedMarketProvider.notifier).state = markets[index],
        ),
      ),
    );
  }
}
```

### BLoC Pattern

```dart
// Events
abstract class MarketEvent {}
class LoadMarkets extends MarketEvent {}
class RefreshMarkets extends MarketEvent {}

// States
abstract class MarketState {}
class MarketInitial extends MarketState {}
class MarketLoading extends MarketState {}
class MarketLoaded extends MarketState {
  final List<Market> markets;
  MarketLoaded(this.markets);
}
class MarketError extends MarketState {
  final String message;
  MarketError(this.message);
}

// BLoC
class MarketBloc extends Bloc<MarketEvent, MarketState> {
  final MarketRepository repository;
  
  MarketBloc(this.repository) : super(MarketInitial()) {
    on<LoadMarkets>(_onLoadMarkets);
    on<RefreshMarkets>(_onRefreshMarkets);
  }
  
  Future<void> _onLoadMarkets(LoadMarkets event, Emitter<MarketState> emit) async {
    emit(MarketLoading());
    try {
      final markets = await repository.getMarkets();
      emit(MarketLoaded(markets));
    } catch (e) {
      emit(MarketError(e.toString()));
    }
  }
}

// Widget
class MarketListScreen extends StatelessWidget {
  const MarketListScreen({super.key});
  
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<MarketBloc, MarketState>(
      builder: (context, state) {
        return switch (state) {
          MarketInitial() => const SizedBox(),
          MarketLoading() => const Center(child: CircularProgressIndicator()),
          MarketLoaded(markets: final m) => MarketList(markets: m),
          MarketError(message: final msg) => ErrorWidget(message: msg),
        };
      },
    );
  }
}
```

## Navigation

### GoRouter (Recommended)

```dart
final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
      routes: [
        GoRoute(
          path: 'market/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return MarketDetailScreen(marketId: id);
          },
        ),
      ],
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfileScreen(),
    ),
  ],
  errorBuilder: (context, state) => ErrorScreen(error: state.error),
);

// Usage
class MyApp extends StatelessWidget {
  const MyApp({super.key});
  
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: router,
    );
  }
}

// Navigate
context.go('/market/123');
context.push('/profile');
context.pop();
```

## Networking

### Dio HTTP Client

```dart
class ApiClient {
  final Dio _dio;
  
  ApiClient() : _dio = Dio(BaseOptions(
    baseUrl: 'https://api.example.com',
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    headers: {'Content-Type': 'application/json'},
  )) {
    _dio.interceptors.add(LogInterceptor());
    _dio.interceptors.add(AuthInterceptor());
  }
  
  Future<List<Market>> getMarkets() async {
    try {
      final response = await _dio.get('/markets');
      return (response.data as List)
          .map((json) => Market.fromJson(json))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  AppException _handleError(DioException e) {
    return switch (e.type) {
      DioExceptionType.connectionTimeout => NetworkException('Connection timeout'),
      DioExceptionType.receiveTimeout => NetworkException('Receive timeout'),
      DioExceptionType.badResponse => ApiException(
        e.response?.statusCode ?? 0,
        e.response?.data?['message'] ?? 'Unknown error',
      ),
      _ => NetworkException('Network error'),
    };
  }
}
```

## Data Persistence

### Hive (Local Database)

```dart
// Model with Hive adapter
@HiveType(typeId: 0)
class CachedMarket extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String name;
  
  @HiveField(2)
  final double volume;
  
  CachedMarket({
    required this.id,
    required this.name,
    required this.volume,
  });
}

// Repository
class LocalMarketRepository {
  static const _boxName = 'markets';
  
  Future<Box<CachedMarket>> get _box async =>
      Hive.openBox<CachedMarket>(_boxName);
  
  Future<List<CachedMarket>> getAll() async {
    final box = await _box;
    return box.values.toList();
  }
  
  Future<void> saveAll(List<CachedMarket> markets) async {
    final box = await _box;
    await box.clear();
    await box.addAll(markets);
  }
}
```

### Secure Storage

```dart
class SecureStorage {
  final FlutterSecureStorage _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock,
    ),
  );
  
  Future<void> saveToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }
  
  Future<String?> getToken() async {
    return _storage.read(key: 'auth_token');
  }
  
  Future<void> deleteToken() async {
    await _storage.delete(key: 'auth_token');
  }
}
```

## Animations

### Implicit Animations

```dart
class AnimatedCard extends StatefulWidget {
  const AnimatedCard({super.key});
  
  @override
  State<AnimatedCard> createState() => _AnimatedCardState();
}

class _AnimatedCardState extends State<AnimatedCard> {
  bool _isExpanded = false;
  
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => setState(() => _isExpanded = !_isExpanded),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        height: _isExpanded ? 200 : 100,
        decoration: BoxDecoration(
          color: _isExpanded ? Colors.blue : Colors.grey,
          borderRadius: BorderRadius.circular(_isExpanded ? 16 : 8),
        ),
        child: AnimatedOpacity(
          duration: const Duration(milliseconds: 200),
          opacity: _isExpanded ? 1.0 : 0.5,
          child: const Center(child: Text('Tap me')),
        ),
      ),
    );
  }
}
```

### Hero Animations

```dart
// Source screen
class MarketListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemBuilder: (context, index) {
        final market = markets[index];
        return GestureDetector(
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => MarketDetailScreen(market: market)),
          ),
          child: Hero(
            tag: 'market-${market.id}',
            child: MarketCard(market: market),
          ),
        );
      },
    );
  }
}

// Destination screen
class MarketDetailScreen extends StatelessWidget {
  final Market market;
  
  const MarketDetailScreen({super.key, required this.market});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Hero(
        tag: 'market-${market.id}',
        child: Material(
          child: MarketDetailView(market: market),
        ),
      ),
    );
  }
}
```

## Testing

### Unit Tests

```dart
void main() {
  group('MarketRepository', () {
    late MockApiClient mockClient;
    late MarketRepository repository;
    
    setUp(() {
      mockClient = MockApiClient();
      repository = MarketRepository(mockClient);
    });
    
    test('getMarkets returns list on success', () async {
      when(() => mockClient.getMarkets())
          .thenAnswer((_) async => [Market.mock()]);
      
      final result = await repository.getMarkets();
      
      expect(result, isA<List<Market>>());
      expect(result.length, 1);
    });
    
    test('getMarkets throws on error', () async {
      when(() => mockClient.getMarkets())
          .thenThrow(NetworkException('No connection'));
      
      expect(
        () => repository.getMarkets(),
        throwsA(isA<NetworkException>()),
      );
    });
  });
}
```

### Widget Tests

```dart
void main() {
  testWidgets('MarketCard displays market info', (tester) async {
    final market = Market(id: '1', name: 'Test Market', volume: 1000);
    
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: MarketCard(market: market),
        ),
      ),
    );
    
    expect(find.text('Test Market'), findsOneWidget);
    expect(find.text('\$1,000'), findsOneWidget);
  });
  
  testWidgets('MarketCard onTap callback', (tester) async {
    var tapped = false;
    
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: MarketCard(
            market: Market.mock(),
            onTap: () => tapped = true,
          ),
        ),
      ),
    );
    
    await tester.tap(find.byType(MarketCard));
    expect(tapped, isTrue);
  });
}
```

## Platform-Specific Code

```dart
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class PlatformUtils {
  static bool get isIOS => !kIsWeb && Platform.isIOS;
  static bool get isAndroid => !kIsWeb && Platform.isAndroid;
  static bool get isWeb => kIsWeb;
  static bool get isMobile => isIOS || isAndroid;
  
  static Widget adaptiveButton({
    required String label,
    required VoidCallback onPressed,
  }) {
    if (isIOS) {
      return CupertinoButton(
        onPressed: onPressed,
        child: Text(label),
      );
    }
    return ElevatedButton(
      onPressed: onPressed,
      child: Text(label),
    );
  }
}
```

## Related Agents
- `mobile-developer`
- `mobile-developer-high`

## Related Skills
- `ios-patterns` - Native iOS patterns for comparison
- `android-patterns` - Native Android patterns for comparison
