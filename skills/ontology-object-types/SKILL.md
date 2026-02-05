---
name: ontology-object-types
description: Object Type design patterns for ontology development
---

# Ontology Object Types

Object Types are the fundamental building blocks of an ontology - schema definitions representing real-world entities.

## Anatomy of an Object Type

```typescript
interface ObjectTypeDefinition {
  // Identity
  apiName: string;              // 'Customer', 'Order'
  primaryKey: PrimaryKeyType;   // Unique identifier
  
  // Schema
  properties: PropertyDefinition[];
  
  // Relationships
  links: LinkDefinition[];
  
  // Behavior
  actions: ActionReference[];
}
```

## Property Types

### Primitives
```typescript
string      // Text values
integer     // Whole numbers
double      // Decimal numbers
boolean     // true/false
date        // Date without time
timestamp   // Date with time
```

### Complex Types
```typescript
// Array of primitives
tags: string[]

// Struct/Object
address: {
  street: string;
  city: string;
  postalCode: string;
}

// Enum
status: 'active' | 'inactive' | 'pending'
```

## Design Patterns

### 1. Entity Pattern
Standard business entity:
```typescript
interface Customer {
  customerId: string;       // PK
  name: string;
  email: string;
  createdAt: timestamp;
  status: CustomerStatus;
}
```

### 2. Event Pattern
Time-based occurrence:
```typescript
interface OrderEvent {
  eventId: string;         // PK
  orderId: string;         // FK
  eventType: EventType;
  occurredAt: timestamp;
  metadata: Record<string, any>;
}
```

### 3. Dimension Pattern
Slowly changing reference data:
```typescript
interface ProductCategory {
  categoryId: string;      // PK
  name: string;
  parentCategoryId?: string;  // Self-reference
  validFrom: date;
  validTo?: date;
}
```

### 4. Metric Pattern
Aggregated measurements:
```typescript
interface DailySalesMetric {
  metricId: string;        // PK: date + storeId
  date: date;
  storeId: string;
  totalSales: double;
  orderCount: integer;
  averageOrderValue: double;
}
```

## Naming Conventions

| Aspect | Convention | Example |
|--------|------------|---------|
| Object Type | PascalCase, singular | `Customer`, `Order` |
| Property | camelCase | `firstName`, `orderDate` |
| Primary Key | `{entity}Id` | `customerId`, `orderId` |
| Boolean | `is/has` prefix | `isActive`, `hasShipped` |
| Timestamp | `At` suffix | `createdAt`, `updatedAt` |

## Anti-Patterns

❌ **Table-Driven Naming**
```typescript
// Bad
interface TBL_CUST { CUST_ID: string; CUST_NM: string; }

// Good
interface Customer { customerId: string; name: string; }
```

❌ **Overloaded Types**
```typescript
// Bad: Combining unrelated data
interface CustomerOrderProduct { /* everything */ }

// Good: Separate concerns
interface Customer { /* customer data */ }
interface Order { /* order data */ }
```

❌ **Generic Properties**
```typescript
// Bad
data: any;
value: string;

// Good
orderTotal: number;
shippingAddress: Address;
```

## Validation Rules

```typescript
// Property-level validation examples
interface Order {
  orderId: string;                        // Required, unique
  quantity: integer;                      // Min: 1, Max: 1000
  email: string;                          // Email format
  status: 'pending' | 'shipped' | 'delivered';  // Enum constraint
}
```

## See Also

- `/skill ontology` - Overview
- `/skill ontology-links` - Relationship modeling
- `/skill ontology-actions` - State mutations
