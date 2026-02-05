---
name: ontology
description: Quick reference for Palantir-style ontology development patterns
---

# Ontology Development Skill

Quick reference for building semantic data layers following Palantir Foundry patterns.

## Ontology Overview

The Ontology is a **digital twin** of your organization - a structured semantic layer that:
- Maps real-world entities to data objects
- Defines relationships between entities
- Enables operational actions on data
- Provides type-safe programmatic access

## Core Components

```
┌─────────────────────────────────────────────────────┐
│                    ONTOLOGY                         │
├──────────────┬──────────────┬──────────────────────┤
│ Object Types │    Links     │  Actions & Functions │
├──────────────┼──────────────┼──────────────────────┤
│ - Customer   │ Customer →   │ - CreateOrder        │
│ - Order      │   Orders     │ - UpdateStatus       │
│ - Product    │ Order →      │ - CalculateTotal()   │
│ - Inventory  │   Products   │ - ValidateStock()    │
└──────────────┴──────────────┴──────────────────────┘
```

## Design Workflow

### 1. Domain Discovery
```
Ask:
- What entities exist?
- What properties define each entity?
- How do entities relate?
- What operations are needed?
```

### 2. Object Type Definition
```typescript
interface ObjectType {
  primaryKey: string;           // Unique identifier
  properties: Record<string, PropertyType>;
  links: LinkDefinition[];      // Relationships
}
```

### 3. Link Modeling
```
One-to-One:   Employee ──── Department
One-to-Many:  Customer ──┬── Order
                         └── Order
Many-to-Many: Product ──┼── Category
```

### 4. Action Design
```typescript
// Actions modify state transactionally
action CreateOrder {
  parameters: { customerId, products[] }
  validation: CustomerExists, ProductsInStock
  effects: CreateOrderObject, DecrementInventory
}
```

### 5. Function Implementation
```typescript
// Functions compute and query
function calculateOrderTotal(order: Order): number {
  return order.items
    .map(item => item.price * item.quantity)
    .reduce((sum, val) => sum + val, 0);
}
```

## Quick Reference Table

| Component | Purpose | Example |
|-----------|---------|---------|
| Object Type | Entity schema | Customer, Order, Product |
| Property | Entity attribute | name, email, status |
| Link | Relationship | Customer → Orders |
| Action | State mutation | CreateOrder, UpdateStatus |
| Function | Computation | calculateTotal() |

## Related Skills

- `/skill ontology-object-types` - Detailed Object Type patterns
- `/skill ontology-actions` - Action design and validation
- `/skill ontology-functions` - TypeScript function development
- `/skill ontology-links` - Link modeling strategies

## Related Agent

- `/agent ontology-developer` - Full ontology development assistance
