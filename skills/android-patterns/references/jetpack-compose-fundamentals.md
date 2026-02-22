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
