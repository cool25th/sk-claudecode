---
name: ios-patterns
description: iOS development patterns with Swift, SwiftUI, and modern Apple frameworks
triggers:
  - "ios"
  - "swift"
  - "swiftui"
  - "xcode"
  - "iphone"
  - "ipad"
---

# iOS Development Patterns

Modern iOS development patterns with Swift and SwiftUI for building polished Apple platform applications.

## SwiftUI Fundamentals

### View Composition

```swift
// ✅ Composable Views
struct ProfileCard: View {
    let user: User
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ProfileHeader(user: user)
            ProfileStats(stats: user.stats)
            ProfileActions(userId: user.id)
        }
        .padding()
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

// ✅ Reusable Components
struct IconBadge: View {
    let systemName: String
    let count: Int
    
    var body: some View {
        Label("\(count)", systemImage: systemName)
            .font(.caption)
            .foregroundStyle(.secondary)
    }
}
```

### State Management

```swift
// Property Wrappers
struct CounterView: View {
    @State private var count = 0                    // Local state
    @Binding var externalCount: Int                 // Parent-owned state
    @StateObject private var viewModel = ViewModel() // Observable object (owned)
    @ObservedObject var sharedVM: ViewModel          // Observable object (not owned)
    @EnvironmentObject var appState: AppState       // Injected dependency
    @Environment(\.colorScheme) var colorScheme     // System environment
    
    var body: some View {
        Button("Count: \(count)") {
            count += 1
        }
    }
}
```

### MVVM Pattern

```swift
// ViewModel with Combine
@MainActor
class MarketListViewModel: ObservableObject {
    @Published private(set) var markets: [Market] = []
    @Published private(set) var isLoading = false
    @Published private(set) var error: Error?
    
    private let marketService: MarketService
    
    init(marketService: MarketService = .shared) {
        self.marketService = marketService
    }
    
    func loadMarkets() async {
        isLoading = true
        error = nil
        
        do {
            markets = try await marketService.fetchMarkets()
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
}

// View consuming ViewModel
struct MarketListView: View {
    @StateObject private var viewModel = MarketListViewModel()
    
    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView()
            } else if let error = viewModel.error {
                ErrorView(error: error, retry: viewModel.loadMarkets)
            } else {
                List(viewModel.markets) { market in
                    MarketRow(market: market)
                }
            }
        }
        .task { await viewModel.loadMarkets() }
    }
}
```

## Navigation

### NavigationStack (iOS 16+)

```swift
struct ContentView: View {
    @State private var path = NavigationPath()
    
    var body: some View {
        NavigationStack(path: $path) {
            HomeView()
                .navigationDestination(for: Market.self) { market in
                    MarketDetailView(market: market)
                }
                .navigationDestination(for: User.self) { user in
                    ProfileView(user: user)
                }
        }
    }
    
    // Programmatic navigation
    func navigateToMarket(_ market: Market) {
        path.append(market)
    }
}
```

### Tab Navigation

```swift
struct MainTabView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house")
                }
                .tag(0)
            
            SearchView()
                .tabItem {
                    Label("Search", systemImage: "magnifyingglass")
                }
                .tag(1)
            
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person")
                }
                .tag(2)
        }
    }
}
```

## Networking

### Modern Async/Await

```swift
actor NetworkClient {
    private let session: URLSession
    private let decoder = JSONDecoder()
    
    init(session: URLSession = .shared) {
        self.session = session
    }
    
    func fetch<T: Decodable>(_ endpoint: Endpoint) async throws -> T {
        let request = try endpoint.urlRequest()
        let (data, response) = try await session.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.invalidResponse
        }
        
        return try decoder.decode(T.self, from: data)
    }
}

// Endpoint definition
enum Endpoint {
    case markets
    case market(id: String)
    case createOrder(MarketOrder)
    
    func urlRequest() throws -> URLRequest {
        var request = URLRequest(url: url)
        request.httpMethod = method
        
        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        
        return request
    }
    
    private var url: URL { /* ... */ }
    private var method: String { /* ... */ }
    private var body: Encodable? { /* ... */ }
}
```

## Data Persistence

### SwiftData (iOS 17+)

```swift
import SwiftData

@Model
class CachedMarket {
    @Attribute(.unique) var id: String
    var name: String
    var volume: Double
    var lastUpdated: Date
    
    init(id: String, name: String, volume: Double) {
        self.id = id
        self.name = name
        self.volume = volume
        self.lastUpdated = Date()
    }
}

// Usage in View
struct MarketListView: View {
    @Query(sort: \CachedMarket.volume, order: .reverse)
    private var markets: [CachedMarket]
    
    @Environment(\.modelContext) private var context
    
    var body: some View {
        List(markets) { market in
            MarketRow(market: market)
                .swipeActions {
                    Button(role: .destructive) {
                        context.delete(market)
                    } label: {
                        Label("Delete", systemImage: "trash")
                    }
                }
        }
    }
}
```

### Keychain for Secure Storage

```swift
import Security

actor KeychainManager {
    static let shared = KeychainManager()
    
    func save(_ data: Data, for key: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]
        
        SecItemDelete(query as CFDictionary) // Remove existing
        
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw KeychainError.saveFailed(status)
        }
    }
    
    func load(for key: String) throws -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecMatchLimit as String: kSecMatchLimitOne,
            kSecReturnData as String: true
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        guard status == errSecSuccess else {
            if status == errSecItemNotFound { return nil }
            throw KeychainError.loadFailed(status)
        }
        
        return result as? Data
    }
}
```

## Animations

### SwiftUI Animations

```swift
struct AnimatedCard: View {
    @State private var isExpanded = false
    
    var body: some View {
        VStack {
            Text("Tap to expand")
            
            if isExpanded {
                Text("Additional content here")
                    .transition(.asymmetric(
                        insertion: .opacity.combined(with: .move(edge: .top)),
                        removal: .opacity
                    ))
            }
        }
        .frame(height: isExpanded ? 200 : 100)
        .animation(.spring(response: 0.4, dampingFraction: 0.8), value: isExpanded)
        .onTapGesture {
            isExpanded.toggle()
        }
    }
}

// Matched Geometry Effect
struct HeroAnimation: View {
    @Namespace private var namespace
    @State private var isExpanded = false
    
    var body: some View {
        if isExpanded {
            ExpandedCard(namespace: namespace)
                .onTapGesture { withAnimation { isExpanded = false } }
        } else {
            CompactCard(namespace: namespace)
                .onTapGesture { withAnimation { isExpanded = true } }
        }
    }
}
```

## Accessibility

```swift
struct AccessibleButton: View {
    let title: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
        }
        .accessibilityLabel(title)
        .accessibilityHint("Double tap to activate")
        .accessibilityAddTraits(.isButton)
    }
}

// Dynamic Type Support
struct ScalableText: View {
    var body: some View {
        Text("Headline")
            .font(.headline)
            .dynamicTypeSize(...DynamicTypeSize.accessibility3)
    }
}
```

## Testing

### Unit Tests

```swift
@MainActor
final class MarketViewModelTests: XCTestCase {
    var sut: MarketListViewModel!
    var mockService: MockMarketService!
    
    override func setUp() {
        mockService = MockMarketService()
        sut = MarketListViewModel(marketService: mockService)
    }
    
    func test_loadMarkets_success() async {
        mockService.mockMarkets = [Market.mock]
        
        await sut.loadMarkets()
        
        XCTAssertFalse(sut.isLoading)
        XCTAssertEqual(sut.markets.count, 1)
        XCTAssertNil(sut.error)
    }
    
    func test_loadMarkets_failure() async {
        mockService.shouldFail = true
        
        await sut.loadMarkets()
        
        XCTAssertTrue(sut.markets.isEmpty)
        XCTAssertNotNil(sut.error)
    }
}
```

### UI Tests

```swift
final class MarketFlowUITests: XCTestCase {
    var app: XCUIApplication!
    
    override func setUp() {
        app = XCUIApplication()
        app.launchArguments = ["--uitesting"]
        app.launch()
    }
    
    func test_createMarket_flow() {
        app.buttons["Create Market"].tap()
        
        let nameField = app.textFields["marketName"]
        nameField.tap()
        nameField.typeText("Test Market")
        
        app.buttons["Submit"].tap()
        
        XCTAssertTrue(app.staticTexts["Test Market"].exists)
    }
}
```

## Related Agent
- `mobile-developer`
- `mobile-developer-high`
