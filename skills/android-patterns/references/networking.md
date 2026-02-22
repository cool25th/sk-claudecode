## Networking

### Retrofit + Kotlin Coroutines

```kotlin
interface MarketApi {
    @GET("markets")
    suspend fun getMarkets(): List<MarketDto>
    
    @GET("markets/{id}")
    suspend fun getMarket(@Path("id") id: String): MarketDto
    
    @POST("orders")
    suspend fun createOrder(@Body order: CreateOrderRequest): OrderDto
}

// Repository with error handling
class MarketRepositoryImpl @Inject constructor(
    private val api: MarketApi,
    private val dispatcher: CoroutineDispatcher = Dispatchers.IO
) : MarketRepository {
    
    override suspend fun getMarkets(): Result<List<Market>> = withContext(dispatcher) {
        runCatching {
            api.getMarkets().map { it.toDomain() }
        }
    }
}

// Hilt module
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.API_BASE_URL)
        .addConverterFactory(kotlinx.serialization.json.Json.asConverterFactory("application/json".toMediaType()))
        .client(
            OkHttpClient.Builder()
                .addInterceptor(HttpLoggingInterceptor().apply {
                    level = HttpLoggingInterceptor.Level.BODY
                })
                .build()
        )
        .build()
    
    @Provides
    @Singleton
    fun provideMarketApi(retrofit: Retrofit): MarketApi =
        retrofit.create(MarketApi::class.java)
}
```
