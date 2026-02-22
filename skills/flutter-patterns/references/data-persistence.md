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
