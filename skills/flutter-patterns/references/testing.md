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
