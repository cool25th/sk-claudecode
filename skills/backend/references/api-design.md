## API Design

### REST Conventions
```
GET    /resources      # List
GET    /resources/:id  # Get one
POST   /resources      # Create
PUT    /resources/:id  # Update
DELETE /resources/:id  # Delete
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": { "page": 1, "total": 100 }
}
```
