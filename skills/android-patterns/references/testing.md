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
