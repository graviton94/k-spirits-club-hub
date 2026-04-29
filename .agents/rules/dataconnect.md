# Scoped Rule: Data Connect

Activation scope:
- `dataconnect/**/*.gql`
- `lib/db/data-connect-client.ts`
- `app/api/**/*.ts`
- `app/[lang]/**/*.ts`

When active, enforce:
1. Data access via Firebase Data Connect only.
2. Canonical API catalog:
- `lib/db/data-connect-client.ts`
- `dataconnect/main/queries.gql`
- `dataconnect/main/mutations.gql`
- `dataconnect/schema/schema.gql`
3. No raw SQL in runtime/app code.
4. No alternate DB client introduction.
5. No manual edits in generated SDK artifacts.
6. For GraphQL changes, follow workflow in `dataconnect_workflow.md`:
- generate SDK
- update typed wrappers
- deploy with `npx -y firebase-tools@latest deploy --only dataconnect -f`

Validation hints:
- Ensure `where` clauses do not mix raw fields and `_or` at top-level; wrap with `_and` when needed.
- Verify auth directives are present and least-privilege.
