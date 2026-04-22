# Mandatory Data Connect Workflow

Any modification to the data layer (Queries, Mutations, or Schema) MUST follow this strict sequence to ensure system consistency and zero-error deployments.

## 🔄 The "Golden Chain" Workflow

1.  **[GQL] Modification**
    - Update `dataconnect/main/queries.gql` or `mutations.gql`.
    - Ensure complex filters are wrapped in `_and` blocks (See: [strict_prohibited_actions](file:///c:/k-spirits-club-hub/.agents/rules/strict_prohibited_actions.md)).

2.  **[SDK] Local Validation & Generation**
    - Run: `npx firebase dataconnect:sdk:generate`
    - Verify that no validation errors occur in the terminal.

3.  **[CLIENT] Data Connect Client Update**
    - Update `lib/db/data-connect-client.ts` to export new wrappers if needed.
    - Check for TypeScript lint errors in files that import `data-connect-client`.

4.  **[PROD] Cloud Deployment**
    - Run: `npx -y firebase-tools@latest deploy --only dataconnect -f`
    - **IMPORTANT**: Do NOT finish a task without checking if a `dataconnect:deploy` is needed.
    - If queries or mutations were changed/added, they MUST be deployed to the cloud.
    - **VERIFIED COMMAND**: `npx -y firebase-tools@latest deploy --only dataconnect -f`
    - **FORBIDDEN COMMANDS**: `npx firebase dataconnect:deploy`, `npx firebase-tools dataconnect:deploy`. (These fail in this environment).
    - Use the `-f` (force) flag to handle SQL schema migrations and bypass interactive prompts.
    - **MANDATORY**: This must be done every time a query/mutation is modified to ensure the live API matches the local code.

## 🚀 Deployment Command
Always use the following for production-ready updates:
```bash
```
