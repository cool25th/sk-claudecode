---
name: android-patterns
description: Android development patterns with Kotlin, Jetpack Compose, and modern Android frameworks
triggers:
  - "android"
  - "kotlin"
  - "compose"
  - "jetpack"
  - "gradle"
---

# Android Development Patterns

Modern Android development patterns with Kotlin and Jetpack Compose for building polished Android applications.

## Jetpack Compose Fundamentals

### Composable Functions

```kotlin
// ✅ Composable with proper state hoisting
@Composable
fun ProfileCard(
    user: User,
    onFollowClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            ProfileHeader(user = user)
            Spacer(modifier = Modifier.height(12.dp))
            ProfileStats(stats = user.stats)
            Spacer(modifier = Modifier.height(12.dp))
            FollowButton(
                isFollowing = user.isFollowing,
                onClick = onFollowClick
            )
        }
    }
}

// ✅ Reusable Components
@Composable
fun IconBadge(
    imageVector: ImageVector,
    count: Int,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Icon(
            imageVector = imageVector,
            contentDescription = null,
            modifier = Modifier.size(16.dp)
        )
        Text(
            text = count.toString(),
            style = MaterialTheme.typography.labelSmall
        )
    }
}
```

### State Management

```kotlin
@Composable
fun CounterScreen() {
    // Local state
    var count by remember { mutableIntStateOf(0) }
    
    // Derived state
    val isEven by remember { derivedStateOf { count % 2 == 0 } }
    
    // Remembered with key
    val expensiveCalculation = remember(count) {
        performExpensiveCalculation(count)
    }
    
    Column {
        Text("Count: $count (${if (isEven) "even" else "odd"})")
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}

// State hoisting pattern
@Composable
fun StatefulCounter() {
    var count by rememberSaveable { mutableIntStateOf(0) }
    StatelessCounter(
        count = count,
        onIncrement = { count++ }
    )
}

@Composable
fun StatelessCounter(
    count: Int,
    onIncrement: () -> Unit
) {
    Button(onClick = onIncrement) {
        Text("Count: $count")
    }
}
```

### MVVM with ViewModel

```kotlin
@HiltViewModel
class MarketListViewModel @Inject constructor(
    private val marketRepository: MarketRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(MarketListUiState())
    val uiState: StateFlow<MarketListUiState> = _uiState.asStateFlow()
    
    init {
        loadMarkets()
    }
    
    fun loadMarkets() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            marketRepository.getMarkets()
                .onSuccess { markets ->
                    _uiState.update { it.copy(markets = markets, isLoading = false) }
                }
                .onFailure { error ->
                    _uiState.update { it.copy(error = error.message, isLoading = false) }
                }
        }
    }
}

data class MarketListUiState(
    val markets: List<Market> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

// Usage in Composable
@Composable
fun MarketListScreen(
    viewModel: MarketListViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    when {
        uiState.isLoading -> LoadingIndicator()
        uiState.error != null -> ErrorMessage(
            message = uiState.error!!,
            onRetry = viewModel::loadMarkets
        )
        else -> MarketList(markets = uiState.markets)
    }
}
```

## Navigation

### Navigation Compose

```kotlin
@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = "home"
    ) {
        composable("home") {
            HomeScreen(
                onMarketClick = { marketId ->
                    navController.navigate("market/$marketId")
                }
            )
        }
        
        composable(
            route = "market/{marketId}",
            arguments = listOf(navArgument("marketId") { type = NavType.StringType })
        ) { backStackEntry ->
            val marketId = backStackEntry.arguments?.getString("marketId")!!
            MarketDetailScreen(
                marketId = marketId,
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}

// Type-safe navigation (Navigation 2.8+)
@Serializable
object Home

@Serializable
data class MarketDetail(val id: String)

@Composable
fun TypeSafeNavigation() {
    val navController = rememberNavController()
    
    NavHost(navController = navController, startDestination = Home) {
        composable<Home> {
            HomeScreen(
                onMarketClick = { id -> navController.navigate(MarketDetail(id)) }
            )
        }
        composable<MarketDetail> { backStackEntry ->
            val args = backStackEntry.toRoute<MarketDetail>()
            MarketDetailScreen(marketId = args.id)
        }
    }
}
```

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

## Data Persistence

### Room Database

```kotlin
@Entity(tableName = "markets")
data class MarketEntity(
    @PrimaryKey val id: String,
    val name: String,
    val volume: Double,
    @ColumnInfo(name = "updated_at") val updatedAt: Long = System.currentTimeMillis()
)

@Dao
interface MarketDao {
    @Query("SELECT * FROM markets ORDER BY volume DESC")
    fun observeMarkets(): Flow<List<MarketEntity>>
    
    @Query("SELECT * FROM markets WHERE id = :id")
    suspend fun getMarket(id: String): MarketEntity?
    
    @Upsert
    suspend fun upsertMarkets(markets: List<MarketEntity>)
    
    @Query("DELETE FROM markets WHERE updated_at < :timestamp")
    suspend fun deleteStale(timestamp: Long)
}

@Database(entities = [MarketEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun marketDao(): MarketDao
}
```

### DataStore for Preferences

```kotlin
@Singleton
class UserPreferences @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val Context.dataStore by preferencesDataStore(name = "user_prefs")
    
    private object Keys {
        val THEME = stringPreferencesKey("theme")
        val NOTIFICATIONS_ENABLED = booleanPreferencesKey("notifications_enabled")
    }
    
    val theme: Flow<String> = context.dataStore.data
        .map { prefs -> prefs[Keys.THEME] ?: "system" }
    
    val notificationsEnabled: Flow<Boolean> = context.dataStore.data
        .map { prefs -> prefs[Keys.NOTIFICATIONS_ENABLED] ?: true }
    
    suspend fun setTheme(theme: String) {
        context.dataStore.edit { prefs ->
            prefs[Keys.THEME] = theme
        }
    }
}
```

### EncryptedSharedPreferences for Secrets

```kotlin
@Singleton
class SecureStorage @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()
    
    private val prefs = EncryptedSharedPreferences.create(
        context,
        "secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
    
    fun saveToken(token: String) {
        prefs.edit().putString("auth_token", token).apply()
    }
    
    fun getToken(): String? = prefs.getString("auth_token", null)
    
    fun clearToken() {
        prefs.edit().remove("auth_token").apply()
    }
}
```

## Animations

### Compose Animations

```kotlin
@Composable
fun AnimatedCard(expanded: Boolean, onClick: () -> Unit) {
    val height by animateDpAsState(
        targetValue = if (expanded) 200.dp else 100.dp,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "height"
    )
    
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(height)
            .clickable(onClick = onClick)
    ) {
        // Content
    }
}

// Animated visibility
@Composable
fun ExpandableContent(visible: Boolean, content: @Composable () -> Unit) {
    AnimatedVisibility(
        visible = visible,
        enter = expandVertically() + fadeIn(),
        exit = shrinkVertically() + fadeOut()
    ) {
        content()
    }
}

// Shared element transitions (Compose 1.7+)
@OptIn(ExperimentalSharedTransitionApi::class)
@Composable
fun SharedElementDemo() {
    SharedTransitionLayout {
        AnimatedContent(targetState = isExpanded) { expanded ->
            if (expanded) {
                ExpandedCard(
                    modifier = Modifier.sharedElement(
                        state = rememberSharedContentState(key = "card"),
                        animatedVisibilityScope = this@AnimatedContent
                    )
                )
            } else {
                CompactCard(
                    modifier = Modifier.sharedElement(
                        state = rememberSharedContentState(key = "card"),
                        animatedVisibilityScope = this@AnimatedContent
                    )
                )
            }
        }
    }
}
```

## Material Design 3

### Theming

```kotlin
@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context)
            else dynamicLightColorScheme(context)
        }
        darkTheme -> darkColorScheme()
        else -> lightColorScheme()
    }
    
    MaterialTheme(
        colorScheme = colorScheme,
        typography = AppTypography,
        content = content
    )
}
```

## Testing

### Unit Tests

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class MarketViewModelTest {
    
    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()
    
    private lateinit var viewModel: MarketListViewModel
    private lateinit var repository: FakeMarketRepository
    
    @Before
    fun setup() {
        repository = FakeMarketRepository()
        viewModel = MarketListViewModel(repository)
    }
    
    @Test
    fun `loadMarkets success updates state correctly`() = runTest {
        repository.setMarkets(listOf(Market.mock()))
        
        viewModel.loadMarkets()
        advanceUntilIdle()
        
        val state = viewModel.uiState.value
        assertFalse(state.isLoading)
        assertEquals(1, state.markets.size)
        assertNull(state.error)
    }
}
```

### UI Tests

```kotlin
@HiltAndroidTest
class MarketListScreenTest {
    
    @get:Rule(order = 0)
    val hiltRule = HiltAndroidRule(this)
    
    @get:Rule(order = 1)
    val composeRule = createAndroidComposeRule<MainActivity>()
    
    @Test
    fun marketList_displaysMarkets() {
        composeRule.setContent {
            AppTheme {
                MarketListScreen()
            }
        }
        
        composeRule.waitUntil(5000) {
            composeRule.onAllNodesWithTag("market_item").fetchSemanticsNodes().isNotEmpty()
        }
        
        composeRule.onNodeWithText("Test Market").assertIsDisplayed()
    }
}
```

## Background Work

### WorkManager

```kotlin
@HiltWorker
class SyncMarketsWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val repository: MarketRepository
) : CoroutineWorker(context, params) {
    
    override suspend fun doWork(): Result {
        return try {
            repository.syncMarkets()
            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) {
                Result.retry()
            } else {
                Result.failure()
            }
        }
    }
    
    companion object {
        fun schedule(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()
            
            val request = PeriodicWorkRequestBuilder<SyncMarketsWorker>(
                15, TimeUnit.MINUTES
            )
                .setConstraints(constraints)
                .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 1, TimeUnit.MINUTES)
                .build()
            
            WorkManager.getInstance(context)
                .enqueueUniquePeriodicWork(
                    "sync_markets",
                    ExistingPeriodicWorkPolicy.KEEP,
                    request
                )
        }
    }
}
```

## Related Agent
- `mobile-developer`
- `mobile-developer-high`
