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
