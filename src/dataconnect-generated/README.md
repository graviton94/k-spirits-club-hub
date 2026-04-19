# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `main`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*listSpirits*](#listspirits)
  - [*listNewArrivals*](#listnewarrivals)
  - [*getSpirit*](#getspirit)
  - [*adminListRawSpirits*](#adminlistrawspirits)
  - [*getUserProfile*](#getuserprofile)
  - [*listNewsArticles*](#listnewsarticles)
  - [*getNewsArticle*](#getnewsarticle)
  - [*auditAllUsers*](#auditallusers)
  - [*auditAllNews*](#auditallnews)
  - [*auditAllSpirits*](#auditallspirits)
  - [*auditAllReviews*](#auditallreviews)
  - [*listSpiritReviews*](#listspiritreviews)
  - [*getSpiritReviewsCount*](#getspiritreviewscount)
  - [*listSpiritsForSitemap*](#listspiritsforsitemap)
  - [*getWorldCupResult*](#getworldcupresult)
  - [*listSpiritsForWorldCup*](#listspiritsforworldcup)
- [**Mutations**](#mutations)
  - [*upsertUser*](#upsertuser)
  - [*upsertSpirit*](#upsertspirit)
  - [*upsertReview*](#upsertreview)
  - [*upsertNews*](#upsertnews)
  - [*upsertCabinet*](#upsertcabinet)
  - [*upsertModificationRequest*](#upsertmodificationrequest)
  - [*upsertWorldCupResult*](#upsertworldcupresult)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `main`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@k-spirits/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@k-spirits/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@k-spirits/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `main` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## listSpirits
You can execute the `listSpirits` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSpirits(vars?: ListSpiritsVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritsData, ListSpiritsVariables>;

interface ListSpiritsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListSpiritsVariables): QueryRef<ListSpiritsData, ListSpiritsVariables>;
}
export const listSpiritsRef: ListSpiritsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSpirits(dc: DataConnect, vars?: ListSpiritsVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritsData, ListSpiritsVariables>;

interface ListSpiritsRef {
  ...
  (dc: DataConnect, vars?: ListSpiritsVariables): QueryRef<ListSpiritsData, ListSpiritsVariables>;
}
export const listSpiritsRef: ListSpiritsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSpiritsRef:
```typescript
const name = listSpiritsRef.operationName;
console.log(name);
```

### Variables
The `listSpirits` query has an optional argument of type `ListSpiritsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListSpiritsVariables {
  category?: string | null;
}
```
### Return Type
Recall that executing the `listSpirits` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSpiritsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSpiritsData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    category: string;
    categoryEn?: string | null;
    imageUrl: string;
    isPublished?: boolean | null;
    abv?: number | null;
    distillery?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
  } & Spirit_Key)[];
}
```
### Using `listSpirits`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSpirits, ListSpiritsVariables } from '@k-spirits/dataconnect';

// The `listSpirits` query has an optional argument of type `ListSpiritsVariables`:
const listSpiritsVars: ListSpiritsVariables = {
  category: ..., // optional
};

// Call the `listSpirits()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSpirits(listSpiritsVars);
// Variables can be defined inline as well.
const { data } = await listSpirits({ category: ..., });
// Since all variables are optional for this query, you can omit the `ListSpiritsVariables` argument.
const { data } = await listSpirits();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSpirits(dataConnect, listSpiritsVars);

console.log(data.spirits);

// Or, you can use the `Promise` API.
listSpirits(listSpiritsVars).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

### Using `listSpirits`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSpiritsRef, ListSpiritsVariables } from '@k-spirits/dataconnect';

// The `listSpirits` query has an optional argument of type `ListSpiritsVariables`:
const listSpiritsVars: ListSpiritsVariables = {
  category: ..., // optional
};

// Call the `listSpiritsRef()` function to get a reference to the query.
const ref = listSpiritsRef(listSpiritsVars);
// Variables can be defined inline as well.
const ref = listSpiritsRef({ category: ..., });
// Since all variables are optional for this query, you can omit the `ListSpiritsVariables` argument.
const ref = listSpiritsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSpiritsRef(dataConnect, listSpiritsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.spirits);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

## listNewArrivals
You can execute the `listNewArrivals` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listNewArrivals(vars?: ListNewArrivalsVariables, options?: ExecuteQueryOptions): QueryPromise<ListNewArrivalsData, ListNewArrivalsVariables>;

interface ListNewArrivalsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListNewArrivalsVariables): QueryRef<ListNewArrivalsData, ListNewArrivalsVariables>;
}
export const listNewArrivalsRef: ListNewArrivalsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listNewArrivals(dc: DataConnect, vars?: ListNewArrivalsVariables, options?: ExecuteQueryOptions): QueryPromise<ListNewArrivalsData, ListNewArrivalsVariables>;

interface ListNewArrivalsRef {
  ...
  (dc: DataConnect, vars?: ListNewArrivalsVariables): QueryRef<ListNewArrivalsData, ListNewArrivalsVariables>;
}
export const listNewArrivalsRef: ListNewArrivalsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listNewArrivalsRef:
```typescript
const name = listNewArrivalsRef.operationName;
console.log(name);
```

### Variables
The `listNewArrivals` query has an optional argument of type `ListNewArrivalsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListNewArrivalsVariables {
  limit?: number | null;
}
```
### Return Type
Recall that executing the `listNewArrivals` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListNewArrivalsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListNewArrivalsData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    imageUrl: string;
    category: string;
    categoryEn?: string | null;
    country?: string | null;
    abv?: number | null;
    distillery?: string | null;
    descriptionKo?: string | null;
    descriptionEn?: string | null;
    updatedAt: TimestampString;
    createdAt: TimestampString;
  } & Spirit_Key)[];
}
```
### Using `listNewArrivals`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listNewArrivals, ListNewArrivalsVariables } from '@k-spirits/dataconnect';

// The `listNewArrivals` query has an optional argument of type `ListNewArrivalsVariables`:
const listNewArrivalsVars: ListNewArrivalsVariables = {
  limit: ..., // optional
};

// Call the `listNewArrivals()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listNewArrivals(listNewArrivalsVars);
// Variables can be defined inline as well.
const { data } = await listNewArrivals({ limit: ..., });
// Since all variables are optional for this query, you can omit the `ListNewArrivalsVariables` argument.
const { data } = await listNewArrivals();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listNewArrivals(dataConnect, listNewArrivalsVars);

console.log(data.spirits);

// Or, you can use the `Promise` API.
listNewArrivals(listNewArrivalsVars).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

### Using `listNewArrivals`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listNewArrivalsRef, ListNewArrivalsVariables } from '@k-spirits/dataconnect';

// The `listNewArrivals` query has an optional argument of type `ListNewArrivalsVariables`:
const listNewArrivalsVars: ListNewArrivalsVariables = {
  limit: ..., // optional
};

// Call the `listNewArrivalsRef()` function to get a reference to the query.
const ref = listNewArrivalsRef(listNewArrivalsVars);
// Variables can be defined inline as well.
const ref = listNewArrivalsRef({ limit: ..., });
// Since all variables are optional for this query, you can omit the `ListNewArrivalsVariables` argument.
const ref = listNewArrivalsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listNewArrivalsRef(dataConnect, listNewArrivalsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.spirits);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

## getSpirit
You can execute the `getSpirit` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getSpirit(vars: GetSpiritVariables, options?: ExecuteQueryOptions): QueryPromise<GetSpiritData, GetSpiritVariables>;

interface GetSpiritRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSpiritVariables): QueryRef<GetSpiritData, GetSpiritVariables>;
}
export const getSpiritRef: GetSpiritRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSpirit(dc: DataConnect, vars: GetSpiritVariables, options?: ExecuteQueryOptions): QueryPromise<GetSpiritData, GetSpiritVariables>;

interface GetSpiritRef {
  ...
  (dc: DataConnect, vars: GetSpiritVariables): QueryRef<GetSpiritData, GetSpiritVariables>;
}
export const getSpiritRef: GetSpiritRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSpiritRef:
```typescript
const name = getSpiritRef.operationName;
console.log(name);
```

### Variables
The `getSpirit` query requires an argument of type `GetSpiritVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSpiritVariables {
  id: string;
}
```
### Return Type
Recall that executing the `getSpirit` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSpiritData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSpiritData {
  spirit?: {
    id: string;
    name: string;
    nameEn?: string | null;
    category: string;
    categoryEn?: string | null;
    mainCategory?: string | null;
    subcategory?: string | null;
    distillery?: string | null;
    bottler?: string | null;
    abv?: number | null;
    volume?: number | null;
    country?: string | null;
    region?: string | null;
    imageUrl: string;
    thumbnailUrl?: string | null;
    descriptionKo?: string | null;
    descriptionEn?: string | null;
    pairingGuideKo?: string | null;
    pairingGuideEn?: string | null;
    noseTags?: string[] | null;
    palateTags?: string[] | null;
    finishTags?: string[] | null;
    tastingNote?: string | null;
    status?: string | null;
    isPublished?: boolean | null;
    isReviewed?: boolean | null;
    rating?: number | null;
    reviewCount?: number | null;
    metadata?: unknown | null;
    reviews: ({
      id: UUIDString;
      rating: number;
      content: string;
      nose?: string | null;
      palate?: string | null;
      finish?: string | null;
      likedBy?: string[] | null;
      imageUrls?: string[] | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
      user: {
        nickname?: string | null;
        profileImage?: string | null;
        role?: string | null;
      };
    } & SpiritReview_Key)[];
  } & Spirit_Key;
}
```
### Using `getSpirit`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSpirit, GetSpiritVariables } from '@k-spirits/dataconnect';

// The `getSpirit` query requires an argument of type `GetSpiritVariables`:
const getSpiritVars: GetSpiritVariables = {
  id: ..., 
};

// Call the `getSpirit()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSpirit(getSpiritVars);
// Variables can be defined inline as well.
const { data } = await getSpirit({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSpirit(dataConnect, getSpiritVars);

console.log(data.spirit);

// Or, you can use the `Promise` API.
getSpirit(getSpiritVars).then((response) => {
  const data = response.data;
  console.log(data.spirit);
});
```

### Using `getSpirit`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSpiritRef, GetSpiritVariables } from '@k-spirits/dataconnect';

// The `getSpirit` query requires an argument of type `GetSpiritVariables`:
const getSpiritVars: GetSpiritVariables = {
  id: ..., 
};

// Call the `getSpiritRef()` function to get a reference to the query.
const ref = getSpiritRef(getSpiritVars);
// Variables can be defined inline as well.
const ref = getSpiritRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSpiritRef(dataConnect, getSpiritVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.spirit);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.spirit);
});
```

## adminListRawSpirits
You can execute the `adminListRawSpirits` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminListRawSpirits(vars?: AdminListRawSpiritsVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListRawSpiritsData, AdminListRawSpiritsVariables>;

interface AdminListRawSpiritsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: AdminListRawSpiritsVariables): QueryRef<AdminListRawSpiritsData, AdminListRawSpiritsVariables>;
}
export const adminListRawSpiritsRef: AdminListRawSpiritsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListRawSpirits(dc: DataConnect, vars?: AdminListRawSpiritsVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListRawSpiritsData, AdminListRawSpiritsVariables>;

interface AdminListRawSpiritsRef {
  ...
  (dc: DataConnect, vars?: AdminListRawSpiritsVariables): QueryRef<AdminListRawSpiritsData, AdminListRawSpiritsVariables>;
}
export const adminListRawSpiritsRef: AdminListRawSpiritsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListRawSpiritsRef:
```typescript
const name = adminListRawSpiritsRef.operationName;
console.log(name);
```

### Variables
The `adminListRawSpirits` query has an optional argument of type `AdminListRawSpiritsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminListRawSpiritsVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `adminListRawSpirits` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListRawSpiritsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListRawSpiritsData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    category: string;
    categoryEn?: string | null;
    isPublished?: boolean | null;
    status?: string | null;
    updatedAt: TimestampString;
  } & Spirit_Key)[];
}
```
### Using `adminListRawSpirits`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListRawSpirits, AdminListRawSpiritsVariables } from '@k-spirits/dataconnect';

// The `adminListRawSpirits` query has an optional argument of type `AdminListRawSpiritsVariables`:
const adminListRawSpiritsVars: AdminListRawSpiritsVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `adminListRawSpirits()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListRawSpirits(adminListRawSpiritsVars);
// Variables can be defined inline as well.
const { data } = await adminListRawSpirits({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `AdminListRawSpiritsVariables` argument.
const { data } = await adminListRawSpirits();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListRawSpirits(dataConnect, adminListRawSpiritsVars);

console.log(data.spirits);

// Or, you can use the `Promise` API.
adminListRawSpirits(adminListRawSpiritsVars).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

### Using `adminListRawSpirits`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListRawSpiritsRef, AdminListRawSpiritsVariables } from '@k-spirits/dataconnect';

// The `adminListRawSpirits` query has an optional argument of type `AdminListRawSpiritsVariables`:
const adminListRawSpiritsVars: AdminListRawSpiritsVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `adminListRawSpiritsRef()` function to get a reference to the query.
const ref = adminListRawSpiritsRef(adminListRawSpiritsVars);
// Variables can be defined inline as well.
const ref = adminListRawSpiritsRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `AdminListRawSpiritsVariables` argument.
const ref = adminListRawSpiritsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListRawSpiritsRef(dataConnect, adminListRawSpiritsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.spirits);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

## getUserProfile
You can execute the `getUserProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserProfile(vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface GetUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
}
export const getUserProfileRef: GetUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface GetUserProfileRef {
  ...
  (dc: DataConnect, vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
}
export const getUserProfileRef: GetUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserProfileRef:
```typescript
const name = getUserProfileRef.operationName;
console.log(name);
```

### Variables
The `getUserProfile` query requires an argument of type `GetUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserProfileVariables {
  id: string;
}
```
### Return Type
Recall that executing the `getUserProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserProfileData {
  user?: {
    id: string;
    nickname?: string | null;
    email?: string | null;
    profileImage?: string | null;
    role?: string | null;
    themePreference?: string | null;
    isFirstLogin?: boolean | null;
    reviewsWritten?: number | null;
    heartsReceived?: number | null;
  } & User_Key;
}
```
### Using `getUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProfile, GetUserProfileVariables } from '@k-spirits/dataconnect';

// The `getUserProfile` query requires an argument of type `GetUserProfileVariables`:
const getUserProfileVars: GetUserProfileVariables = {
  id: ..., 
};

// Call the `getUserProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserProfile(getUserProfileVars);
// Variables can be defined inline as well.
const { data } = await getUserProfile({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserProfile(dataConnect, getUserProfileVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserProfile(getUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `getUserProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserProfileRef, GetUserProfileVariables } from '@k-spirits/dataconnect';

// The `getUserProfile` query requires an argument of type `GetUserProfileVariables`:
const getUserProfileVars: GetUserProfileVariables = {
  id: ..., 
};

// Call the `getUserProfileRef()` function to get a reference to the query.
const ref = getUserProfileRef(getUserProfileVars);
// Variables can be defined inline as well.
const ref = getUserProfileRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserProfileRef(dataConnect, getUserProfileVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## listNewsArticles
You can execute the `listNewsArticles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listNewsArticles(vars?: ListNewsArticlesVariables, options?: ExecuteQueryOptions): QueryPromise<ListNewsArticlesData, ListNewsArticlesVariables>;

interface ListNewsArticlesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListNewsArticlesVariables): QueryRef<ListNewsArticlesData, ListNewsArticlesVariables>;
}
export const listNewsArticlesRef: ListNewsArticlesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listNewsArticles(dc: DataConnect, vars?: ListNewsArticlesVariables, options?: ExecuteQueryOptions): QueryPromise<ListNewsArticlesData, ListNewsArticlesVariables>;

interface ListNewsArticlesRef {
  ...
  (dc: DataConnect, vars?: ListNewsArticlesVariables): QueryRef<ListNewsArticlesData, ListNewsArticlesVariables>;
}
export const listNewsArticlesRef: ListNewsArticlesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listNewsArticlesRef:
```typescript
const name = listNewsArticlesRef.operationName;
console.log(name);
```

### Variables
The `listNewsArticles` query has an optional argument of type `ListNewsArticlesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListNewsArticlesVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `listNewsArticles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListNewsArticlesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListNewsArticlesData {
  newsArticles: ({
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
    category?: string | null;
    source?: string | null;
    link?: string | null;
    date?: string | null;
    translations?: unknown | null;
    tags?: string[] | null;
    createdAt?: TimestampString | null;
  } & NewsArticle_Key)[];
}
```
### Using `listNewsArticles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listNewsArticles, ListNewsArticlesVariables } from '@k-spirits/dataconnect';

// The `listNewsArticles` query has an optional argument of type `ListNewsArticlesVariables`:
const listNewsArticlesVars: ListNewsArticlesVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `listNewsArticles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listNewsArticles(listNewsArticlesVars);
// Variables can be defined inline as well.
const { data } = await listNewsArticles({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `ListNewsArticlesVariables` argument.
const { data } = await listNewsArticles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listNewsArticles(dataConnect, listNewsArticlesVars);

console.log(data.newsArticles);

// Or, you can use the `Promise` API.
listNewsArticles(listNewsArticlesVars).then((response) => {
  const data = response.data;
  console.log(data.newsArticles);
});
```

### Using `listNewsArticles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listNewsArticlesRef, ListNewsArticlesVariables } from '@k-spirits/dataconnect';

// The `listNewsArticles` query has an optional argument of type `ListNewsArticlesVariables`:
const listNewsArticlesVars: ListNewsArticlesVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `listNewsArticlesRef()` function to get a reference to the query.
const ref = listNewsArticlesRef(listNewsArticlesVars);
// Variables can be defined inline as well.
const ref = listNewsArticlesRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `ListNewsArticlesVariables` argument.
const ref = listNewsArticlesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listNewsArticlesRef(dataConnect, listNewsArticlesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.newsArticles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.newsArticles);
});
```

## getNewsArticle
You can execute the `getNewsArticle` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getNewsArticle(vars: GetNewsArticleVariables, options?: ExecuteQueryOptions): QueryPromise<GetNewsArticleData, GetNewsArticleVariables>;

interface GetNewsArticleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNewsArticleVariables): QueryRef<GetNewsArticleData, GetNewsArticleVariables>;
}
export const getNewsArticleRef: GetNewsArticleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getNewsArticle(dc: DataConnect, vars: GetNewsArticleVariables, options?: ExecuteQueryOptions): QueryPromise<GetNewsArticleData, GetNewsArticleVariables>;

interface GetNewsArticleRef {
  ...
  (dc: DataConnect, vars: GetNewsArticleVariables): QueryRef<GetNewsArticleData, GetNewsArticleVariables>;
}
export const getNewsArticleRef: GetNewsArticleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getNewsArticleRef:
```typescript
const name = getNewsArticleRef.operationName;
console.log(name);
```

### Variables
The `getNewsArticle` query requires an argument of type `GetNewsArticleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetNewsArticleVariables {
  id: string;
}
```
### Return Type
Recall that executing the `getNewsArticle` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetNewsArticleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetNewsArticleData {
  newsArticle?: {
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
    category?: string | null;
    source?: string | null;
    link?: string | null;
    date?: string | null;
    translations?: unknown | null;
    tags?: string[] | null;
    createdAt?: TimestampString | null;
  } & NewsArticle_Key;
}
```
### Using `getNewsArticle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getNewsArticle, GetNewsArticleVariables } from '@k-spirits/dataconnect';

// The `getNewsArticle` query requires an argument of type `GetNewsArticleVariables`:
const getNewsArticleVars: GetNewsArticleVariables = {
  id: ..., 
};

// Call the `getNewsArticle()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getNewsArticle(getNewsArticleVars);
// Variables can be defined inline as well.
const { data } = await getNewsArticle({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getNewsArticle(dataConnect, getNewsArticleVars);

console.log(data.newsArticle);

// Or, you can use the `Promise` API.
getNewsArticle(getNewsArticleVars).then((response) => {
  const data = response.data;
  console.log(data.newsArticle);
});
```

### Using `getNewsArticle`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getNewsArticleRef, GetNewsArticleVariables } from '@k-spirits/dataconnect';

// The `getNewsArticle` query requires an argument of type `GetNewsArticleVariables`:
const getNewsArticleVars: GetNewsArticleVariables = {
  id: ..., 
};

// Call the `getNewsArticleRef()` function to get a reference to the query.
const ref = getNewsArticleRef(getNewsArticleVars);
// Variables can be defined inline as well.
const ref = getNewsArticleRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getNewsArticleRef(dataConnect, getNewsArticleVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.newsArticle);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.newsArticle);
});
```

## auditAllUsers
You can execute the `auditAllUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
auditAllUsers(options?: ExecuteQueryOptions): QueryPromise<AuditAllUsersData, undefined>;

interface AuditAllUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AuditAllUsersData, undefined>;
}
export const auditAllUsersRef: AuditAllUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
auditAllUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AuditAllUsersData, undefined>;

interface AuditAllUsersRef {
  ...
  (dc: DataConnect): QueryRef<AuditAllUsersData, undefined>;
}
export const auditAllUsersRef: AuditAllUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the auditAllUsersRef:
```typescript
const name = auditAllUsersRef.operationName;
console.log(name);
```

### Variables
The `auditAllUsers` query has no variables.
### Return Type
Recall that executing the `auditAllUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AuditAllUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AuditAllUsersData {
  users: ({
    id: string;
    nickname?: string | null;
    role?: string | null;
    isFirstLogin?: boolean | null;
  } & User_Key)[];
}
```
### Using `auditAllUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, auditAllUsers } from '@k-spirits/dataconnect';


// Call the `auditAllUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await auditAllUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await auditAllUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
auditAllUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `auditAllUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, auditAllUsersRef } from '@k-spirits/dataconnect';


// Call the `auditAllUsersRef()` function to get a reference to the query.
const ref = auditAllUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = auditAllUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## auditAllNews
You can execute the `auditAllNews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
auditAllNews(options?: ExecuteQueryOptions): QueryPromise<AuditAllNewsData, undefined>;

interface AuditAllNewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AuditAllNewsData, undefined>;
}
export const auditAllNewsRef: AuditAllNewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
auditAllNews(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AuditAllNewsData, undefined>;

interface AuditAllNewsRef {
  ...
  (dc: DataConnect): QueryRef<AuditAllNewsData, undefined>;
}
export const auditAllNewsRef: AuditAllNewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the auditAllNewsRef:
```typescript
const name = auditAllNewsRef.operationName;
console.log(name);
```

### Variables
The `auditAllNews` query has no variables.
### Return Type
Recall that executing the `auditAllNews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AuditAllNewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AuditAllNewsData {
  newsArticles: ({
    id: string;
    title: string;
    translations?: unknown | null;
  } & NewsArticle_Key)[];
}
```
### Using `auditAllNews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, auditAllNews } from '@k-spirits/dataconnect';


// Call the `auditAllNews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await auditAllNews();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await auditAllNews(dataConnect);

console.log(data.newsArticles);

// Or, you can use the `Promise` API.
auditAllNews().then((response) => {
  const data = response.data;
  console.log(data.newsArticles);
});
```

### Using `auditAllNews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, auditAllNewsRef } from '@k-spirits/dataconnect';


// Call the `auditAllNewsRef()` function to get a reference to the query.
const ref = auditAllNewsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = auditAllNewsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.newsArticles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.newsArticles);
});
```

## auditAllSpirits
You can execute the `auditAllSpirits` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
auditAllSpirits(options?: ExecuteQueryOptions): QueryPromise<AuditAllSpiritsData, undefined>;

interface AuditAllSpiritsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AuditAllSpiritsData, undefined>;
}
export const auditAllSpiritsRef: AuditAllSpiritsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
auditAllSpirits(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AuditAllSpiritsData, undefined>;

interface AuditAllSpiritsRef {
  ...
  (dc: DataConnect): QueryRef<AuditAllSpiritsData, undefined>;
}
export const auditAllSpiritsRef: AuditAllSpiritsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the auditAllSpiritsRef:
```typescript
const name = auditAllSpiritsRef.operationName;
console.log(name);
```

### Variables
The `auditAllSpirits` query has no variables.
### Return Type
Recall that executing the `auditAllSpirits` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AuditAllSpiritsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AuditAllSpiritsData {
  spirits: ({
    id: string;
  } & Spirit_Key)[];
}
```
### Using `auditAllSpirits`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, auditAllSpirits } from '@k-spirits/dataconnect';


// Call the `auditAllSpirits()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await auditAllSpirits();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await auditAllSpirits(dataConnect);

console.log(data.spirits);

// Or, you can use the `Promise` API.
auditAllSpirits().then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

### Using `auditAllSpirits`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, auditAllSpiritsRef } from '@k-spirits/dataconnect';


// Call the `auditAllSpiritsRef()` function to get a reference to the query.
const ref = auditAllSpiritsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = auditAllSpiritsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.spirits);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

## auditAllReviews
You can execute the `auditAllReviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
auditAllReviews(options?: ExecuteQueryOptions): QueryPromise<AuditAllReviewsData, undefined>;

interface AuditAllReviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AuditAllReviewsData, undefined>;
}
export const auditAllReviewsRef: AuditAllReviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
auditAllReviews(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AuditAllReviewsData, undefined>;

interface AuditAllReviewsRef {
  ...
  (dc: DataConnect): QueryRef<AuditAllReviewsData, undefined>;
}
export const auditAllReviewsRef: AuditAllReviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the auditAllReviewsRef:
```typescript
const name = auditAllReviewsRef.operationName;
console.log(name);
```

### Variables
The `auditAllReviews` query has no variables.
### Return Type
Recall that executing the `auditAllReviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AuditAllReviewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AuditAllReviewsData {
  spiritReviews: ({
    id: UUIDString;
    spirit: {
      id: string;
      name: string;
    } & Spirit_Key;
      user: {
        id: string;
        nickname?: string | null;
      } & User_Key;
  } & SpiritReview_Key)[];
}
```
### Using `auditAllReviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, auditAllReviews } from '@k-spirits/dataconnect';


// Call the `auditAllReviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await auditAllReviews();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await auditAllReviews(dataConnect);

console.log(data.spiritReviews);

// Or, you can use the `Promise` API.
auditAllReviews().then((response) => {
  const data = response.data;
  console.log(data.spiritReviews);
});
```

### Using `auditAllReviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, auditAllReviewsRef } from '@k-spirits/dataconnect';


// Call the `auditAllReviewsRef()` function to get a reference to the query.
const ref = auditAllReviewsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = auditAllReviewsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.spiritReviews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.spiritReviews);
});
```

## listSpiritReviews
You can execute the `listSpiritReviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSpiritReviews(vars?: ListSpiritReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritReviewsData, ListSpiritReviewsVariables>;

interface ListSpiritReviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListSpiritReviewsVariables): QueryRef<ListSpiritReviewsData, ListSpiritReviewsVariables>;
}
export const listSpiritReviewsRef: ListSpiritReviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSpiritReviews(dc: DataConnect, vars?: ListSpiritReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritReviewsData, ListSpiritReviewsVariables>;

interface ListSpiritReviewsRef {
  ...
  (dc: DataConnect, vars?: ListSpiritReviewsVariables): QueryRef<ListSpiritReviewsData, ListSpiritReviewsVariables>;
}
export const listSpiritReviewsRef: ListSpiritReviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSpiritReviewsRef:
```typescript
const name = listSpiritReviewsRef.operationName;
console.log(name);
```

### Variables
The `listSpiritReviews` query has an optional argument of type `ListSpiritReviewsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListSpiritReviewsVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `listSpiritReviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSpiritReviewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSpiritReviewsData {
  spiritReviews: ({
    id: UUIDString;
    rating: number;
    title?: string | null;
    content: string;
    imageUrls?: string[] | null;
    createdAt: TimestampString;
    spirit: {
      id: string;
      name: string;
      imageUrl: string;
    } & Spirit_Key;
      user: {
        id: string;
        nickname?: string | null;
        profileImage?: string | null;
      } & User_Key;
  } & SpiritReview_Key)[];
}
```
### Using `listSpiritReviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSpiritReviews, ListSpiritReviewsVariables } from '@k-spirits/dataconnect';

// The `listSpiritReviews` query has an optional argument of type `ListSpiritReviewsVariables`:
const listSpiritReviewsVars: ListSpiritReviewsVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `listSpiritReviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSpiritReviews(listSpiritReviewsVars);
// Variables can be defined inline as well.
const { data } = await listSpiritReviews({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `ListSpiritReviewsVariables` argument.
const { data } = await listSpiritReviews();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSpiritReviews(dataConnect, listSpiritReviewsVars);

console.log(data.spiritReviews);

// Or, you can use the `Promise` API.
listSpiritReviews(listSpiritReviewsVars).then((response) => {
  const data = response.data;
  console.log(data.spiritReviews);
});
```

### Using `listSpiritReviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSpiritReviewsRef, ListSpiritReviewsVariables } from '@k-spirits/dataconnect';

// The `listSpiritReviews` query has an optional argument of type `ListSpiritReviewsVariables`:
const listSpiritReviewsVars: ListSpiritReviewsVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `listSpiritReviewsRef()` function to get a reference to the query.
const ref = listSpiritReviewsRef(listSpiritReviewsVars);
// Variables can be defined inline as well.
const ref = listSpiritReviewsRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `ListSpiritReviewsVariables` argument.
const ref = listSpiritReviewsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSpiritReviewsRef(dataConnect, listSpiritReviewsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.spiritReviews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.spiritReviews);
});
```

## getSpiritReviewsCount
You can execute the `getSpiritReviewsCount` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getSpiritReviewsCount(options?: ExecuteQueryOptions): QueryPromise<GetSpiritReviewsCountData, undefined>;

interface GetSpiritReviewsCountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetSpiritReviewsCountData, undefined>;
}
export const getSpiritReviewsCountRef: GetSpiritReviewsCountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSpiritReviewsCount(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetSpiritReviewsCountData, undefined>;

interface GetSpiritReviewsCountRef {
  ...
  (dc: DataConnect): QueryRef<GetSpiritReviewsCountData, undefined>;
}
export const getSpiritReviewsCountRef: GetSpiritReviewsCountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSpiritReviewsCountRef:
```typescript
const name = getSpiritReviewsCountRef.operationName;
console.log(name);
```

### Variables
The `getSpiritReviewsCount` query has no variables.
### Return Type
Recall that executing the `getSpiritReviewsCount` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSpiritReviewsCountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSpiritReviewsCountData {
  spiritReviews: ({
    id: UUIDString;
  } & SpiritReview_Key)[];
}
```
### Using `getSpiritReviewsCount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSpiritReviewsCount } from '@k-spirits/dataconnect';


// Call the `getSpiritReviewsCount()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSpiritReviewsCount();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSpiritReviewsCount(dataConnect);

console.log(data.spiritReviews);

// Or, you can use the `Promise` API.
getSpiritReviewsCount().then((response) => {
  const data = response.data;
  console.log(data.spiritReviews);
});
```

### Using `getSpiritReviewsCount`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSpiritReviewsCountRef } from '@k-spirits/dataconnect';


// Call the `getSpiritReviewsCountRef()` function to get a reference to the query.
const ref = getSpiritReviewsCountRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSpiritReviewsCountRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.spiritReviews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.spiritReviews);
});
```

## listSpiritsForSitemap
You can execute the `listSpiritsForSitemap` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSpiritsForSitemap(options?: ExecuteQueryOptions): QueryPromise<ListSpiritsForSitemapData, undefined>;

interface ListSpiritsForSitemapRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSpiritsForSitemapData, undefined>;
}
export const listSpiritsForSitemapRef: ListSpiritsForSitemapRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSpiritsForSitemap(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSpiritsForSitemapData, undefined>;

interface ListSpiritsForSitemapRef {
  ...
  (dc: DataConnect): QueryRef<ListSpiritsForSitemapData, undefined>;
}
export const listSpiritsForSitemapRef: ListSpiritsForSitemapRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSpiritsForSitemapRef:
```typescript
const name = listSpiritsForSitemapRef.operationName;
console.log(name);
```

### Variables
The `listSpiritsForSitemap` query has no variables.
### Return Type
Recall that executing the `listSpiritsForSitemap` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSpiritsForSitemapData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSpiritsForSitemapData {
  spirits: ({
    id: string;
    name: string;
    category: string;
    categoryEn?: string | null;
    imageUrl: string;
    thumbnailUrl?: string | null;
    descriptionKo?: string | null;
    descriptionEn?: string | null;
    pairingGuideKo?: string | null;
    pairingGuideEn?: string | null;
    tastingNote?: string | null;
    noseTags?: string[] | null;
    palateTags?: string[] | null;
    finishTags?: string[] | null;
    updatedAt: TimestampString;
  } & Spirit_Key)[];
}
```
### Using `listSpiritsForSitemap`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSpiritsForSitemap } from '@k-spirits/dataconnect';


// Call the `listSpiritsForSitemap()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSpiritsForSitemap();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSpiritsForSitemap(dataConnect);

console.log(data.spirits);

// Or, you can use the `Promise` API.
listSpiritsForSitemap().then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

### Using `listSpiritsForSitemap`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSpiritsForSitemapRef } from '@k-spirits/dataconnect';


// Call the `listSpiritsForSitemapRef()` function to get a reference to the query.
const ref = listSpiritsForSitemapRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSpiritsForSitemapRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.spirits);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

## getWorldCupResult
You can execute the `getWorldCupResult` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getWorldCupResult(vars: GetWorldCupResultVariables, options?: ExecuteQueryOptions): QueryPromise<GetWorldCupResultData, GetWorldCupResultVariables>;

interface GetWorldCupResultRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorldCupResultVariables): QueryRef<GetWorldCupResultData, GetWorldCupResultVariables>;
}
export const getWorldCupResultRef: GetWorldCupResultRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWorldCupResult(dc: DataConnect, vars: GetWorldCupResultVariables, options?: ExecuteQueryOptions): QueryPromise<GetWorldCupResultData, GetWorldCupResultVariables>;

interface GetWorldCupResultRef {
  ...
  (dc: DataConnect, vars: GetWorldCupResultVariables): QueryRef<GetWorldCupResultData, GetWorldCupResultVariables>;
}
export const getWorldCupResultRef: GetWorldCupResultRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getWorldCupResultRef:
```typescript
const name = getWorldCupResultRef.operationName;
console.log(name);
```

### Variables
The `getWorldCupResult` query requires an argument of type `GetWorldCupResultVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetWorldCupResultVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `getWorldCupResult` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetWorldCupResultData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetWorldCupResultData {
  worldCupResult?: {
    id: UUIDString;
    winner: {
      id: string;
      name: string;
      nameEn?: string | null;
      imageUrl: string;
      thumbnailUrl?: string | null;
      category: string;
      categoryEn?: string | null;
      subcategory?: string | null;
      distillery?: string | null;
      abv?: number | null;
      country?: string | null;
      region?: string | null;
      noseTags?: string[] | null;
      palateTags?: string[] | null;
      finishTags?: string[] | null;
    } & Spirit_Key;
      category: string;
      subcategory?: string | null;
      initialRound?: number | null;
      timestamp?: TimestampString | null;
  } & WorldCupResult_Key;
}
```
### Using `getWorldCupResult`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getWorldCupResult, GetWorldCupResultVariables } from '@k-spirits/dataconnect';

// The `getWorldCupResult` query requires an argument of type `GetWorldCupResultVariables`:
const getWorldCupResultVars: GetWorldCupResultVariables = {
  id: ..., 
};

// Call the `getWorldCupResult()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getWorldCupResult(getWorldCupResultVars);
// Variables can be defined inline as well.
const { data } = await getWorldCupResult({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getWorldCupResult(dataConnect, getWorldCupResultVars);

console.log(data.worldCupResult);

// Or, you can use the `Promise` API.
getWorldCupResult(getWorldCupResultVars).then((response) => {
  const data = response.data;
  console.log(data.worldCupResult);
});
```

### Using `getWorldCupResult`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getWorldCupResultRef, GetWorldCupResultVariables } from '@k-spirits/dataconnect';

// The `getWorldCupResult` query requires an argument of type `GetWorldCupResultVariables`:
const getWorldCupResultVars: GetWorldCupResultVariables = {
  id: ..., 
};

// Call the `getWorldCupResultRef()` function to get a reference to the query.
const ref = getWorldCupResultRef(getWorldCupResultVars);
// Variables can be defined inline as well.
const ref = getWorldCupResultRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getWorldCupResultRef(dataConnect, getWorldCupResultVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.worldCupResult);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.worldCupResult);
});
```

## listSpiritsForWorldCup
You can execute the `listSpiritsForWorldCup` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSpiritsForWorldCup(vars?: ListSpiritsForWorldCupVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables>;

interface ListSpiritsForWorldCupRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListSpiritsForWorldCupVariables): QueryRef<ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables>;
}
export const listSpiritsForWorldCupRef: ListSpiritsForWorldCupRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSpiritsForWorldCup(dc: DataConnect, vars?: ListSpiritsForWorldCupVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables>;

interface ListSpiritsForWorldCupRef {
  ...
  (dc: DataConnect, vars?: ListSpiritsForWorldCupVariables): QueryRef<ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables>;
}
export const listSpiritsForWorldCupRef: ListSpiritsForWorldCupRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSpiritsForWorldCupRef:
```typescript
const name = listSpiritsForWorldCupRef.operationName;
console.log(name);
```

### Variables
The `listSpiritsForWorldCup` query has an optional argument of type `ListSpiritsForWorldCupVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListSpiritsForWorldCupVariables {
  category?: string | null;
  subcategories?: string[] | null;
}
```
### Return Type
Recall that executing the `listSpiritsForWorldCup` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSpiritsForWorldCupData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSpiritsForWorldCupData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    imageUrl: string;
    thumbnailUrl?: string | null;
    category: string;
    categoryEn?: string | null;
    subcategory?: string | null;
    distillery?: string | null;
    abv?: number | null;
    country?: string | null;
    region?: string | null;
    noseTags?: string[] | null;
    palateTags?: string[] | null;
    finishTags?: string[] | null;
    createdAt: TimestampString;
  } & Spirit_Key)[];
}
```
### Using `listSpiritsForWorldCup`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSpiritsForWorldCup, ListSpiritsForWorldCupVariables } from '@k-spirits/dataconnect';

// The `listSpiritsForWorldCup` query has an optional argument of type `ListSpiritsForWorldCupVariables`:
const listSpiritsForWorldCupVars: ListSpiritsForWorldCupVariables = {
  category: ..., // optional
  subcategories: ..., // optional
};

// Call the `listSpiritsForWorldCup()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSpiritsForWorldCup(listSpiritsForWorldCupVars);
// Variables can be defined inline as well.
const { data } = await listSpiritsForWorldCup({ category: ..., subcategories: ..., });
// Since all variables are optional for this query, you can omit the `ListSpiritsForWorldCupVariables` argument.
const { data } = await listSpiritsForWorldCup();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSpiritsForWorldCup(dataConnect, listSpiritsForWorldCupVars);

console.log(data.spirits);

// Or, you can use the `Promise` API.
listSpiritsForWorldCup(listSpiritsForWorldCupVars).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

### Using `listSpiritsForWorldCup`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSpiritsForWorldCupRef, ListSpiritsForWorldCupVariables } from '@k-spirits/dataconnect';

// The `listSpiritsForWorldCup` query has an optional argument of type `ListSpiritsForWorldCupVariables`:
const listSpiritsForWorldCupVars: ListSpiritsForWorldCupVariables = {
  category: ..., // optional
  subcategories: ..., // optional
};

// Call the `listSpiritsForWorldCupRef()` function to get a reference to the query.
const ref = listSpiritsForWorldCupRef(listSpiritsForWorldCupVars);
// Variables can be defined inline as well.
const ref = listSpiritsForWorldCupRef({ category: ..., subcategories: ..., });
// Since all variables are optional for this query, you can omit the `ListSpiritsForWorldCupVariables` argument.
const ref = listSpiritsForWorldCupRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSpiritsForWorldCupRef(dataConnect, listSpiritsForWorldCupVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.spirits);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `main` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## upsertUser
You can execute the `upsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
console.log(name);
```

### Variables
The `upsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserVariables {
  id: string;
  email?: string | null;
  nickname?: string | null;
  profileImage?: string | null;
  role?: string | null;
  themePreference?: string | null;
  isFirstLogin?: boolean | null;
  reviewsWritten?: number | null;
  heartsReceived?: number | null;
}
```
### Return Type
Recall that executing the `upsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `upsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@k-spirits/dataconnect';

// The `upsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  id: ..., 
  email: ..., // optional
  nickname: ..., // optional
  profileImage: ..., // optional
  role: ..., // optional
  themePreference: ..., // optional
  isFirstLogin: ..., // optional
  reviewsWritten: ..., // optional
  heartsReceived: ..., // optional
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ id: ..., email: ..., nickname: ..., profileImage: ..., role: ..., themePreference: ..., isFirstLogin: ..., reviewsWritten: ..., heartsReceived: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `upsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@k-spirits/dataconnect';

// The `upsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  id: ..., 
  email: ..., // optional
  nickname: ..., // optional
  profileImage: ..., // optional
  role: ..., // optional
  themePreference: ..., // optional
  isFirstLogin: ..., // optional
  reviewsWritten: ..., // optional
  heartsReceived: ..., // optional
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ id: ..., email: ..., nickname: ..., profileImage: ..., role: ..., themePreference: ..., isFirstLogin: ..., reviewsWritten: ..., heartsReceived: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## upsertSpirit
You can execute the `upsertSpirit` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertSpirit(vars: UpsertSpiritVariables): MutationPromise<UpsertSpiritData, UpsertSpiritVariables>;

interface UpsertSpiritRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertSpiritVariables): MutationRef<UpsertSpiritData, UpsertSpiritVariables>;
}
export const upsertSpiritRef: UpsertSpiritRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertSpirit(dc: DataConnect, vars: UpsertSpiritVariables): MutationPromise<UpsertSpiritData, UpsertSpiritVariables>;

interface UpsertSpiritRef {
  ...
  (dc: DataConnect, vars: UpsertSpiritVariables): MutationRef<UpsertSpiritData, UpsertSpiritVariables>;
}
export const upsertSpiritRef: UpsertSpiritRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertSpiritRef:
```typescript
const name = upsertSpiritRef.operationName;
console.log(name);
```

### Variables
The `upsertSpirit` mutation requires an argument of type `UpsertSpiritVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertSpiritVariables {
  id: string;
  name: string;
  nameEn?: string | null;
  category: string;
  categoryEn?: string | null;
  mainCategory?: string | null;
  subcategory?: string | null;
  distillery?: string | null;
  bottler?: string | null;
  abv?: number | null;
  volume?: number | null;
  country?: string | null;
  region?: string | null;
  imageUrl: string;
  thumbnailUrl?: string | null;
  descriptionKo?: string | null;
  descriptionEn?: string | null;
  pairingGuideKo?: string | null;
  pairingGuideEn?: string | null;
  noseTags?: string[] | null;
  palateTags?: string[] | null;
  finishTags?: string[] | null;
  tastingNote?: string | null;
  status?: string | null;
  isPublished?: boolean | null;
  isReviewed?: boolean | null;
  rating?: number | null;
  reviewCount?: number | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `upsertSpirit` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertSpiritData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertSpiritData {
  spirit_upsert: Spirit_Key;
}
```
### Using `upsertSpirit`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertSpirit, UpsertSpiritVariables } from '@k-spirits/dataconnect';

// The `upsertSpirit` mutation requires an argument of type `UpsertSpiritVariables`:
const upsertSpiritVars: UpsertSpiritVariables = {
  id: ..., 
  name: ..., 
  nameEn: ..., // optional
  category: ..., 
  categoryEn: ..., // optional
  mainCategory: ..., // optional
  subcategory: ..., // optional
  distillery: ..., // optional
  bottler: ..., // optional
  abv: ..., // optional
  volume: ..., // optional
  country: ..., // optional
  region: ..., // optional
  imageUrl: ..., 
  thumbnailUrl: ..., // optional
  descriptionKo: ..., // optional
  descriptionEn: ..., // optional
  pairingGuideKo: ..., // optional
  pairingGuideEn: ..., // optional
  noseTags: ..., // optional
  palateTags: ..., // optional
  finishTags: ..., // optional
  tastingNote: ..., // optional
  status: ..., // optional
  isPublished: ..., // optional
  isReviewed: ..., // optional
  rating: ..., // optional
  reviewCount: ..., // optional
  metadata: ..., // optional
};

// Call the `upsertSpirit()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertSpirit(upsertSpiritVars);
// Variables can be defined inline as well.
const { data } = await upsertSpirit({ id: ..., name: ..., nameEn: ..., category: ..., categoryEn: ..., mainCategory: ..., subcategory: ..., distillery: ..., bottler: ..., abv: ..., volume: ..., country: ..., region: ..., imageUrl: ..., thumbnailUrl: ..., descriptionKo: ..., descriptionEn: ..., pairingGuideKo: ..., pairingGuideEn: ..., noseTags: ..., palateTags: ..., finishTags: ..., tastingNote: ..., status: ..., isPublished: ..., isReviewed: ..., rating: ..., reviewCount: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertSpirit(dataConnect, upsertSpiritVars);

console.log(data.spirit_upsert);

// Or, you can use the `Promise` API.
upsertSpirit(upsertSpiritVars).then((response) => {
  const data = response.data;
  console.log(data.spirit_upsert);
});
```

### Using `upsertSpirit`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertSpiritRef, UpsertSpiritVariables } from '@k-spirits/dataconnect';

// The `upsertSpirit` mutation requires an argument of type `UpsertSpiritVariables`:
const upsertSpiritVars: UpsertSpiritVariables = {
  id: ..., 
  name: ..., 
  nameEn: ..., // optional
  category: ..., 
  categoryEn: ..., // optional
  mainCategory: ..., // optional
  subcategory: ..., // optional
  distillery: ..., // optional
  bottler: ..., // optional
  abv: ..., // optional
  volume: ..., // optional
  country: ..., // optional
  region: ..., // optional
  imageUrl: ..., 
  thumbnailUrl: ..., // optional
  descriptionKo: ..., // optional
  descriptionEn: ..., // optional
  pairingGuideKo: ..., // optional
  pairingGuideEn: ..., // optional
  noseTags: ..., // optional
  palateTags: ..., // optional
  finishTags: ..., // optional
  tastingNote: ..., // optional
  status: ..., // optional
  isPublished: ..., // optional
  isReviewed: ..., // optional
  rating: ..., // optional
  reviewCount: ..., // optional
  metadata: ..., // optional
};

// Call the `upsertSpiritRef()` function to get a reference to the mutation.
const ref = upsertSpiritRef(upsertSpiritVars);
// Variables can be defined inline as well.
const ref = upsertSpiritRef({ id: ..., name: ..., nameEn: ..., category: ..., categoryEn: ..., mainCategory: ..., subcategory: ..., distillery: ..., bottler: ..., abv: ..., volume: ..., country: ..., region: ..., imageUrl: ..., thumbnailUrl: ..., descriptionKo: ..., descriptionEn: ..., pairingGuideKo: ..., pairingGuideEn: ..., noseTags: ..., palateTags: ..., finishTags: ..., tastingNote: ..., status: ..., isPublished: ..., isReviewed: ..., rating: ..., reviewCount: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertSpiritRef(dataConnect, upsertSpiritVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.spirit_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.spirit_upsert);
});
```

## upsertReview
You can execute the `upsertReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertReview(vars: UpsertReviewVariables): MutationPromise<UpsertReviewData, UpsertReviewVariables>;

interface UpsertReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertReviewVariables): MutationRef<UpsertReviewData, UpsertReviewVariables>;
}
export const upsertReviewRef: UpsertReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertReview(dc: DataConnect, vars: UpsertReviewVariables): MutationPromise<UpsertReviewData, UpsertReviewVariables>;

interface UpsertReviewRef {
  ...
  (dc: DataConnect, vars: UpsertReviewVariables): MutationRef<UpsertReviewData, UpsertReviewVariables>;
}
export const upsertReviewRef: UpsertReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertReviewRef:
```typescript
const name = upsertReviewRef.operationName;
console.log(name);
```

### Variables
The `upsertReview` mutation requires an argument of type `UpsertReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertReviewVariables {
  id: UUIDString;
  spiritId: string;
  userId: string;
  rating: number;
  title?: string | null;
  content: string;
  nose?: string | null;
  palate?: string | null;
  finish?: string | null;
  likes?: number | null;
  likedBy?: string[] | null;
  isPublished?: boolean | null;
  imageUrls?: string[] | null;
  createdAt?: TimestampString | null;
  updatedAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `upsertReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertReviewData {
  spiritReview_upsert: SpiritReview_Key;
}
```
### Using `upsertReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertReview, UpsertReviewVariables } from '@k-spirits/dataconnect';

// The `upsertReview` mutation requires an argument of type `UpsertReviewVariables`:
const upsertReviewVars: UpsertReviewVariables = {
  id: ..., 
  spiritId: ..., 
  userId: ..., 
  rating: ..., 
  title: ..., // optional
  content: ..., 
  nose: ..., // optional
  palate: ..., // optional
  finish: ..., // optional
  likes: ..., // optional
  likedBy: ..., // optional
  isPublished: ..., // optional
  imageUrls: ..., // optional
  createdAt: ..., // optional
  updatedAt: ..., // optional
};

// Call the `upsertReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertReview(upsertReviewVars);
// Variables can be defined inline as well.
const { data } = await upsertReview({ id: ..., spiritId: ..., userId: ..., rating: ..., title: ..., content: ..., nose: ..., palate: ..., finish: ..., likes: ..., likedBy: ..., isPublished: ..., imageUrls: ..., createdAt: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertReview(dataConnect, upsertReviewVars);

console.log(data.spiritReview_upsert);

// Or, you can use the `Promise` API.
upsertReview(upsertReviewVars).then((response) => {
  const data = response.data;
  console.log(data.spiritReview_upsert);
});
```

### Using `upsertReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertReviewRef, UpsertReviewVariables } from '@k-spirits/dataconnect';

// The `upsertReview` mutation requires an argument of type `UpsertReviewVariables`:
const upsertReviewVars: UpsertReviewVariables = {
  id: ..., 
  spiritId: ..., 
  userId: ..., 
  rating: ..., 
  title: ..., // optional
  content: ..., 
  nose: ..., // optional
  palate: ..., // optional
  finish: ..., // optional
  likes: ..., // optional
  likedBy: ..., // optional
  isPublished: ..., // optional
  imageUrls: ..., // optional
  createdAt: ..., // optional
  updatedAt: ..., // optional
};

// Call the `upsertReviewRef()` function to get a reference to the mutation.
const ref = upsertReviewRef(upsertReviewVars);
// Variables can be defined inline as well.
const ref = upsertReviewRef({ id: ..., spiritId: ..., userId: ..., rating: ..., title: ..., content: ..., nose: ..., palate: ..., finish: ..., likes: ..., likedBy: ..., isPublished: ..., imageUrls: ..., createdAt: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertReviewRef(dataConnect, upsertReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.spiritReview_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.spiritReview_upsert);
});
```

## upsertNews
You can execute the `upsertNews` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertNews(vars: UpsertNewsVariables): MutationPromise<UpsertNewsData, UpsertNewsVariables>;

interface UpsertNewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertNewsVariables): MutationRef<UpsertNewsData, UpsertNewsVariables>;
}
export const upsertNewsRef: UpsertNewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertNews(dc: DataConnect, vars: UpsertNewsVariables): MutationPromise<UpsertNewsData, UpsertNewsVariables>;

interface UpsertNewsRef {
  ...
  (dc: DataConnect, vars: UpsertNewsVariables): MutationRef<UpsertNewsData, UpsertNewsVariables>;
}
export const upsertNewsRef: UpsertNewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertNewsRef:
```typescript
const name = upsertNewsRef.operationName;
console.log(name);
```

### Variables
The `upsertNews` mutation requires an argument of type `UpsertNewsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertNewsVariables {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  category?: string | null;
  source?: string | null;
  link?: string | null;
  date?: string | null;
  translations?: unknown | null;
  tags?: string[] | null;
}
```
### Return Type
Recall that executing the `upsertNews` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertNewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertNewsData {
  newsArticle_upsert: NewsArticle_Key;
}
```
### Using `upsertNews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertNews, UpsertNewsVariables } from '@k-spirits/dataconnect';

// The `upsertNews` mutation requires an argument of type `UpsertNewsVariables`:
const upsertNewsVars: UpsertNewsVariables = {
  id: ..., 
  title: ..., 
  content: ..., 
  imageUrl: ..., // optional
  category: ..., // optional
  source: ..., // optional
  link: ..., // optional
  date: ..., // optional
  translations: ..., // optional
  tags: ..., // optional
};

// Call the `upsertNews()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertNews(upsertNewsVars);
// Variables can be defined inline as well.
const { data } = await upsertNews({ id: ..., title: ..., content: ..., imageUrl: ..., category: ..., source: ..., link: ..., date: ..., translations: ..., tags: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertNews(dataConnect, upsertNewsVars);

console.log(data.newsArticle_upsert);

// Or, you can use the `Promise` API.
upsertNews(upsertNewsVars).then((response) => {
  const data = response.data;
  console.log(data.newsArticle_upsert);
});
```

### Using `upsertNews`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertNewsRef, UpsertNewsVariables } from '@k-spirits/dataconnect';

// The `upsertNews` mutation requires an argument of type `UpsertNewsVariables`:
const upsertNewsVars: UpsertNewsVariables = {
  id: ..., 
  title: ..., 
  content: ..., 
  imageUrl: ..., // optional
  category: ..., // optional
  source: ..., // optional
  link: ..., // optional
  date: ..., // optional
  translations: ..., // optional
  tags: ..., // optional
};

// Call the `upsertNewsRef()` function to get a reference to the mutation.
const ref = upsertNewsRef(upsertNewsVars);
// Variables can be defined inline as well.
const ref = upsertNewsRef({ id: ..., title: ..., content: ..., imageUrl: ..., category: ..., source: ..., link: ..., date: ..., translations: ..., tags: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertNewsRef(dataConnect, upsertNewsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.newsArticle_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.newsArticle_upsert);
});
```

## upsertCabinet
You can execute the `upsertCabinet` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertCabinet(vars: UpsertCabinetVariables): MutationPromise<UpsertCabinetData, UpsertCabinetVariables>;

interface UpsertCabinetRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCabinetVariables): MutationRef<UpsertCabinetData, UpsertCabinetVariables>;
}
export const upsertCabinetRef: UpsertCabinetRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCabinet(dc: DataConnect, vars: UpsertCabinetVariables): MutationPromise<UpsertCabinetData, UpsertCabinetVariables>;

interface UpsertCabinetRef {
  ...
  (dc: DataConnect, vars: UpsertCabinetVariables): MutationRef<UpsertCabinetData, UpsertCabinetVariables>;
}
export const upsertCabinetRef: UpsertCabinetRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCabinetRef:
```typescript
const name = upsertCabinetRef.operationName;
console.log(name);
```

### Variables
The `upsertCabinet` mutation requires an argument of type `UpsertCabinetVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertCabinetVariables {
  userId: string;
  spiritId: string;
  addedAt?: TimestampString | null;
  notes?: string | null;
  rating?: number | null;
  isFavorite?: boolean | null;
}
```
### Return Type
Recall that executing the `upsertCabinet` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCabinetData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCabinetData {
  userCabinet_upsert: UserCabinet_Key;
}
```
### Using `upsertCabinet`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCabinet, UpsertCabinetVariables } from '@k-spirits/dataconnect';

// The `upsertCabinet` mutation requires an argument of type `UpsertCabinetVariables`:
const upsertCabinetVars: UpsertCabinetVariables = {
  userId: ..., 
  spiritId: ..., 
  addedAt: ..., // optional
  notes: ..., // optional
  rating: ..., // optional
  isFavorite: ..., // optional
};

// Call the `upsertCabinet()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCabinet(upsertCabinetVars);
// Variables can be defined inline as well.
const { data } = await upsertCabinet({ userId: ..., spiritId: ..., addedAt: ..., notes: ..., rating: ..., isFavorite: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCabinet(dataConnect, upsertCabinetVars);

console.log(data.userCabinet_upsert);

// Or, you can use the `Promise` API.
upsertCabinet(upsertCabinetVars).then((response) => {
  const data = response.data;
  console.log(data.userCabinet_upsert);
});
```

### Using `upsertCabinet`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCabinetRef, UpsertCabinetVariables } from '@k-spirits/dataconnect';

// The `upsertCabinet` mutation requires an argument of type `UpsertCabinetVariables`:
const upsertCabinetVars: UpsertCabinetVariables = {
  userId: ..., 
  spiritId: ..., 
  addedAt: ..., // optional
  notes: ..., // optional
  rating: ..., // optional
  isFavorite: ..., // optional
};

// Call the `upsertCabinetRef()` function to get a reference to the mutation.
const ref = upsertCabinetRef(upsertCabinetVars);
// Variables can be defined inline as well.
const ref = upsertCabinetRef({ userId: ..., spiritId: ..., addedAt: ..., notes: ..., rating: ..., isFavorite: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCabinetRef(dataConnect, upsertCabinetVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userCabinet_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userCabinet_upsert);
});
```

## upsertModificationRequest
You can execute the `upsertModificationRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertModificationRequest(vars: UpsertModificationRequestVariables): MutationPromise<UpsertModificationRequestData, UpsertModificationRequestVariables>;

interface UpsertModificationRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertModificationRequestVariables): MutationRef<UpsertModificationRequestData, UpsertModificationRequestVariables>;
}
export const upsertModificationRequestRef: UpsertModificationRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertModificationRequest(dc: DataConnect, vars: UpsertModificationRequestVariables): MutationPromise<UpsertModificationRequestData, UpsertModificationRequestVariables>;

interface UpsertModificationRequestRef {
  ...
  (dc: DataConnect, vars: UpsertModificationRequestVariables): MutationRef<UpsertModificationRequestData, UpsertModificationRequestVariables>;
}
export const upsertModificationRequestRef: UpsertModificationRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertModificationRequestRef:
```typescript
const name = upsertModificationRequestRef.operationName;
console.log(name);
```

### Variables
The `upsertModificationRequest` mutation requires an argument of type `UpsertModificationRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertModificationRequestVariables {
  id: string;
  spiritId: string;
  spiritName?: string | null;
  userId?: string | null;
  title: string;
  content: string;
  status?: string | null;
  createdAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `upsertModificationRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertModificationRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertModificationRequestData {
  modificationRequest_upsert: ModificationRequest_Key;
}
```
### Using `upsertModificationRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertModificationRequest, UpsertModificationRequestVariables } from '@k-spirits/dataconnect';

// The `upsertModificationRequest` mutation requires an argument of type `UpsertModificationRequestVariables`:
const upsertModificationRequestVars: UpsertModificationRequestVariables = {
  id: ..., 
  spiritId: ..., 
  spiritName: ..., // optional
  userId: ..., // optional
  title: ..., 
  content: ..., 
  status: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertModificationRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertModificationRequest(upsertModificationRequestVars);
// Variables can be defined inline as well.
const { data } = await upsertModificationRequest({ id: ..., spiritId: ..., spiritName: ..., userId: ..., title: ..., content: ..., status: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertModificationRequest(dataConnect, upsertModificationRequestVars);

console.log(data.modificationRequest_upsert);

// Or, you can use the `Promise` API.
upsertModificationRequest(upsertModificationRequestVars).then((response) => {
  const data = response.data;
  console.log(data.modificationRequest_upsert);
});
```

### Using `upsertModificationRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertModificationRequestRef, UpsertModificationRequestVariables } from '@k-spirits/dataconnect';

// The `upsertModificationRequest` mutation requires an argument of type `UpsertModificationRequestVariables`:
const upsertModificationRequestVars: UpsertModificationRequestVariables = {
  id: ..., 
  spiritId: ..., 
  spiritName: ..., // optional
  userId: ..., // optional
  title: ..., 
  content: ..., 
  status: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertModificationRequestRef()` function to get a reference to the mutation.
const ref = upsertModificationRequestRef(upsertModificationRequestVars);
// Variables can be defined inline as well.
const ref = upsertModificationRequestRef({ id: ..., spiritId: ..., spiritName: ..., userId: ..., title: ..., content: ..., status: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertModificationRequestRef(dataConnect, upsertModificationRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.modificationRequest_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.modificationRequest_upsert);
});
```

## upsertWorldCupResult
You can execute the `upsertWorldCupResult` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertWorldCupResult(vars: UpsertWorldCupResultVariables): MutationPromise<UpsertWorldCupResultData, UpsertWorldCupResultVariables>;

interface UpsertWorldCupResultRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertWorldCupResultVariables): MutationRef<UpsertWorldCupResultData, UpsertWorldCupResultVariables>;
}
export const upsertWorldCupResultRef: UpsertWorldCupResultRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertWorldCupResult(dc: DataConnect, vars: UpsertWorldCupResultVariables): MutationPromise<UpsertWorldCupResultData, UpsertWorldCupResultVariables>;

interface UpsertWorldCupResultRef {
  ...
  (dc: DataConnect, vars: UpsertWorldCupResultVariables): MutationRef<UpsertWorldCupResultData, UpsertWorldCupResultVariables>;
}
export const upsertWorldCupResultRef: UpsertWorldCupResultRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertWorldCupResultRef:
```typescript
const name = upsertWorldCupResultRef.operationName;
console.log(name);
```

### Variables
The `upsertWorldCupResult` mutation requires an argument of type `UpsertWorldCupResultVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertWorldCupResultVariables {
  id: UUIDString;
  winnerId?: string | null;
  category: string;
  subcategory?: string | null;
  initialRound?: number | null;
  timestamp?: TimestampString | null;
}
```
### Return Type
Recall that executing the `upsertWorldCupResult` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertWorldCupResultData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertWorldCupResultData {
  worldCupResult_upsert: WorldCupResult_Key;
}
```
### Using `upsertWorldCupResult`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertWorldCupResult, UpsertWorldCupResultVariables } from '@k-spirits/dataconnect';

// The `upsertWorldCupResult` mutation requires an argument of type `UpsertWorldCupResultVariables`:
const upsertWorldCupResultVars: UpsertWorldCupResultVariables = {
  id: ..., 
  winnerId: ..., // optional
  category: ..., 
  subcategory: ..., // optional
  initialRound: ..., // optional
  timestamp: ..., // optional
};

// Call the `upsertWorldCupResult()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertWorldCupResult(upsertWorldCupResultVars);
// Variables can be defined inline as well.
const { data } = await upsertWorldCupResult({ id: ..., winnerId: ..., category: ..., subcategory: ..., initialRound: ..., timestamp: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertWorldCupResult(dataConnect, upsertWorldCupResultVars);

console.log(data.worldCupResult_upsert);

// Or, you can use the `Promise` API.
upsertWorldCupResult(upsertWorldCupResultVars).then((response) => {
  const data = response.data;
  console.log(data.worldCupResult_upsert);
});
```

### Using `upsertWorldCupResult`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertWorldCupResultRef, UpsertWorldCupResultVariables } from '@k-spirits/dataconnect';

// The `upsertWorldCupResult` mutation requires an argument of type `UpsertWorldCupResultVariables`:
const upsertWorldCupResultVars: UpsertWorldCupResultVariables = {
  id: ..., 
  winnerId: ..., // optional
  category: ..., 
  subcategory: ..., // optional
  initialRound: ..., // optional
  timestamp: ..., // optional
};

// Call the `upsertWorldCupResultRef()` function to get a reference to the mutation.
const ref = upsertWorldCupResultRef(upsertWorldCupResultVars);
// Variables can be defined inline as well.
const ref = upsertWorldCupResultRef({ id: ..., winnerId: ..., category: ..., subcategory: ..., initialRound: ..., timestamp: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertWorldCupResultRef(dataConnect, upsertWorldCupResultVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.worldCupResult_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.worldCupResult_upsert);
});
```

