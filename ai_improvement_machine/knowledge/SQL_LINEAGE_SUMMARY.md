# SQLLineage Knowledge Base

## Core Command
```bash
sqllineage -f query.sql -l column
```

## Key Capabilities for K-Spirits
- **Relational Integrity**: Tracks how `SpiritID` flows through `Reviews` -> `UserStats`.
- **Wildcard Expansion**: Resolves `SELECT *` if `sqlalchemy` metadata is linked.
- **Lineage Visualization**: `-g` -> Starts a webserver with a DAG of your data flow.

## Audit Workflow
- **Step 1**: Capture Raw SQL from Firebase Data Connect logs or generated types.
- **Step 2**: Run `sqllineage` to identify `Source Tables` vs `Intermediate Tables`.
- **Step 3**: Verify no orphaned data paths exist before performing schema migrations.

## Integration Tip
- Use it to verify that `incrementUserReviews` correctly depends on the `userId` from the `SpiritReview` insert statement.
