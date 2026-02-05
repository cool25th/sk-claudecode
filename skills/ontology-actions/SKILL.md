---
name: ontology-actions
description: Action design patterns for ontology state mutations
---

# Ontology Actions

Actions are transactional operations that modify object state. They encapsulate business logic and ensure data integrity.

## Action Anatomy

```typescript
interface ActionDefinition {
  apiName: string;                    // 'createOrder'
  parameters: ParameterDefinition[];  // Input schema
  validation: ValidationRule[];       // Pre-conditions
  effects: Effect[];                  // State changes
  permissions: PermissionRule[];      // Access control
}
```

## Action Types

### 1. Create Action
```typescript
action CreateOrder {
  parameters: {
    customerId: string;
    items: OrderItem[];
    shippingAddress: Address;
  }
  
  validation: {
    CustomerExists(customerId);
    ItemsNotEmpty(items);
    AddressValid(shippingAddress);
  }
  
  effects: {
    CreateObject<Order>({
      orderId: generateId(),
      customerId: parameters.customerId,
      items: parameters.items,
      status: 'pending',
      createdAt: now()
    });
  }
}
```

### 2. Update Action
```typescript
action UpdateOrderStatus {
  parameters: {
    orderId: string;
    newStatus: OrderStatus;
  }
  
  validation: {
    OrderExists(orderId);
    ValidStatusTransition(currentStatus, newStatus);
  }
  
  effects: {
    ModifyObject<Order>(orderId, {
      status: newStatus,
      updatedAt: now()
    });
  }
}
```

### 3. Delete Action
```typescript
action CancelOrder {
  parameters: {
    orderId: string;
    reason: string;
  }
  
  validation: {
    OrderExists(orderId);
    OrderCancellable(order);
  }
  
  effects: {
    ModifyObject<Order>(orderId, { 
      status: 'cancelled',
      cancellationReason: reason 
    });
    // Or: DeleteObject<Order>(orderId);
  }
}
```

### 4. Link Action
```typescript
action AssignOrderToShipment {
  parameters: {
    orderId: string;
    shipmentId: string;
  }
  
  validation: {
    OrderExists(orderId);
    ShipmentExists(shipmentId);
    ShipmentHasCapacity(shipmentId);
  }
  
  effects: {
    AddLink(orderId, 'shipment', shipmentId);
    ModifyObject<Order>(orderId, { status: 'assigned' });
  }
}
```

## Validation Patterns

### Pre-condition Checks
```typescript
validation: {
  // Existence checks
  ObjectExists<Customer>(customerId);
  
  // Business rule checks
  OrderTotalUnderLimit(order, customer.creditLimit);
  
  // State checks
  OrderStatus(orderId).equals('pending');
  
  // Permission checks
  UserHasRole('order_manager');
}
```

### Validation Functions
```typescript
function ValidStatusTransition(from: Status, to: Status): boolean {
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['shipped', 'cancelled'],
    'shipped': ['delivered'],
    'delivered': []  // Terminal state
  };
  return validTransitions[from].includes(to);
}
```

## Side Effects

### Event Emission
```typescript
effects: {
  CreateObject<Order>(orderData);
  EmitEvent('order.created', { orderId, customerId });
}
```

### Cascading Updates
```typescript
effects: {
  ModifyObject<Order>(orderId, { status: 'shipped' });
  // Update inventory
  items.forEach(item => {
    ModifyObject<Inventory>(item.productId, {
      quantity: inventory.quantity - item.quantity
    });
  });
}
```

## Error Handling

```typescript
action PlaceOrder {
  try {
    validation: { ... }
    effects: { ... }
  } catch (ValidationError) {
    return { success: false, errors: validationErrors };
  } catch (ConcurrencyError) {
    return { success: false, error: 'Object modified, please retry' };
  }
}
```

## Best Practices

| Aspect | Recommendation |
|--------|----------------|
| Atomicity | All-or-nothing execution |
| Naming | Verb + Object (CreateOrder) |
| Parameters | Minimal, required data only |
| Validation | Fail fast, clear messages |
| Effects | Order matters, dependencies first |

## Anti-Patterns

❌ **Property-Level Actions**
```typescript
// Bad: Too granular
action UpdateCustomerName { ... }
action UpdateCustomerEmail { ... }

// Good: Entity-level
action UpdateCustomerProfile {
  parameters: { name?, email?, phone? }
}
```

❌ **Hidden Side Effects**
```typescript
// Bad: Surprise behavior
action CreateOrder {
  effects: {
    CreateOrder(...);
    SendEmail(...);      // Hidden side effect
    UpdateAnalytics(...); // Hidden side effect
  }
}

// Good: Explicit and documented
action CreateOrder {
  effects: { CreateOrder(...) }
  notifications: { OrderCreatedEmail }
  analytics: { TrackOrderCreation }
}
```

## See Also

- `/skill ontology` - Overview
- `/skill ontology-functions` - Custom validation logic
