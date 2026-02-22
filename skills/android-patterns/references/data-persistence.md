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
