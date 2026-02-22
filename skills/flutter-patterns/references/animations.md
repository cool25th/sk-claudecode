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
