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
