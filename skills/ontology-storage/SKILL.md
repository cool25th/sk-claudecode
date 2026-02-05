---
name: ontology-storage
description: Storage layer patterns for ontologies - Relational DB, Graph DB, Triple Stores, and GraphRAG
---

# Ontology Storage Patterns

Storage layer selection and implementation for ontology-based systems.

## Storage Options Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ONTOLOGY STORAGE                             │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Relational DB  │    Graph DB     │    Triple Store + RAG       │
├─────────────────┼─────────────────┼─────────────────────────────┤
│  PostgreSQL     │  Neo4j          │  Apache Jena                │
│  MySQL          │  Amazon Neptune │  GraphDB                    │
│  SQL Server     │  ArangoDB       │  Stardog + LangChain        │
│                 │  TigerGraph     │  Virtuoso + LlamaIndex      │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

## Decision Matrix

| Factor | Relational | Graph DB | Triple Store | GraphRAG |
|--------|------------|----------|--------------|----------|
| **Best For** | Palantir-style ops | Complex traversals | OWL reasoning | AI-powered queries |
| **Query** | SQL | Cypher/Gremlin | SPARQL | Natural language |
| **Schema** | Rigid | Flexible | Ontology-based | Hybrid |
| **Reasoning** | ❌ | Limited | ✅ Native | ✅ Via LLM |
| **Scale** | Excellent | Good | Moderate | Moderate |
| **Real-time** | ✅ | ✅ | ⚠️ | ⚠️ |

## 1. Relational DB (Palantir-Style)

Best for operational ontologies with ACID transactions.

### Schema Pattern
```sql
-- Object Types as tables
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    status VARCHAR(50) CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Links as foreign keys or junction tables
CREATE TABLE orders (
    order_id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(customer_id),
    total DECIMAL(10, 2),
    status VARCHAR(50)
);

-- Many-to-many via junction
CREATE TABLE order_products (
    order_id UUID REFERENCES orders(order_id),
    product_id UUID REFERENCES products(product_id),
    quantity INTEGER,
    PRIMARY KEY (order_id, product_id)
);
```

### TypeScript Integration
```typescript
// Prisma or Drizzle ORM
const customer = await prisma.customer.findUnique({
  where: { customerId },
  include: { orders: { include: { products: true } } }
});
```

## 2. Graph Database

Best for complex relationship traversals.

### Neo4j Example
```cypher
// Create nodes (Object Types)
CREATE (c:Customer {id: 'c1', name: 'Acme Corp', status: 'active'})
CREATE (o:Order {id: 'o1', total: 1500, status: 'pending'})
CREATE (p:Product {id: 'p1', name: 'Widget', price: 50})

// Create relationships (Links)
CREATE (c)-[:PLACED]->(o)
CREATE (o)-[:CONTAINS {quantity: 30}]->(p)

// Traverse relationships
MATCH (c:Customer)-[:PLACED]->(o:Order)-[:CONTAINS]->(p:Product)
WHERE c.id = 'c1'
RETURN c, o, p
```

### Path Queries
```cypher
// Find shortest path
MATCH path = shortestPath(
  (start:Customer {id: 'c1'})-[*]-(end:Supplier)
)
RETURN path

// Variable-length relationships
MATCH (c:Customer)-[:PLACED*1..3]->(o:Order)
RETURN c, collect(o)
```

## 3. Triple Store (Traditional Ontology)

Best for OWL reasoning and SPARQL queries.

### RDF Storage
```turtle
@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:customer1 rdf:type ex:Customer ;
    ex:name "Acme Corp" ;
    ex:status "active" .

ex:order1 rdf:type ex:Order ;
    ex:placedBy ex:customer1 ;
    ex:total 1500 .
```

### SPARQL with Reasoning
```sparql
PREFIX ex: <http://example.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

# With inference - finds subclass instances too
SELECT ?customer ?name
WHERE {
  ?customer rdf:type/rdfs:subClassOf* ex:BusinessEntity .
  ?customer ex:name ?name .
}
```

### Apache Jena Setup
```java
// Java/Scala - Jena Fuseki
Dataset dataset = TDBFactory.createDataset("./tdb");
Model model = dataset.getDefaultModel();
model.read("ontology.ttl", "TURTLE");

// Enable RDFS reasoning
InfModel infModel = ModelFactory.createRDFSModel(model);
```

## 4. GraphRAG (AI-Powered)

Combine knowledge graphs with LLM retrieval.

### Architecture
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Raw Data   │───▶│ Knowledge    │───▶│    LLM       │
│   Documents  │    │ Graph        │    │  Retrieval   │
└──────────────┘    └──────────────┘    └──────────────┘
                           │                    │
                           ▼                    ▼
                    ┌──────────────┐    ┌──────────────┐
                    │  Embeddings  │    │  Natural     │
                    │  Vector DB   │    │  Language Q  │
                    └──────────────┘    └──────────────┘
```

### LangChain + Neo4j
```python
from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain
from langchain_openai import ChatOpenAI

# Connect to graph
graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password"
)

# Create QA chain
chain = GraphCypherQAChain.from_llm(
    ChatOpenAI(temperature=0),
    graph=graph,
    verbose=True
)

# Natural language query
result = chain.run("Who are the top customers by order volume?")
```

### LlamaIndex Knowledge Graph
```python
from llama_index.core import KnowledgeGraphIndex
from llama_index.graph_stores.neo4j import Neo4jGraphStore

# Setup graph store
graph_store = Neo4jGraphStore(
    username="neo4j",
    password="password",
    url="bolt://localhost:7687"
)

# Build index from documents
index = KnowledgeGraphIndex.from_documents(
    documents,
    graph_store=graph_store,
    max_triplets_per_chunk=10
)

# Query with natural language
query_engine = index.as_query_engine()
response = query_engine.query("What products does Acme Corp order?")
```

## Hybrid Storage Pattern

Combine multiple storage types:

```
┌─────────────────────────────────────────────────────────────┐
│                    HYBRID ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐       │
│  │ PostgreSQL  │   │   Neo4j     │   │  Qdrant     │       │
│  │ (OLTP)      │   │ (Graph)     │   │ (Vector)    │       │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘       │
│         │                 │                 │               │
│         └────────────┬────┴────────────────┘               │
│                      ▼                                      │
│              ┌──────────────┐                              │
│              │ Unified API  │                              │
│              │ (TypeScript) │                              │
│              └──────────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

```typescript
class HybridOntologyStore {
  private postgres: PrismaClient;
  private neo4j: Driver;
  private qdrant: QdrantClient;
  
  async query(question: string): Promise<Answer> {
    // 1. Vector search for relevant entities
    const relevantDocs = await this.qdrant.search(question);
    
    // 2. Graph traversal for relationships
    const graph = await this.neo4j.run(`
      MATCH (n)-[r*1..2]-(m) 
      WHERE n.id IN $ids 
      RETURN n, r, m
    `, { ids: relevantDocs.map(d => d.id) });
    
    // 3. Get operational data from PostgreSQL
    const data = await this.postgres.customer.findMany({
      where: { id: { in: relevantDocs.map(d => d.id) } }
    });
    
    return this.synthesize(graph, data);
  }
}
```

## Selection Guide

| Use Case | Recommended Storage |
|----------|---------------------|
| CRUD operations | PostgreSQL/MySQL |
| Social networks | Neo4j |
| Fraud detection | TigerGraph |
| Semantic reasoning | Apache Jena/Stardog |
| AI-powered search | GraphRAG (Neo4j + LangChain) |
| Real-time analytics | TimescaleDB + Neo4j |

## See Also

- `/skill ontology` - Ontology overview
- `/skill ontology-traditional` - Triple store patterns
- `/skill ontology-palantir` - Operational DB patterns
- `/agent ultra-ontology` - Hybrid ontology design
