---
name: ontology-functions
description: TypeScript function development for ontology operations
---

# Ontology Functions

Functions enable custom TypeScript logic for reading, computing, and manipulating ontology data.

## Function Types

### 1. Query Functions
Read and aggregate data:
```typescript
@Function()
public async getCustomerOrders(
  customerId: string
): Promise<Order[]> {
  const customer = await this.ontology
    .objects.Customer
    .get(customerId);
  
  return await customer.orders.all();
}
```

### 2. Compute Functions
Business calculations:
```typescript
@Function()
public calculateOrderTotal(order: Order): number {
  const subtotal = order.items.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );
  const tax = subtotal * order.taxRate;
  const discount = this.applyDiscounts(subtotal, order.discountCodes);
  
  return subtotal + tax - discount;
}
```

### 3. Validation Functions
Pre-action validation:
```typescript
@Function()
public async validateOrderPlacement(
  customerId: string,
  items: OrderItem[]
): Promise<ValidationResult> {
  const errors: string[] = [];
  
  // Check customer exists
  const customer = await this.ontology.objects.Customer
    .where({ customerId })
    .first();
  if (!customer) {
    errors.push('Customer not found');
  }
  
  // Check inventory
  for (const item of items) {
    const product = await this.ontology.objects.Product
      .get(item.productId);
    if (product.inventory < item.quantity) {
      errors.push(`Insufficient stock for ${product.name}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### 4. Aggregation Functions
Complex aggregations:
```typescript
@Function()
public async getCustomerLifetimeValue(
  customerId: string
): Promise<CustomerMetrics> {
  const orders = await this.ontology.objects.Order
    .where({ customerId, status: 'delivered' })
    .all();
  
  return {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
    averageOrderValue: orders.length > 0 
      ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length 
      : 0,
    firstOrderDate: orders[0]?.createdAt,
    lastOrderDate: orders[orders.length - 1]?.createdAt
  };
}
```

## Ontology SDK Patterns

### Reading Objects
```typescript
// Get by primary key
const customer = await ontology.objects.Customer.get(customerId);

// Query with filters
const activeCustomers = await ontology.objects.Customer
  .where({ status: 'active' })
  .where(c => c.createdAt.gte(startDate))
  .orderBy('name', 'asc')
  .take(100)
  .all();

// First matching
const order = await ontology.objects.Order
  .where({ orderId })
  .first();
```

### Traversing Links
```typescript
// One-to-many
const customerOrders = await customer.orders.all();

// Many-to-one
const orderCustomer = await order.customer.get();

// Chained traversal
const productCategories = await order.items
  .flatMap(item => item.product)
  .flatMap(product => product.categories)
  .all();
```

### Writing via Actions
```typescript
@Function()
public async createOrderWithValidation(
  params: CreateOrderParams
): Promise<ActionResult> {
  // Validate
  const validation = await this.validateOrderPlacement(
    params.customerId, 
    params.items
  );
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }
  
  // Execute action
  return await this.ontology.actions.createOrder.apply(params);
}
```

## Testing Functions

### Unit Testing with Jest
```typescript
describe('calculateOrderTotal', () => {
  it('should calculate total with tax and discount', () => {
    const order = mockOrder({
      items: [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 }
      ],
      taxRate: 0.1,
      discountCodes: ['10OFF']
    });
    
    const total = calculateOrderTotal(order);
    
    // (200 + 50) * 1.1 - 10 = 265
    expect(total).toBe(265);
  });
});
```

### Integration Testing
```typescript
describe('getCustomerOrders', () => {
  it('should return all customer orders', async () => {
    // Setup test data
    const customerId = await createTestCustomer();
    await createTestOrder(customerId);
    await createTestOrder(customerId);
    
    // Execute
    const orders = await getCustomerOrders(customerId);
    
    // Assert
    expect(orders).toHaveLength(2);
  });
});
```

## Best Practices

| Aspect | Recommendation |
|--------|----------------|
| Pure Functions | Prefer pure over stateful when possible |
| Error Handling | Return Result types, don't throw |
| Typing | Full type annotations, no `any` |
| Performance | Use pagination for large result sets |
| Caching | Cache expensive computations |

## Anti-Patterns

❌ **Side Effects in Query Functions**
```typescript
// Bad: Hidden mutation
async function getOrders(customerId: string) {
  await updateLastAccessed(customerId);  // Side effect!
  return await fetchOrders(customerId);
}

// Good: Separate concerns
async function getOrders(customerId: string) {
  return await fetchOrders(customerId);
}
```

❌ **N+1 Queries**
```typescript
// Bad: N+1 queries
for (const order of orders) {
  const customer = await order.customer.get();
}

// Good: Batch fetch
const customerIds = orders.map(o => o.customerId);
const customers = await ontology.objects.Customer
  .where({ customerId: { in: customerIds } })
  .all();
```

## See Also

- `/skill ontology` - Overview
- `/skill ontology-object-types` - Entity definitions
- `/skill ontology-actions` - Actions that use functions
- `/skill ontology-storage` - Storage patterns

