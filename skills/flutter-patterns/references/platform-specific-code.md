## Platform-Specific Code

```dart
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class PlatformUtils {
  static bool get isIOS => !kIsWeb && Platform.isIOS;
  static bool get isAndroid => !kIsWeb && Platform.isAndroid;
  static bool get isWeb => kIsWeb;
  static bool get isMobile => isIOS || isAndroid;
  
  static Widget adaptiveButton({
    required String label,
    required VoidCallback onPressed,
  }) {
    if (isIOS) {
      return CupertinoButton(
        onPressed: onPressed,
        child: Text(label),
      );
    }
    return ElevatedButton(
      onPressed: onPressed,
      child: Text(label),
    );
  }
}
```
