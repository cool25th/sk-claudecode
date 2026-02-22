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
