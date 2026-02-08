---
name: ontology-palantir
description: Palantir Foundry operational ontology patterns (kinetic + semantic)
---

# Palantir Operational Ontology

Palantir's unique approach combining semantic layer with kinetic (action-oriented) elements for enterprise operations.

## Philosophy: Digital Twin

> "The Ontology is a digital twin of your organization"

Unlike traditional ontologies focused on knowledge representation, Palantir ontology is designed for:
- **Operational decision-making**
- **Real-time actions**
- **Enterprise-wide integration**

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PALANTIR ONTOLOGY                        │
├───────────────────────────┬─────────────────────────────────┤
│      SEMANTIC LAYER       │         KINETIC LAYER           │
│  (What exists)            │  (What can happen)              │
├───────────────────────────┼─────────────────────────────────┤
│  • Object Types           │  • Actions                      │
│  • Properties             │  • Functions                    │
│  • Links                  │  • Workflows                    │
│  • Derived Properties     │  • Dynamic Security             │
└───────────────────────────┴─────────────────────────────────┘
           ↑                              ↑
┌──────────┴──────────────────────────────┴────────────────────┐
│              INTEGRATED DATA SOURCES                         │
│  Datasets │ Virtual Tables │ ML Models │ External APIs      │
└─────────────────────────────────────────────────────────────┘
```

## Semantic Layer

### Object Types
Real-world entities with typed properties:

```typescript
// Object Type definition
interface Flight {
  flightId: string;           // Primary key
  flightNumber: string;
  departureTime: Timestamp;
  arrivalTime: Timestamp;
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled';
  
  // Computed/Derived properties
  duration: Duration;         // Computed from times
  delayMinutes: number;       // Computed from actual vs scheduled
}
```

### Links (Relationships)
```typescript
// Explicit relationship modeling
Flight.links = {
  aircraft: Link<Aircraft>,           // Many-to-one
  passengers: LinkSet<Passenger>,     // One-to-many
  crew: LinkSet<CrewMember>,          // Many-to-many
  departureAirport: Link<Airport>,
  arrivalAirport: Link<Airport>
};
```

### Derived Properties
Properties computed on-the-fly:
```typescript
// Derived from other properties/links
derived passengerCount: number = this.passengers.count();
derived loadFactor: number = this.passengers.count() / this.aircraft.capacity;
derived isDelayed: boolean = this.delayMinutes > 15;
```

## Kinetic Layer

The key differentiator from traditional ontologies - **actions that change state**.

### Actions
Transactional operations with validation:

```typescript
@Action()
async boardPassenger(
  flight: Flight,
  passenger: Passenger,
  seatNumber: string
): Promise<BoardingResult> {
  // Validation
  if (flight.status !== 'boarding') {
    throw new ValidationError('Flight not boarding');
  }
  if (await this.isSeatOccupied(flight, seatNumber)) {
    throw new ValidationError('Seat already occupied');
  }
  
  // Effects
  await passenger.update({ boardedFlight: flight, seat: seatNumber });
  await flight.passengers.add(passenger);
  
  // Emit event for downstream systems
  await Events.emit('passenger.boarded', { flight, passenger, seat: seatNumber });
  
  return { success: true, boardingPass: generateBoardingPass(passenger, flight) };
}
```

### Functions
Reusable business logic:

```typescript
@Function()
async calculateFlightRisk(flight: Flight): Promise<RiskAssessment> {
  const factors = {
    weatherScore: await this.getWeatherRisk(flight),
    maintenanceScore: await this.getMaintenanceStatus(flight.aircraft),
    crewFatigueScore: await this.assessCrewFatigue(flight.crew),
    historicalDelayRate: await this.getRouteDelayRate(flight)
  };
  
  return {
    overallRisk: this.combineRiskFactors(factors),
    breakdown: factors,
    recommendations: this.generateRecommendations(factors)
  };
}
```

### Workflows
Multi-step processes:

```typescript
@Workflow()
async flightDepartureProcess(flight: Flight): Promise<void> {
  // Step 1: Final passenger count
  const manifest = await this.finalizeManifest(flight);
  
  // Step 2: Weight and balance
  const wb = await this.calculateWeightBalance(flight, manifest);
  if (!wb.isWithinLimits) throw new SafetyError('Weight out of limits');
  
  // Step 3: Crew briefing complete
  await this.verifyCrew Briefing(flight);
  
  // Step 4: ATC clearance
  await this.requestDepartureClearance(flight);
  
  // Step 5: Update status
  await flight.update({ status: 'departed', actualDepartureTime: now() });
}
```

## TypeScript SDK (OSDK)

Type-safe access to ontology:

```typescript
import { Ontology } from '@palantir/osdk';

// Query objects
const activeFlights = await ontology.objects.Flight
  .where({ status: { in: ['scheduled', 'boarding'] } })
  .where(f => f.departureTime.between(now(), hoursFromNow(24)))
  .orderBy('departureTime', 'asc')
  .take(100)
  .all();

// Traverse links
for (const flight of activeFlights) {
  const aircraft = await flight.aircraft.get();
  const passengers = await flight.passengers.all();
  
  console.log(`${flight.flightNumber}: ${passengers.length} pax on ${aircraft.model}`);
}

// Execute action
await ontology.actions.boardPassenger.apply({
  flight: selectedFlight,
  passenger: selectedPassenger,
  seatNumber: '14A'
});
```

## Key Characteristics

| Aspect | Palantir Approach |
|--------|-------------------|
| **Purpose** | Operational execution & decision-making |
| **Focus** | Actions that change real-world state |
| **Inference** | Minimal - explicit business logic |
| **Assumption** | Closed World (enterprise data is complete) |
| **Storage** | Integrated platform (Foundry) |
| **Access** | TypeScript SDK, REST APIs |

## Comparison with Traditional

| Aspect | Traditional (OWL/RDF) | Palantir |
|--------|----------------------|----------|
| Goal | Knowledge representation | Operational execution |
| Core Unit | Triple (S-P-O) | Object + Action |
| Query | SPARQL | TypeScript SDK |
| Mutation | Not built-in | First-class Actions |
| Inference | Automated reasoning | Explicit Functions |
| Real-time | Not designed for | Core capability |

## When to Use Palantir Style

✅ Enterprise operations needing real-time decisions
✅ Systems requiring transactional state changes
✅ Integration with operational workflows
✅ Building user-facing applications
✅ AI/ML model operationalization

## When to Use Traditional

✅ Pure knowledge representation
✅ Academic/research knowledge graphs
✅ Systems needing automated reasoning
✅ Open data integration
✅ Semantic web applications

## See Also

- `/skill ontology-traditional` - Traditional OWL/RDF approach
- `/skill ontology-actions` - Detailed action patterns
- `/skill ontology-functions` - Function development

---

## Related Agents

- `ontology-developer` - Ontology implementation (Sonnet)
- `ontology-expert` - Ontology architecture (Opus)
