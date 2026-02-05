---
name: ontology-links
description: Link modeling strategies for ontology relationships
---

# Ontology Links

Links define relationships between Object Types, enabling semantic traversal and data integrity.

## Link Types

### 1. One-to-One
Single object relates to single object:
```
Employee ──── WorkStation
   │              │
   └── has one ───┘
```

```typescript
interface Employee {
  employeeId: string;
  workstationId: string;  // FK to WorkStation
}

link EmployeeWorkStation {
  from: Employee
  to: WorkStation
  cardinality: ONE_TO_ONE
}
```

### 2. One-to-Many
Single object relates to multiple objects:
```
Customer ──┬── Order
           ├── Order
           └── Order
```

```typescript
interface Order {
  orderId: string;
  customerId: string;  // FK to Customer
}

link CustomerOrders {
  from: Customer
  to: Order
  cardinality: ONE_TO_MANY
  backLink: orderCustomer
}
```

### 3. Many-to-Many
Multiple objects relate to multiple objects:
```
Product ──┼── Category
          ╲╱
```

```typescript
// Via junction object
interface ProductCategory {
  productId: string;
  categoryId: string;
  isPrimary: boolean;   // Additional metadata
}

link ProductCategories {
  from: Product
  to: Category
  through: ProductCategory
  cardinality: MANY_TO_MANY
}
```

## Modeling Strategies

### Foreign Key Pattern
Direct reference:
```typescript
interface Order {
  orderId: string;
  customerId: string;      // FK
  shippingAddressId: string;  // FK
}
```

### Junction Table Pattern
For many-to-many with metadata:
```typescript
interface OrderProduct {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}
```

### Polymorphic Links
Single link to multiple types:
```typescript
interface Comment {
  commentId: string;
  targetType: 'Order' | 'Product' | 'Customer';
  targetId: string;
  content: string;
}
```

## Traversal Patterns

### Forward Traversal
```typescript
// Customer → Orders
const orders = await customer.orders.all();

// With filtering
const pendingOrders = await customer.orders
  .where({ status: 'pending' })
  .all();
```

### Backward Traversal
```typescript
// Order → Customer
const customer = await order.customer.get();
```

### Multi-Hop Traversal
```typescript
// Customer → Orders → Products
const products = await customer.orders
  .flatMap(order => order.products)
  .all();

// Unique products
const uniqueProducts = [...new Set(products.map(p => p.productId))];
```

### Aggregation via Links
```typescript
// Count customer orders
const orderCount = await customer.orders.count();

// Sum order totals
const totalSpent = await customer.orders
  .select(o => o.total)
  .sum();
```

## Link Constraints

### Referential Integrity
```typescript
link OrderCustomer {
  from: Order
  to: Customer
  onDelete: RESTRICT  // Prevent deletion if orders exist
  onUpdate: CASCADE   // Update FKs if PK changes
}
```

### Cardinality Enforcement
```typescript
link EmployeeManager {
  from: Employee
  to: Employee
  cardinality: MANY_TO_ONE
  nullable: true  // Not all employees have managers
}
```

## Bidirectional Links

```typescript
// Define both directions explicitly
link CustomerOrders {
  from: Customer
  to: Order
  cardinality: ONE_TO_MANY
}

link OrderCustomer {
  from: Order  
  to: Customer
  cardinality: MANY_TO_ONE
  inverse: CustomerOrders
}
```

Usage:
```typescript
// Forward
const orders = await customer.orders.all();

// Backward
const customer = await order.customer.get();
```

## Hierarchical Links (Self-Reference)

### Tree Structure
```typescript
interface Category {
  categoryId: string;
  name: string;
  parentCategoryId?: string;  // Self-reference
}

link CategoryParent {
  from: Category
  to: Category
  cardinality: MANY_TO_ONE
  backLink: childCategories
}
```

### Traversal
```typescript
// Get parent
const parent = await category.parent.get();

// Get children
const children = await category.children.all();

// Get ancestors (recursive)
async function getAncestors(category: Category): Promise<Category[]> {
  const parent = await category.parent.get();
  if (!parent) return [];
  return [parent, ...await getAncestors(parent)];
}
```

## Best Practices

| Aspect | Recommendation |
|--------|----------------|
| Naming | Use relationship verb (orders, belongsTo) |
| Direction | Model from "owner" to "owned" |
| Cardinality | Explicit over implicit |
| Indexing | Index foreign keys for performance |
| Nullability | Required vs optional explicit |

## Anti-Patterns

❌ **Implicit Relationships**
```typescript
// Bad: Relationship hidden in string
interface Order {
  customerInfo: string;  // "123|John|john@email.com"
}

// Good: Explicit link
interface Order {
  customerId: string;
}
```

❌ **Deep Nesting**
```typescript
// Bad: Too many hops
customer → orders → items → products → suppliers → contacts

// Good: Direct links where needed
customer → orders
order → supplier (direct link for common access)
```

## See Also

- `/skill ontology` - Overview
- `/skill ontology-object-types` - Entity definitions
