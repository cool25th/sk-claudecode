---
name: mobile
description: Mobile development patterns for iOS and Android
triggers:
  - "mobile"
  - "app"
  - "native"
---

# Mobile Development Skill

Cross-platform guidance for iOS (Swift/SwiftUI) and Android (Kotlin/Compose) development.

## Platform Detection

Before implementing, detect the mobile platform from project files:
- `*.xcodeproj` or `Package.swift` with iOS targets → iOS (Swift/SwiftUI)
- `build.gradle.kts` with Android plugins → Android (Kotlin/Compose)
- `pubspec.yaml` → Flutter (Dart)
- `package.json` with `react-native` → React Native

## Architecture Patterns

### iOS MVVM
```swift
@MainActor
class ViewModel: ObservableObject {
    @Published private(set) var state: State = .initial
    
    func load() async {
        state = .loading
        do {
            let data = try await service.fetch()
            state = .loaded(data)
        } catch {
            state = .error(error)
        }
    }
}
```

### Android MVVM
```kotlin
class ViewModel @Inject constructor(
    private val repository: Repository
) : ViewModel() {
    private val _uiState = MutableStateFlow(UiState())
    val uiState = _uiState.asStateFlow()
    
    fun load() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            repository.fetch()
                .onSuccess { data -> _uiState.update { it.copy(data = data, isLoading = false) } }
                .onFailure { error -> _uiState.update { it.copy(error = error, isLoading = false) } }
        }
    }
}
```

## Key Differences

| Aspect | iOS | Android |
|--------|-----|---------|
| UI | SwiftUI | Jetpack Compose |
| DI | Manual / Factory | Hilt |
| Async | async/await, Combine | Coroutines, Flow |
| Storage | SwiftData, Core Data | Room |
| Secure Storage | Keychain | EncryptedSharedPreferences |
| Background | BGTaskScheduler | WorkManager |

## Related Skills
- `ios-patterns` - Detailed iOS patterns
- `android-patterns` - Detailed Android patterns

## Related Agents
- `mobile-developer`
- `mobile-developer-low`
- `mobile-developer-high`
