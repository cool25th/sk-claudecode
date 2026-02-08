---
name: ontology-traditional
description: Traditional semantic web ontology patterns (OWL, RDF, RDFS)
---

# Traditional Ontology (Semantic Web)

Classical ontology approaches based on W3C standards for formal knowledge representation and automated reasoning.

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Data Model | **RDF** (Resource Description Framework) | Triple-based graph data |
| Schema | **RDFS** (RDF Schema) | Classes, properties, hierarchy |
| Ontology | **OWL** (Web Ontology Language) | Rich semantics, reasoning |
| Query | **SPARQL** | Graph query language |
| Storage | **Triple Store** | Graph database (Jena, Virtuoso) |

## RDF - Triple Model

Everything is represented as Subject-Predicate-Object triples:

```turtle
# Turtle syntax
@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

ex:John rdf:type ex:Person .
ex:John ex:hasName "John Doe" .
ex:John ex:worksFor ex:AcmeCorp .
ex:AcmeCorp rdf:type ex:Organization .
```

### Triple Structure
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Subject   │────▶│  Predicate  │────▶│   Object    │
│   (URI)     │     │   (URI)     │     │ (URI/Lit)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

## RDFS - Schema Definition

```turtle
# Define classes
ex:Person rdf:type rdfs:Class .
ex:Employee rdfs:subClassOf ex:Person .

# Define properties
ex:worksFor rdf:type rdf:Property .
ex:worksFor rdfs:domain ex:Person .
ex:worksFor rdfs:range ex:Organization .
```

### Class Hierarchy
```
       Thing
         │
    ┌────┴────┐
    │         │
  Person   Organization
    │
 Employee
```

## OWL - Rich Semantics

### Class Axioms
```turtle
@prefix owl: <http://www.w3.org/2002/07/owl#> .

# Equivalent classes
ex:Human owl:equivalentClass ex:Person .

# Disjoint classes
ex:Cat owl:disjointWith ex:Dog .

# Class restrictions
ex:Parent owl:equivalentClass [
  rdf:type owl:Restriction ;
  owl:onProperty ex:hasChild ;
  owl:minCardinality 1
] .
```

### Property Characteristics
```turtle
# Inverse properties
ex:hasChild owl:inverseOf ex:hasParent .

# Transitive property
ex:hasAncestor rdf:type owl:TransitiveProperty .

# Functional property (single value)
ex:hasBirthDate rdf:type owl:FunctionalProperty .

# Symmetric property
ex:isSiblingOf rdf:type owl:SymmetricProperty .
```

## SPARQL Queries

```sparql
# Find all employees and their employers
SELECT ?person ?name ?company
WHERE {
  ?person rdf:type ex:Employee .
  ?person ex:hasName ?name .
  ?person ex:worksFor ?company .
}
ORDER BY ?name

# Inference query - find all ancestors
SELECT ?ancestor
WHERE {
  ex:John ex:hasAncestor+ ?ancestor .
}
```

## Reasoning & Inference

Traditional ontologies enable **automated reasoning**:

### Types of Inference
```
Given:
  - John is a Person
  - Person subClassOf Agent
  
Infer:
  - John is an Agent

Given:
  - hasParent inverse of hasChild
  - John hasChild Mary
  
Infer:
  - Mary hasParent John
```

### Consistency Checking
```
Check:
  - No individual belongs to disjoint classes
  - Cardinality constraints satisfied
  - Domain/range constraints respected
```

## Key Characteristics

| Aspect | Description |
|--------|-------------|
| **Purpose** | Knowledge representation & reasoning |
| **Focus** | Semantic classification |
| **Inference** | Automated logical deduction |
| **Openness** | Open World Assumption |
| **Storage** | Triple stores (graph databases) |
| **Standards** | W3C (RDF, RDFS, OWL, SPARQL) |

## Use Cases

- Knowledge graphs
- Semantic search
- Data integration across heterogeneous sources
- Biomedical ontologies (SNOMED, Gene Ontology)
- Library/taxonomies

## Limitations

- ❌ Not designed for operational actions
- ❌ Complex reasoning can be slow
- ❌ Steep learning curve
- ❌ No built-in action/mutation semantics

## Comparison with Palantir

| Traditional | Palantir |
|-------------|----------|
| Knowledge representation | Operational execution |
| Open World Assumption | Closed World (enterprise data) |
| Triple stores | Integrated data platform |
| SPARQL queries | TypeScript SDK |
| Inference/reasoning | Actions/Functions |

## See Also

- `/skill ontology-palantir` - Palantir operational ontology
- `/skill ontology` - General ontology overview

---

## Related Agents

- `ontology-developer` - Ontology implementation (Sonnet)
