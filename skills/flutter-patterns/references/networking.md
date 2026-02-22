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
