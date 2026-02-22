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
