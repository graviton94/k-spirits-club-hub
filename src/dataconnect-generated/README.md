# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `main`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*listSpirits*](#listspirits)
  - [*searchSpiritsPublic*](#searchspiritspublic)
  - [*listAllCategories*](#listallcategories)
  - [*listAllSubcategories*](#listallsubcategories)
  - [*listTrendingSpirits*](#listtrendingspirits)
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
  - [*findReview*](#findreview)
  - [*getReviewDetail*](#getreviewdetail)
  - [*listReviewComments*](#listreviewcomments)
  - [*listSpiritsForSitemap*](#listspiritsforsitemap)
  - [*getWorldCupResult*](#getworldcupresult)
  - [*listSpiritsForWorldCup*](#listspiritsforworldcup)
  - [*listAllSpiritsForWorldCup*](#listallspiritsforworldcup)
  - [*listSpiritsByCategoryForWorldCup*](#listspiritsbycategoryforworldcup)
  - [*listAiDiscoveryLogs*](#listaidiscoverylogs)
  - [*listModificationRequests*](#listmodificationrequests)
  - [*listUserCabinet*](#listusercabinet)
  - [*listUserReviews*](#listuserreviews)
  - [*getReviewLike*](#getreviewlike)
  - [*listReviewLikes*](#listreviewlikes)
- [**Mutations**](#mutations)
  - [*upsertUser*](#upsertuser)
  - [*upsertSpirit*](#upsertspirit)
  - [*upsertNewArrival*](#upsertnewarrival)
  - [*upsertReview*](#upsertreview)
  - [*updateReviewLikesCount*](#updatereviewlikescount)
  - [*upsertReviewLike*](#upsertreviewlike)
  - [*deleteReviewLike*](#deletereviewlike)
  - [*upsertReviewComment*](#upsertreviewcomment)
  - [*deleteReviewComment*](#deletereviewcomment)
  - [*upsertNews*](#upsertnews)
  - [*deleteNews*](#deletenews)
  - [*upsertCabinet*](#upsertcabinet)
  - [*deleteCabinet*](#deletecabinet)
  - [*upsertModificationRequest*](#upsertmodificationrequest)
  - [*upsertWorldCupResult*](#upsertworldcupresult)
  - [*deleteSpirit*](#deletespirit)
  - [*upsertAiDiscoveryLog*](#upsertaidiscoverylog)
  - [*deleteReview*](#deletereview)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `main`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

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
  subcategory?: string | null;
  country?: string | null;
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
    thumbnailUrl?: string | null;
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
import { connectorConfig, listSpirits, ListSpiritsVariables } from '@dataconnect/generated';

// The `listSpirits` query has an optional argument of type `ListSpiritsVariables`:
const listSpiritsVars: ListSpiritsVariables = {
  category: ..., // optional
  subcategory: ..., // optional
  country: ..., // optional
};

// Call the `listSpirits()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSpirits(listSpiritsVars);
// Variables can be defined inline as well.
const { data } = await listSpirits({ category: ..., subcategory: ..., country: ..., });
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
import { connectorConfig, listSpiritsRef, ListSpiritsVariables } from '@dataconnect/generated';

// The `listSpirits` query has an optional argument of type `ListSpiritsVariables`:
const listSpiritsVars: ListSpiritsVariables = {
  category: ..., // optional
  subcategory: ..., // optional
  country: ..., // optional
};

// Call the `listSpiritsRef()` function to get a reference to the query.
const ref = listSpiritsRef(listSpiritsVars);
// Variables can be defined inline as well.
const ref = listSpiritsRef({ category: ..., subcategory: ..., country: ..., });
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

## searchSpiritsPublic
You can execute the `searchSpiritsPublic` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
searchSpiritsPublic(vars?: SearchSpiritsPublicVariables, options?: ExecuteQueryOptions): QueryPromise<SearchSpiritsPublicData, SearchSpiritsPublicVariables>;

interface SearchSpiritsPublicRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchSpiritsPublicVariables): QueryRef<SearchSpiritsPublicData, SearchSpiritsPublicVariables>;
}
export const searchSpiritsPublicRef: SearchSpiritsPublicRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchSpiritsPublic(dc: DataConnect, vars?: SearchSpiritsPublicVariables, options?: ExecuteQueryOptions): QueryPromise<SearchSpiritsPublicData, SearchSpiritsPublicVariables>;

interface SearchSpiritsPublicRef {
  ...
  (dc: DataConnect, vars?: SearchSpiritsPublicVariables): QueryRef<SearchSpiritsPublicData, SearchSpiritsPublicVariables>;
}
export const searchSpiritsPublicRef: SearchSpiritsPublicRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchSpiritsPublicRef:
```typescript
const name = searchSpiritsPublicRef.operationName;
console.log(name);
```

### Variables
The `searchSpiritsPublic` query has an optional argument of type `SearchSpiritsPublicVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchSpiritsPublicVariables {
  search?: string | null;
  category?: string | null;
  subcategory?: string | null;
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `searchSpiritsPublic` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchSpiritsPublicData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SearchSpiritsPublicData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    category: string;
    categoryEn?: string | null;
    subcategory?: string | null;
    imageUrl: string;
    thumbnailUrl?: string | null;
    abv?: number | null;
    distillery?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
    metadata?: unknown | null;
  } & Spirit_Key)[];
}
```
### Using `searchSpiritsPublic`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchSpiritsPublic, SearchSpiritsPublicVariables } from '@dataconnect/generated';

// The `searchSpiritsPublic` query has an optional argument of type `SearchSpiritsPublicVariables`:
const searchSpiritsPublicVars: SearchSpiritsPublicVariables = {
  search: ..., // optional
  category: ..., // optional
  subcategory: ..., // optional
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `searchSpiritsPublic()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchSpiritsPublic(searchSpiritsPublicVars);
// Variables can be defined inline as well.
const { data } = await searchSpiritsPublic({ search: ..., category: ..., subcategory: ..., limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `SearchSpiritsPublicVariables` argument.
const { data } = await searchSpiritsPublic();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchSpiritsPublic(dataConnect, searchSpiritsPublicVars);

console.log(data.spirits);

// Or, you can use the `Promise` API.
searchSpiritsPublic(searchSpiritsPublicVars).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

### Using `searchSpiritsPublic`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchSpiritsPublicRef, SearchSpiritsPublicVariables } from '@dataconnect/generated';

// The `searchSpiritsPublic` query has an optional argument of type `SearchSpiritsPublicVariables`:
const searchSpiritsPublicVars: SearchSpiritsPublicVariables = {
  search: ..., // optional
  category: ..., // optional
  subcategory: ..., // optional
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `searchSpiritsPublicRef()` function to get a reference to the query.
const ref = searchSpiritsPublicRef(searchSpiritsPublicVars);
// Variables can be defined inline as well.
const ref = searchSpiritsPublicRef({ search: ..., category: ..., subcategory: ..., limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `SearchSpiritsPublicVariables` argument.
const ref = searchSpiritsPublicRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchSpiritsPublicRef(dataConnect, searchSpiritsPublicVars);

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

## listAllCategories
You can execute the `listAllCategories` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllCategories(options?: ExecuteQueryOptions): QueryPromise<ListAllCategoriesData, undefined>;

interface ListAllCategoriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllCategoriesData, undefined>;
}
export const listAllCategoriesRef: ListAllCategoriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllCategories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllCategoriesData, undefined>;

interface ListAllCategoriesRef {
  ...
  (dc: DataConnect): QueryRef<ListAllCategoriesData, undefined>;
}
export const listAllCategoriesRef: ListAllCategoriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllCategoriesRef:
```typescript
const name = listAllCategoriesRef.operationName;
console.log(name);
```

### Variables
The `listAllCategories` query has no variables.
### Return Type
Recall that executing the `listAllCategories` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllCategoriesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllCategoriesData {
  spirits: ({
    category: string;
    categoryEn?: string | null;
  })[];
}
```
### Using `listAllCategories`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllCategories } from '@dataconnect/generated';


// Call the `listAllCategories()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllCategories();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllCategories(dataConnect);

console.log(data.spirits);

// Or, you can use the `Promise` API.
listAllCategories().then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

### Using `listAllCategories`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllCategoriesRef } from '@dataconnect/generated';


// Call the `listAllCategoriesRef()` function to get a reference to the query.
const ref = listAllCategoriesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllCategoriesRef(dataConnect);

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

## listAllSubcategories
You can execute the `listAllSubcategories` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllSubcategories(vars?: ListAllSubcategoriesVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllSubcategoriesData, ListAllSubcategoriesVariables>;

interface ListAllSubcategoriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListAllSubcategoriesVariables): QueryRef<ListAllSubcategoriesData, ListAllSubcategoriesVariables>;
}
export const listAllSubcategoriesRef: ListAllSubcategoriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllSubcategories(dc: DataConnect, vars?: ListAllSubcategoriesVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllSubcategoriesData, ListAllSubcategoriesVariables>;

interface ListAllSubcategoriesRef {
  ...
  (dc: DataConnect, vars?: ListAllSubcategoriesVariables): QueryRef<ListAllSubcategoriesData, ListAllSubcategoriesVariables>;
}
export const listAllSubcategoriesRef: ListAllSubcategoriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllSubcategoriesRef:
```typescript
const name = listAllSubcategoriesRef.operationName;
console.log(name);
```

### Variables
The `listAllSubcategories` query has an optional argument of type `ListAllSubcategoriesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListAllSubcategoriesVariables {
  category?: string | null;
}
```
### Return Type
Recall that executing the `listAllSubcategories` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllSubcategoriesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllSubcategoriesData {
  spirits: ({
    subcategory?: string | null;
  })[];
}
```
### Using `listAllSubcategories`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllSubcategories, ListAllSubcategoriesVariables } from '@dataconnect/generated';

// The `listAllSubcategories` query has an optional argument of type `ListAllSubcategoriesVariables`:
const listAllSubcategoriesVars: ListAllSubcategoriesVariables = {
  category: ..., // optional
};

// Call the `listAllSubcategories()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllSubcategories(listAllSubcategoriesVars);
// Variables can be defined inline as well.
const { data } = await listAllSubcategories({ category: ..., });
// Since all variables are optional for this query, you can omit the `ListAllSubcategoriesVariables` argument.
const { data } = await listAllSubcategories();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllSubcategories(dataConnect, listAllSubcategoriesVars);

console.log(data.spirits);

// Or, you can use the `Promise` API.
listAllSubcategories(listAllSubcategoriesVars).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

### Using `listAllSubcategories`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllSubcategoriesRef, ListAllSubcategoriesVariables } from '@dataconnect/generated';

// The `listAllSubcategories` query has an optional argument of type `ListAllSubcategoriesVariables`:
const listAllSubcategoriesVars: ListAllSubcategoriesVariables = {
  category: ..., // optional
};

// Call the `listAllSubcategoriesRef()` function to get a reference to the query.
const ref = listAllSubcategoriesRef(listAllSubcategoriesVars);
// Variables can be defined inline as well.
const ref = listAllSubcategoriesRef({ category: ..., });
// Since all variables are optional for this query, you can omit the `ListAllSubcategoriesVariables` argument.
const ref = listAllSubcategoriesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllSubcategoriesRef(dataConnect, listAllSubcategoriesVars);

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

## listTrendingSpirits
You can execute the `listTrendingSpirits` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTrendingSpirits(vars?: ListTrendingSpiritsVariables, options?: ExecuteQueryOptions): QueryPromise<ListTrendingSpiritsData, ListTrendingSpiritsVariables>;

interface ListTrendingSpiritsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListTrendingSpiritsVariables): QueryRef<ListTrendingSpiritsData, ListTrendingSpiritsVariables>;
}
export const listTrendingSpiritsRef: ListTrendingSpiritsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTrendingSpirits(dc: DataConnect, vars?: ListTrendingSpiritsVariables, options?: ExecuteQueryOptions): QueryPromise<ListTrendingSpiritsData, ListTrendingSpiritsVariables>;

interface ListTrendingSpiritsRef {
  ...
  (dc: DataConnect, vars?: ListTrendingSpiritsVariables): QueryRef<ListTrendingSpiritsData, ListTrendingSpiritsVariables>;
}
export const listTrendingSpiritsRef: ListTrendingSpiritsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTrendingSpiritsRef:
```typescript
const name = listTrendingSpiritsRef.operationName;
console.log(name);
```

### Variables
The `listTrendingSpirits` query has an optional argument of type `ListTrendingSpiritsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListTrendingSpiritsVariables {
  limit?: number | null;
}
```
### Return Type
Recall that executing the `listTrendingSpirits` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTrendingSpiritsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTrendingSpiritsData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    category: string;
    categoryEn?: string | null;
    imageUrl: string;
    thumbnailUrl?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
    distillery?: string | null;
    abv?: number | null;
  } & Spirit_Key)[];
}
```
### Using `listTrendingSpirits`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTrendingSpirits, ListTrendingSpiritsVariables } from '@dataconnect/generated';

// The `listTrendingSpirits` query has an optional argument of type `ListTrendingSpiritsVariables`:
const listTrendingSpiritsVars: ListTrendingSpiritsVariables = {
  limit: ..., // optional
};

// Call the `listTrendingSpirits()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTrendingSpirits(listTrendingSpiritsVars);
// Variables can be defined inline as well.
const { data } = await listTrendingSpirits({ limit: ..., });
// Since all variables are optional for this query, you can omit the `ListTrendingSpiritsVariables` argument.
const { data } = await listTrendingSpirits();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTrendingSpirits(dataConnect, listTrendingSpiritsVars);

console.log(data.spirits);

// Or, you can use the `Promise` API.
listTrendingSpirits(listTrendingSpiritsVars).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

### Using `listTrendingSpirits`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTrendingSpiritsRef, ListTrendingSpiritsVariables } from '@dataconnect/generated';

// The `listTrendingSpirits` query has an optional argument of type `ListTrendingSpiritsVariables`:
const listTrendingSpiritsVars: ListTrendingSpiritsVariables = {
  limit: ..., // optional
};

// Call the `listTrendingSpiritsRef()` function to get a reference to the query.
const ref = listTrendingSpiritsRef(listTrendingSpiritsVars);
// Variables can be defined inline as well.
const ref = listTrendingSpiritsRef({ limit: ..., });
// Since all variables are optional for this query, you can omit the `ListTrendingSpiritsVariables` argument.
const ref = listTrendingSpiritsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTrendingSpiritsRef(dataConnect, listTrendingSpiritsVars);

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
    thumbnailUrl?: string | null;
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
import { connectorConfig, listNewArrivals, ListNewArrivalsVariables } from '@dataconnect/generated';

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
import { connectorConfig, listNewArrivalsRef, ListNewArrivalsVariables } from '@dataconnect/generated';

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
      likes?: number | null;
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
import { connectorConfig, getSpirit, GetSpiritVariables } from '@dataconnect/generated';

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
import { connectorConfig, getSpiritRef, GetSpiritVariables } from '@dataconnect/generated';

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
  category?: string | null;
  distillery?: string | null;
  isPublished?: boolean | null;
  search?: string | null;
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
    imageUrl: string;
    thumbnailUrl?: string | null;
    abv?: number | null;
    distillery?: string | null;
    region?: string | null;
    subcategory?: string | null;
  } & Spirit_Key)[];
}
```
### Using `adminListRawSpirits`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListRawSpirits, AdminListRawSpiritsVariables } from '@dataconnect/generated';

// The `adminListRawSpirits` query has an optional argument of type `AdminListRawSpiritsVariables`:
const adminListRawSpiritsVars: AdminListRawSpiritsVariables = {
  limit: ..., // optional
  offset: ..., // optional
  category: ..., // optional
  distillery: ..., // optional
  isPublished: ..., // optional
  search: ..., // optional
};

// Call the `adminListRawSpirits()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListRawSpirits(adminListRawSpiritsVars);
// Variables can be defined inline as well.
const { data } = await adminListRawSpirits({ limit: ..., offset: ..., category: ..., distillery: ..., isPublished: ..., search: ..., });
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
import { connectorConfig, adminListRawSpiritsRef, AdminListRawSpiritsVariables } from '@dataconnect/generated';

// The `adminListRawSpirits` query has an optional argument of type `AdminListRawSpiritsVariables`:
const adminListRawSpiritsVars: AdminListRawSpiritsVariables = {
  limit: ..., // optional
  offset: ..., // optional
  category: ..., // optional
  distillery: ..., // optional
  isPublished: ..., // optional
  search: ..., // optional
};

// Call the `adminListRawSpiritsRef()` function to get a reference to the query.
const ref = adminListRawSpiritsRef(adminListRawSpiritsVars);
// Variables can be defined inline as well.
const ref = adminListRawSpiritsRef({ limit: ..., offset: ..., category: ..., distillery: ..., isPublished: ..., search: ..., });
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
    profileImage?: string | null;
    role?: string | null;
    themePreference?: string | null;
    isFirstLogin?: boolean | null;
    tasteProfile?: unknown | null;
    reviewsWritten?: number | null;
    heartsReceived?: number | null;
  } & User_Key;
}
```
### Using `getUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProfile, GetUserProfileVariables } from '@dataconnect/generated';

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
import { connectorConfig, getUserProfileRef, GetUserProfileVariables } from '@dataconnect/generated';

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
    tags?: unknown | null;
    createdAt?: TimestampString | null;
  } & NewsArticle_Key)[];
}
```
### Using `listNewsArticles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listNewsArticles, ListNewsArticlesVariables } from '@dataconnect/generated';

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
import { connectorConfig, listNewsArticlesRef, ListNewsArticlesVariables } from '@dataconnect/generated';

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
    tags?: unknown | null;
    createdAt?: TimestampString | null;
  } & NewsArticle_Key;
}
```
### Using `getNewsArticle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getNewsArticle, GetNewsArticleVariables } from '@dataconnect/generated';

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
import { connectorConfig, getNewsArticleRef, GetNewsArticleVariables } from '@dataconnect/generated';

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
import { connectorConfig, auditAllUsers } from '@dataconnect/generated';


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
import { connectorConfig, auditAllUsersRef } from '@dataconnect/generated';


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
    link?: string | null;
    translations?: unknown | null;
  } & NewsArticle_Key)[];
}
```
### Using `auditAllNews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, auditAllNews } from '@dataconnect/generated';


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
import { connectorConfig, auditAllNewsRef } from '@dataconnect/generated';


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
import { connectorConfig, auditAllSpirits } from '@dataconnect/generated';


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
import { connectorConfig, auditAllSpiritsRef } from '@dataconnect/generated';


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
import { connectorConfig, auditAllReviews } from '@dataconnect/generated';


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
import { connectorConfig, auditAllReviewsRef } from '@dataconnect/generated';


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
    nose?: string | null;
    palate?: string | null;
    finish?: string | null;
    imageUrls?: string[] | null;
    createdAt: TimestampString;
    spirit: {
      id: string;
      name: string;
      nameEn?: string | null;
      imageUrl: string;
      distillery?: string | null;
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
import { connectorConfig, listSpiritReviews, ListSpiritReviewsVariables } from '@dataconnect/generated';

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
import { connectorConfig, listSpiritReviewsRef, ListSpiritReviewsVariables } from '@dataconnect/generated';

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
import { connectorConfig, getSpiritReviewsCount } from '@dataconnect/generated';


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
import { connectorConfig, getSpiritReviewsCountRef } from '@dataconnect/generated';


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

## findReview
You can execute the `findReview` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
findReview(vars: FindReviewVariables, options?: ExecuteQueryOptions): QueryPromise<FindReviewData, FindReviewVariables>;

interface FindReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: FindReviewVariables): QueryRef<FindReviewData, FindReviewVariables>;
}
export const findReviewRef: FindReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
findReview(dc: DataConnect, vars: FindReviewVariables, options?: ExecuteQueryOptions): QueryPromise<FindReviewData, FindReviewVariables>;

interface FindReviewRef {
  ...
  (dc: DataConnect, vars: FindReviewVariables): QueryRef<FindReviewData, FindReviewVariables>;
}
export const findReviewRef: FindReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the findReviewRef:
```typescript
const name = findReviewRef.operationName;
console.log(name);
```

### Variables
The `findReview` query requires an argument of type `FindReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface FindReviewVariables {
  userId: string;
  spiritId: string;
}
```
### Return Type
Recall that executing the `findReview` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `FindReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface FindReviewData {
  spiritReviews: ({
    id: UUIDString;
    likes?: number | null;
  } & SpiritReview_Key)[];
}
```
### Using `findReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, findReview, FindReviewVariables } from '@dataconnect/generated';

// The `findReview` query requires an argument of type `FindReviewVariables`:
const findReviewVars: FindReviewVariables = {
  userId: ..., 
  spiritId: ..., 
};

// Call the `findReview()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await findReview(findReviewVars);
// Variables can be defined inline as well.
const { data } = await findReview({ userId: ..., spiritId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await findReview(dataConnect, findReviewVars);

console.log(data.spiritReviews);

// Or, you can use the `Promise` API.
findReview(findReviewVars).then((response) => {
  const data = response.data;
  console.log(data.spiritReviews);
});
```

### Using `findReview`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, findReviewRef, FindReviewVariables } from '@dataconnect/generated';

// The `findReview` query requires an argument of type `FindReviewVariables`:
const findReviewVars: FindReviewVariables = {
  userId: ..., 
  spiritId: ..., 
};

// Call the `findReviewRef()` function to get a reference to the query.
const ref = findReviewRef(findReviewVars);
// Variables can be defined inline as well.
const ref = findReviewRef({ userId: ..., spiritId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = findReviewRef(dataConnect, findReviewVars);

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

## getReviewDetail
You can execute the `getReviewDetail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getReviewDetail(vars: GetReviewDetailVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewDetailData, GetReviewDetailVariables>;

interface GetReviewDetailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReviewDetailVariables): QueryRef<GetReviewDetailData, GetReviewDetailVariables>;
}
export const getReviewDetailRef: GetReviewDetailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getReviewDetail(dc: DataConnect, vars: GetReviewDetailVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewDetailData, GetReviewDetailVariables>;

interface GetReviewDetailRef {
  ...
  (dc: DataConnect, vars: GetReviewDetailVariables): QueryRef<GetReviewDetailData, GetReviewDetailVariables>;
}
export const getReviewDetailRef: GetReviewDetailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getReviewDetailRef:
```typescript
const name = getReviewDetailRef.operationName;
console.log(name);
```

### Variables
The `getReviewDetail` query requires an argument of type `GetReviewDetailVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetReviewDetailVariables {
  id: UUIDString;
  currentUserId?: string | null;
}
```
### Return Type
Recall that executing the `getReviewDetail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetReviewDetailData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetReviewDetailData {
  spiritReview?: {
    id: UUIDString;
    rating: number;
    title?: string | null;
    content: string;
    nose?: string | null;
    palate?: string | null;
    finish?: string | null;
    likes?: number | null;
    imageUrls?: string[] | null;
    createdAt: TimestampString;
    spirit: {
      id: string;
      name: string;
      nameEn?: string | null;
      imageUrl: string;
      category: string;
      distillery?: string | null;
      abv?: number | null;
    } & Spirit_Key;
      user: {
        id: string;
        nickname?: string | null;
        profileImage?: string | null;
      } & User_Key;
        comments: ({
          id: UUIDString;
          content?: string | null;
          createdAt?: TimestampString | null;
          user: {
            id: string;
            nickname?: string | null;
            profileImage?: string | null;
          } & User_Key;
        } & ReviewComment_Key)[];
          userLike: ({
            userId: string;
          })[];
  } & SpiritReview_Key;
}
```
### Using `getReviewDetail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getReviewDetail, GetReviewDetailVariables } from '@dataconnect/generated';

// The `getReviewDetail` query requires an argument of type `GetReviewDetailVariables`:
const getReviewDetailVars: GetReviewDetailVariables = {
  id: ..., 
  currentUserId: ..., // optional
};

// Call the `getReviewDetail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getReviewDetail(getReviewDetailVars);
// Variables can be defined inline as well.
const { data } = await getReviewDetail({ id: ..., currentUserId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getReviewDetail(dataConnect, getReviewDetailVars);

console.log(data.spiritReview);

// Or, you can use the `Promise` API.
getReviewDetail(getReviewDetailVars).then((response) => {
  const data = response.data;
  console.log(data.spiritReview);
});
```

### Using `getReviewDetail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getReviewDetailRef, GetReviewDetailVariables } from '@dataconnect/generated';

// The `getReviewDetail` query requires an argument of type `GetReviewDetailVariables`:
const getReviewDetailVars: GetReviewDetailVariables = {
  id: ..., 
  currentUserId: ..., // optional
};

// Call the `getReviewDetailRef()` function to get a reference to the query.
const ref = getReviewDetailRef(getReviewDetailVars);
// Variables can be defined inline as well.
const ref = getReviewDetailRef({ id: ..., currentUserId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getReviewDetailRef(dataConnect, getReviewDetailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.spiritReview);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.spiritReview);
});
```

## listReviewComments
You can execute the `listReviewComments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listReviewComments(vars: ListReviewCommentsVariables, options?: ExecuteQueryOptions): QueryPromise<ListReviewCommentsData, ListReviewCommentsVariables>;

interface ListReviewCommentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReviewCommentsVariables): QueryRef<ListReviewCommentsData, ListReviewCommentsVariables>;
}
export const listReviewCommentsRef: ListReviewCommentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listReviewComments(dc: DataConnect, vars: ListReviewCommentsVariables, options?: ExecuteQueryOptions): QueryPromise<ListReviewCommentsData, ListReviewCommentsVariables>;

interface ListReviewCommentsRef {
  ...
  (dc: DataConnect, vars: ListReviewCommentsVariables): QueryRef<ListReviewCommentsData, ListReviewCommentsVariables>;
}
export const listReviewCommentsRef: ListReviewCommentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listReviewCommentsRef:
```typescript
const name = listReviewCommentsRef.operationName;
console.log(name);
```

### Variables
The `listReviewComments` query requires an argument of type `ListReviewCommentsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListReviewCommentsVariables {
  reviewId: UUIDString;
}
```
### Return Type
Recall that executing the `listReviewComments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListReviewCommentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListReviewCommentsData {
  reviewComments: ({
    id: UUIDString;
    content?: string | null;
    createdAt?: TimestampString | null;
    user: {
      id: string;
      nickname?: string | null;
      profileImage?: string | null;
    } & User_Key;
  } & ReviewComment_Key)[];
}
```
### Using `listReviewComments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listReviewComments, ListReviewCommentsVariables } from '@dataconnect/generated';

// The `listReviewComments` query requires an argument of type `ListReviewCommentsVariables`:
const listReviewCommentsVars: ListReviewCommentsVariables = {
  reviewId: ..., 
};

// Call the `listReviewComments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listReviewComments(listReviewCommentsVars);
// Variables can be defined inline as well.
const { data } = await listReviewComments({ reviewId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listReviewComments(dataConnect, listReviewCommentsVars);

console.log(data.reviewComments);

// Or, you can use the `Promise` API.
listReviewComments(listReviewCommentsVars).then((response) => {
  const data = response.data;
  console.log(data.reviewComments);
});
```

### Using `listReviewComments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listReviewCommentsRef, ListReviewCommentsVariables } from '@dataconnect/generated';

// The `listReviewComments` query requires an argument of type `ListReviewCommentsVariables`:
const listReviewCommentsVars: ListReviewCommentsVariables = {
  reviewId: ..., 
};

// Call the `listReviewCommentsRef()` function to get a reference to the query.
const ref = listReviewCommentsRef(listReviewCommentsVars);
// Variables can be defined inline as well.
const ref = listReviewCommentsRef({ reviewId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listReviewCommentsRef(dataConnect, listReviewCommentsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reviewComments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reviewComments);
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
import { connectorConfig, listSpiritsForSitemap } from '@dataconnect/generated';


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
import { connectorConfig, listSpiritsForSitemapRef } from '@dataconnect/generated';


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
import { connectorConfig, getWorldCupResult, GetWorldCupResultVariables } from '@dataconnect/generated';

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
import { connectorConfig, getWorldCupResultRef, GetWorldCupResultVariables } from '@dataconnect/generated';

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
import { connectorConfig, listSpiritsForWorldCup, ListSpiritsForWorldCupVariables } from '@dataconnect/generated';

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
import { connectorConfig, listSpiritsForWorldCupRef, ListSpiritsForWorldCupVariables } from '@dataconnect/generated';

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

## listAllSpiritsForWorldCup
You can execute the `listAllSpiritsForWorldCup` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllSpiritsForWorldCup(options?: ExecuteQueryOptions): QueryPromise<ListAllSpiritsForWorldCupData, undefined>;

interface ListAllSpiritsForWorldCupRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllSpiritsForWorldCupData, undefined>;
}
export const listAllSpiritsForWorldCupRef: ListAllSpiritsForWorldCupRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllSpiritsForWorldCup(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllSpiritsForWorldCupData, undefined>;

interface ListAllSpiritsForWorldCupRef {
  ...
  (dc: DataConnect): QueryRef<ListAllSpiritsForWorldCupData, undefined>;
}
export const listAllSpiritsForWorldCupRef: ListAllSpiritsForWorldCupRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllSpiritsForWorldCupRef:
```typescript
const name = listAllSpiritsForWorldCupRef.operationName;
console.log(name);
```

### Variables
The `listAllSpiritsForWorldCup` query has no variables.
### Return Type
Recall that executing the `listAllSpiritsForWorldCup` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllSpiritsForWorldCupData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllSpiritsForWorldCupData {
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
### Using `listAllSpiritsForWorldCup`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllSpiritsForWorldCup } from '@dataconnect/generated';


// Call the `listAllSpiritsForWorldCup()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllSpiritsForWorldCup();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllSpiritsForWorldCup(dataConnect);

console.log(data.spirits);

// Or, you can use the `Promise` API.
listAllSpiritsForWorldCup().then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

### Using `listAllSpiritsForWorldCup`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllSpiritsForWorldCupRef } from '@dataconnect/generated';


// Call the `listAllSpiritsForWorldCupRef()` function to get a reference to the query.
const ref = listAllSpiritsForWorldCupRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllSpiritsForWorldCupRef(dataConnect);

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

## listSpiritsByCategoryForWorldCup
You can execute the `listSpiritsByCategoryForWorldCup` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSpiritsByCategoryForWorldCup(vars?: ListSpiritsByCategoryForWorldCupVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritsByCategoryForWorldCupData, ListSpiritsByCategoryForWorldCupVariables>;

interface ListSpiritsByCategoryForWorldCupRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListSpiritsByCategoryForWorldCupVariables): QueryRef<ListSpiritsByCategoryForWorldCupData, ListSpiritsByCategoryForWorldCupVariables>;
}
export const listSpiritsByCategoryForWorldCupRef: ListSpiritsByCategoryForWorldCupRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSpiritsByCategoryForWorldCup(dc: DataConnect, vars?: ListSpiritsByCategoryForWorldCupVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritsByCategoryForWorldCupData, ListSpiritsByCategoryForWorldCupVariables>;

interface ListSpiritsByCategoryForWorldCupRef {
  ...
  (dc: DataConnect, vars?: ListSpiritsByCategoryForWorldCupVariables): QueryRef<ListSpiritsByCategoryForWorldCupData, ListSpiritsByCategoryForWorldCupVariables>;
}
export const listSpiritsByCategoryForWorldCupRef: ListSpiritsByCategoryForWorldCupRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSpiritsByCategoryForWorldCupRef:
```typescript
const name = listSpiritsByCategoryForWorldCupRef.operationName;
console.log(name);
```

### Variables
The `listSpiritsByCategoryForWorldCup` query has an optional argument of type `ListSpiritsByCategoryForWorldCupVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListSpiritsByCategoryForWorldCupVariables {
  category?: string | null;
}
```
### Return Type
Recall that executing the `listSpiritsByCategoryForWorldCup` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSpiritsByCategoryForWorldCupData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSpiritsByCategoryForWorldCupData {
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
### Using `listSpiritsByCategoryForWorldCup`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSpiritsByCategoryForWorldCup, ListSpiritsByCategoryForWorldCupVariables } from '@dataconnect/generated';

// The `listSpiritsByCategoryForWorldCup` query has an optional argument of type `ListSpiritsByCategoryForWorldCupVariables`:
const listSpiritsByCategoryForWorldCupVars: ListSpiritsByCategoryForWorldCupVariables = {
  category: ..., // optional
};

// Call the `listSpiritsByCategoryForWorldCup()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSpiritsByCategoryForWorldCup(listSpiritsByCategoryForWorldCupVars);
// Variables can be defined inline as well.
const { data } = await listSpiritsByCategoryForWorldCup({ category: ..., });
// Since all variables are optional for this query, you can omit the `ListSpiritsByCategoryForWorldCupVariables` argument.
const { data } = await listSpiritsByCategoryForWorldCup();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSpiritsByCategoryForWorldCup(dataConnect, listSpiritsByCategoryForWorldCupVars);

console.log(data.spirits);

// Or, you can use the `Promise` API.
listSpiritsByCategoryForWorldCup(listSpiritsByCategoryForWorldCupVars).then((response) => {
  const data = response.data;
  console.log(data.spirits);
});
```

### Using `listSpiritsByCategoryForWorldCup`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSpiritsByCategoryForWorldCupRef, ListSpiritsByCategoryForWorldCupVariables } from '@dataconnect/generated';

// The `listSpiritsByCategoryForWorldCup` query has an optional argument of type `ListSpiritsByCategoryForWorldCupVariables`:
const listSpiritsByCategoryForWorldCupVars: ListSpiritsByCategoryForWorldCupVariables = {
  category: ..., // optional
};

// Call the `listSpiritsByCategoryForWorldCupRef()` function to get a reference to the query.
const ref = listSpiritsByCategoryForWorldCupRef(listSpiritsByCategoryForWorldCupVars);
// Variables can be defined inline as well.
const ref = listSpiritsByCategoryForWorldCupRef({ category: ..., });
// Since all variables are optional for this query, you can omit the `ListSpiritsByCategoryForWorldCupVariables` argument.
const ref = listSpiritsByCategoryForWorldCupRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSpiritsByCategoryForWorldCupRef(dataConnect, listSpiritsByCategoryForWorldCupVars);

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

## listAiDiscoveryLogs
You can execute the `listAiDiscoveryLogs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAiDiscoveryLogs(vars: ListAiDiscoveryLogsVariables, options?: ExecuteQueryOptions): QueryPromise<ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables>;

interface ListAiDiscoveryLogsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListAiDiscoveryLogsVariables): QueryRef<ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables>;
}
export const listAiDiscoveryLogsRef: ListAiDiscoveryLogsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAiDiscoveryLogs(dc: DataConnect, vars: ListAiDiscoveryLogsVariables, options?: ExecuteQueryOptions): QueryPromise<ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables>;

interface ListAiDiscoveryLogsRef {
  ...
  (dc: DataConnect, vars: ListAiDiscoveryLogsVariables): QueryRef<ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables>;
}
export const listAiDiscoveryLogsRef: ListAiDiscoveryLogsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAiDiscoveryLogsRef:
```typescript
const name = listAiDiscoveryLogsRef.operationName;
console.log(name);
```

### Variables
The `listAiDiscoveryLogs` query requires an argument of type `ListAiDiscoveryLogsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListAiDiscoveryLogsVariables {
  limit: number;
}
```
### Return Type
Recall that executing the `listAiDiscoveryLogs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAiDiscoveryLogsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAiDiscoveryLogsData {
  aiDiscoveryLogs: ({
    id: string;
    userId?: string | null;
    analysis?: string | null;
    recommendations?: unknown | null;
    messageHistory?: unknown | null;
    createdAt?: TimestampString | null;
  } & AiDiscoveryLog_Key)[];
}
```
### Using `listAiDiscoveryLogs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAiDiscoveryLogs, ListAiDiscoveryLogsVariables } from '@dataconnect/generated';

// The `listAiDiscoveryLogs` query requires an argument of type `ListAiDiscoveryLogsVariables`:
const listAiDiscoveryLogsVars: ListAiDiscoveryLogsVariables = {
  limit: ..., 
};

// Call the `listAiDiscoveryLogs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAiDiscoveryLogs(listAiDiscoveryLogsVars);
// Variables can be defined inline as well.
const { data } = await listAiDiscoveryLogs({ limit: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAiDiscoveryLogs(dataConnect, listAiDiscoveryLogsVars);

console.log(data.aiDiscoveryLogs);

// Or, you can use the `Promise` API.
listAiDiscoveryLogs(listAiDiscoveryLogsVars).then((response) => {
  const data = response.data;
  console.log(data.aiDiscoveryLogs);
});
```

### Using `listAiDiscoveryLogs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAiDiscoveryLogsRef, ListAiDiscoveryLogsVariables } from '@dataconnect/generated';

// The `listAiDiscoveryLogs` query requires an argument of type `ListAiDiscoveryLogsVariables`:
const listAiDiscoveryLogsVars: ListAiDiscoveryLogsVariables = {
  limit: ..., 
};

// Call the `listAiDiscoveryLogsRef()` function to get a reference to the query.
const ref = listAiDiscoveryLogsRef(listAiDiscoveryLogsVars);
// Variables can be defined inline as well.
const ref = listAiDiscoveryLogsRef({ limit: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAiDiscoveryLogsRef(dataConnect, listAiDiscoveryLogsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.aiDiscoveryLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.aiDiscoveryLogs);
});
```

## listModificationRequests
You can execute the `listModificationRequests` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listModificationRequests(options?: ExecuteQueryOptions): QueryPromise<ListModificationRequestsData, undefined>;

interface ListModificationRequestsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListModificationRequestsData, undefined>;
}
export const listModificationRequestsRef: ListModificationRequestsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listModificationRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListModificationRequestsData, undefined>;

interface ListModificationRequestsRef {
  ...
  (dc: DataConnect): QueryRef<ListModificationRequestsData, undefined>;
}
export const listModificationRequestsRef: ListModificationRequestsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listModificationRequestsRef:
```typescript
const name = listModificationRequestsRef.operationName;
console.log(name);
```

### Variables
The `listModificationRequests` query has no variables.
### Return Type
Recall that executing the `listModificationRequests` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListModificationRequestsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListModificationRequestsData {
  modificationRequests: ({
    id: string;
    spiritId: string;
    spiritName?: string | null;
    userId?: string | null;
    title: string;
    content: string;
    status?: string | null;
    createdAt?: TimestampString | null;
  } & ModificationRequest_Key)[];
}
```
### Using `listModificationRequests`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listModificationRequests } from '@dataconnect/generated';


// Call the `listModificationRequests()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listModificationRequests();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listModificationRequests(dataConnect);

console.log(data.modificationRequests);

// Or, you can use the `Promise` API.
listModificationRequests().then((response) => {
  const data = response.data;
  console.log(data.modificationRequests);
});
```

### Using `listModificationRequests`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listModificationRequestsRef } from '@dataconnect/generated';


// Call the `listModificationRequestsRef()` function to get a reference to the query.
const ref = listModificationRequestsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listModificationRequestsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.modificationRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.modificationRequests);
});
```

## listUserCabinet
You can execute the `listUserCabinet` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserCabinet(vars: ListUserCabinetVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserCabinetData, ListUserCabinetVariables>;

interface ListUserCabinetRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserCabinetVariables): QueryRef<ListUserCabinetData, ListUserCabinetVariables>;
}
export const listUserCabinetRef: ListUserCabinetRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserCabinet(dc: DataConnect, vars: ListUserCabinetVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserCabinetData, ListUserCabinetVariables>;

interface ListUserCabinetRef {
  ...
  (dc: DataConnect, vars: ListUserCabinetVariables): QueryRef<ListUserCabinetData, ListUserCabinetVariables>;
}
export const listUserCabinetRef: ListUserCabinetRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserCabinetRef:
```typescript
const name = listUserCabinetRef.operationName;
console.log(name);
```

### Variables
The `listUserCabinet` query requires an argument of type `ListUserCabinetVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListUserCabinetVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `listUserCabinet` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserCabinetData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUserCabinetData {
  userCabinets: ({
    spiritId: string;
    isFavorite?: boolean | null;
    isWishlist?: boolean | null;
    notes?: string | null;
    rating?: number | null;
    spirit: {
      id: string;
      name: string;
      category: string;
      imageUrl: string;
      thumbnailUrl?: string | null;
      abv?: number | null;
      distillery?: string | null;
    } & Spirit_Key;
  })[];
}
```
### Using `listUserCabinet`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserCabinet, ListUserCabinetVariables } from '@dataconnect/generated';

// The `listUserCabinet` query requires an argument of type `ListUserCabinetVariables`:
const listUserCabinetVars: ListUserCabinetVariables = {
  userId: ..., 
};

// Call the `listUserCabinet()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserCabinet(listUserCabinetVars);
// Variables can be defined inline as well.
const { data } = await listUserCabinet({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserCabinet(dataConnect, listUserCabinetVars);

console.log(data.userCabinets);

// Or, you can use the `Promise` API.
listUserCabinet(listUserCabinetVars).then((response) => {
  const data = response.data;
  console.log(data.userCabinets);
});
```

### Using `listUserCabinet`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserCabinetRef, ListUserCabinetVariables } from '@dataconnect/generated';

// The `listUserCabinet` query requires an argument of type `ListUserCabinetVariables`:
const listUserCabinetVars: ListUserCabinetVariables = {
  userId: ..., 
};

// Call the `listUserCabinetRef()` function to get a reference to the query.
const ref = listUserCabinetRef(listUserCabinetVars);
// Variables can be defined inline as well.
const ref = listUserCabinetRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserCabinetRef(dataConnect, listUserCabinetVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userCabinets);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userCabinets);
});
```

## listUserReviews
You can execute the `listUserReviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserReviews(vars: ListUserReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserReviewsData, ListUserReviewsVariables>;

interface ListUserReviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserReviewsVariables): QueryRef<ListUserReviewsData, ListUserReviewsVariables>;
}
export const listUserReviewsRef: ListUserReviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserReviews(dc: DataConnect, vars: ListUserReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserReviewsData, ListUserReviewsVariables>;

interface ListUserReviewsRef {
  ...
  (dc: DataConnect, vars: ListUserReviewsVariables): QueryRef<ListUserReviewsData, ListUserReviewsVariables>;
}
export const listUserReviewsRef: ListUserReviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserReviewsRef:
```typescript
const name = listUserReviewsRef.operationName;
console.log(name);
```

### Variables
The `listUserReviews` query requires an argument of type `ListUserReviewsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListUserReviewsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `listUserReviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserReviewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUserReviewsData {
  spiritReviews: ({
    id: UUIDString;
    spiritId: string;
    rating: number;
    content: string;
    nose?: string | null;
    palate?: string | null;
    finish?: string | null;
    createdAt: TimestampString;
  } & SpiritReview_Key)[];
}
```
### Using `listUserReviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserReviews, ListUserReviewsVariables } from '@dataconnect/generated';

// The `listUserReviews` query requires an argument of type `ListUserReviewsVariables`:
const listUserReviewsVars: ListUserReviewsVariables = {
  userId: ..., 
};

// Call the `listUserReviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserReviews(listUserReviewsVars);
// Variables can be defined inline as well.
const { data } = await listUserReviews({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserReviews(dataConnect, listUserReviewsVars);

console.log(data.spiritReviews);

// Or, you can use the `Promise` API.
listUserReviews(listUserReviewsVars).then((response) => {
  const data = response.data;
  console.log(data.spiritReviews);
});
```

### Using `listUserReviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserReviewsRef, ListUserReviewsVariables } from '@dataconnect/generated';

// The `listUserReviews` query requires an argument of type `ListUserReviewsVariables`:
const listUserReviewsVars: ListUserReviewsVariables = {
  userId: ..., 
};

// Call the `listUserReviewsRef()` function to get a reference to the query.
const ref = listUserReviewsRef(listUserReviewsVars);
// Variables can be defined inline as well.
const ref = listUserReviewsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserReviewsRef(dataConnect, listUserReviewsVars);

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

## getReviewLike
You can execute the `getReviewLike` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getReviewLike(vars: GetReviewLikeVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewLikeData, GetReviewLikeVariables>;

interface GetReviewLikeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReviewLikeVariables): QueryRef<GetReviewLikeData, GetReviewLikeVariables>;
}
export const getReviewLikeRef: GetReviewLikeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getReviewLike(dc: DataConnect, vars: GetReviewLikeVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewLikeData, GetReviewLikeVariables>;

interface GetReviewLikeRef {
  ...
  (dc: DataConnect, vars: GetReviewLikeVariables): QueryRef<GetReviewLikeData, GetReviewLikeVariables>;
}
export const getReviewLikeRef: GetReviewLikeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getReviewLikeRef:
```typescript
const name = getReviewLikeRef.operationName;
console.log(name);
```

### Variables
The `getReviewLike` query requires an argument of type `GetReviewLikeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetReviewLikeVariables {
  userId: string;
  reviewId: UUIDString;
}
```
### Return Type
Recall that executing the `getReviewLike` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetReviewLikeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetReviewLikeData {
  reviewLike?: {
    userId: string;
    reviewId: UUIDString;
  } & ReviewLike_Key;
}
```
### Using `getReviewLike`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getReviewLike, GetReviewLikeVariables } from '@dataconnect/generated';

// The `getReviewLike` query requires an argument of type `GetReviewLikeVariables`:
const getReviewLikeVars: GetReviewLikeVariables = {
  userId: ..., 
  reviewId: ..., 
};

// Call the `getReviewLike()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getReviewLike(getReviewLikeVars);
// Variables can be defined inline as well.
const { data } = await getReviewLike({ userId: ..., reviewId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getReviewLike(dataConnect, getReviewLikeVars);

console.log(data.reviewLike);

// Or, you can use the `Promise` API.
getReviewLike(getReviewLikeVars).then((response) => {
  const data = response.data;
  console.log(data.reviewLike);
});
```

### Using `getReviewLike`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getReviewLikeRef, GetReviewLikeVariables } from '@dataconnect/generated';

// The `getReviewLike` query requires an argument of type `GetReviewLikeVariables`:
const getReviewLikeVars: GetReviewLikeVariables = {
  userId: ..., 
  reviewId: ..., 
};

// Call the `getReviewLikeRef()` function to get a reference to the query.
const ref = getReviewLikeRef(getReviewLikeVars);
// Variables can be defined inline as well.
const ref = getReviewLikeRef({ userId: ..., reviewId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getReviewLikeRef(dataConnect, getReviewLikeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reviewLike);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reviewLike);
});
```

## listReviewLikes
You can execute the `listReviewLikes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listReviewLikes(vars: ListReviewLikesVariables, options?: ExecuteQueryOptions): QueryPromise<ListReviewLikesData, ListReviewLikesVariables>;

interface ListReviewLikesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReviewLikesVariables): QueryRef<ListReviewLikesData, ListReviewLikesVariables>;
}
export const listReviewLikesRef: ListReviewLikesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listReviewLikes(dc: DataConnect, vars: ListReviewLikesVariables, options?: ExecuteQueryOptions): QueryPromise<ListReviewLikesData, ListReviewLikesVariables>;

interface ListReviewLikesRef {
  ...
  (dc: DataConnect, vars: ListReviewLikesVariables): QueryRef<ListReviewLikesData, ListReviewLikesVariables>;
}
export const listReviewLikesRef: ListReviewLikesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listReviewLikesRef:
```typescript
const name = listReviewLikesRef.operationName;
console.log(name);
```

### Variables
The `listReviewLikes` query requires an argument of type `ListReviewLikesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListReviewLikesVariables {
  reviewId: UUIDString;
}
```
### Return Type
Recall that executing the `listReviewLikes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListReviewLikesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListReviewLikesData {
  reviewLikes: ({
    userId: string;
  })[];
}
```
### Using `listReviewLikes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listReviewLikes, ListReviewLikesVariables } from '@dataconnect/generated';

// The `listReviewLikes` query requires an argument of type `ListReviewLikesVariables`:
const listReviewLikesVars: ListReviewLikesVariables = {
  reviewId: ..., 
};

// Call the `listReviewLikes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listReviewLikes(listReviewLikesVars);
// Variables can be defined inline as well.
const { data } = await listReviewLikes({ reviewId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listReviewLikes(dataConnect, listReviewLikesVars);

console.log(data.reviewLikes);

// Or, you can use the `Promise` API.
listReviewLikes(listReviewLikesVars).then((response) => {
  const data = response.data;
  console.log(data.reviewLikes);
});
```

### Using `listReviewLikes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listReviewLikesRef, ListReviewLikesVariables } from '@dataconnect/generated';

// The `listReviewLikes` query requires an argument of type `ListReviewLikesVariables`:
const listReviewLikesVars: ListReviewLikesVariables = {
  reviewId: ..., 
};

// Call the `listReviewLikesRef()` function to get a reference to the query.
const ref = listReviewLikesRef(listReviewLikesVars);
// Variables can be defined inline as well.
const ref = listReviewLikesRef({ reviewId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listReviewLikesRef(dataConnect, listReviewLikesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reviewLikes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reviewLikes);
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
  tasteProfile?: unknown | null;
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
import { connectorConfig, upsertUser, UpsertUserVariables } from '@dataconnect/generated';

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
  tasteProfile: ..., // optional
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ id: ..., email: ..., nickname: ..., profileImage: ..., role: ..., themePreference: ..., isFirstLogin: ..., reviewsWritten: ..., heartsReceived: ..., tasteProfile: ..., });

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
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@dataconnect/generated';

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
  tasteProfile: ..., // optional
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ id: ..., email: ..., nickname: ..., profileImage: ..., role: ..., themePreference: ..., isFirstLogin: ..., reviewsWritten: ..., heartsReceived: ..., tasteProfile: ..., });

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
  reviewedBy?: string | null;
  reviewedAt?: TimestampString | null;
  rating?: number | null;
  reviewCount?: number | null;
  importer?: string | null;
  rawCategory?: string | null;
  metadata?: unknown | null;
  updatedAt?: TimestampString | null;
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
import { connectorConfig, upsertSpirit, UpsertSpiritVariables } from '@dataconnect/generated';

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
  reviewedBy: ..., // optional
  reviewedAt: ..., // optional
  rating: ..., // optional
  reviewCount: ..., // optional
  importer: ..., // optional
  rawCategory: ..., // optional
  metadata: ..., // optional
  updatedAt: ..., // optional
};

// Call the `upsertSpirit()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertSpirit(upsertSpiritVars);
// Variables can be defined inline as well.
const { data } = await upsertSpirit({ id: ..., name: ..., nameEn: ..., category: ..., categoryEn: ..., mainCategory: ..., subcategory: ..., distillery: ..., bottler: ..., abv: ..., volume: ..., country: ..., region: ..., imageUrl: ..., thumbnailUrl: ..., descriptionKo: ..., descriptionEn: ..., pairingGuideKo: ..., pairingGuideEn: ..., noseTags: ..., palateTags: ..., finishTags: ..., tastingNote: ..., status: ..., isPublished: ..., isReviewed: ..., reviewedBy: ..., reviewedAt: ..., rating: ..., reviewCount: ..., importer: ..., rawCategory: ..., metadata: ..., updatedAt: ..., });

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
import { connectorConfig, upsertSpiritRef, UpsertSpiritVariables } from '@dataconnect/generated';

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
  reviewedBy: ..., // optional
  reviewedAt: ..., // optional
  rating: ..., // optional
  reviewCount: ..., // optional
  importer: ..., // optional
  rawCategory: ..., // optional
  metadata: ..., // optional
  updatedAt: ..., // optional
};

// Call the `upsertSpiritRef()` function to get a reference to the mutation.
const ref = upsertSpiritRef(upsertSpiritVars);
// Variables can be defined inline as well.
const ref = upsertSpiritRef({ id: ..., name: ..., nameEn: ..., category: ..., categoryEn: ..., mainCategory: ..., subcategory: ..., distillery: ..., bottler: ..., abv: ..., volume: ..., country: ..., region: ..., imageUrl: ..., thumbnailUrl: ..., descriptionKo: ..., descriptionEn: ..., pairingGuideKo: ..., pairingGuideEn: ..., noseTags: ..., palateTags: ..., finishTags: ..., tastingNote: ..., status: ..., isPublished: ..., isReviewed: ..., reviewedBy: ..., reviewedAt: ..., rating: ..., reviewCount: ..., importer: ..., rawCategory: ..., metadata: ..., updatedAt: ..., });

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

## upsertNewArrival
You can execute the `upsertNewArrival` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertNewArrival(vars: UpsertNewArrivalVariables): MutationPromise<UpsertNewArrivalData, UpsertNewArrivalVariables>;

interface UpsertNewArrivalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertNewArrivalVariables): MutationRef<UpsertNewArrivalData, UpsertNewArrivalVariables>;
}
export const upsertNewArrivalRef: UpsertNewArrivalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertNewArrival(dc: DataConnect, vars: UpsertNewArrivalVariables): MutationPromise<UpsertNewArrivalData, UpsertNewArrivalVariables>;

interface UpsertNewArrivalRef {
  ...
  (dc: DataConnect, vars: UpsertNewArrivalVariables): MutationRef<UpsertNewArrivalData, UpsertNewArrivalVariables>;
}
export const upsertNewArrivalRef: UpsertNewArrivalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertNewArrivalRef:
```typescript
const name = upsertNewArrivalRef.operationName;
console.log(name);
```

### Variables
The `upsertNewArrival` mutation requires an argument of type `UpsertNewArrivalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertNewArrivalVariables {
  id: string;
  spiritId: string;
  displayOrder?: number | null;
  tags?: string[] | null;
}
```
### Return Type
Recall that executing the `upsertNewArrival` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertNewArrivalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertNewArrivalData {
  newArrival_upsert: NewArrival_Key;
}
```
### Using `upsertNewArrival`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertNewArrival, UpsertNewArrivalVariables } from '@dataconnect/generated';

// The `upsertNewArrival` mutation requires an argument of type `UpsertNewArrivalVariables`:
const upsertNewArrivalVars: UpsertNewArrivalVariables = {
  id: ..., 
  spiritId: ..., 
  displayOrder: ..., // optional
  tags: ..., // optional
};

// Call the `upsertNewArrival()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertNewArrival(upsertNewArrivalVars);
// Variables can be defined inline as well.
const { data } = await upsertNewArrival({ id: ..., spiritId: ..., displayOrder: ..., tags: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertNewArrival(dataConnect, upsertNewArrivalVars);

console.log(data.newArrival_upsert);

// Or, you can use the `Promise` API.
upsertNewArrival(upsertNewArrivalVars).then((response) => {
  const data = response.data;
  console.log(data.newArrival_upsert);
});
```

### Using `upsertNewArrival`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertNewArrivalRef, UpsertNewArrivalVariables } from '@dataconnect/generated';

// The `upsertNewArrival` mutation requires an argument of type `UpsertNewArrivalVariables`:
const upsertNewArrivalVars: UpsertNewArrivalVariables = {
  id: ..., 
  spiritId: ..., 
  displayOrder: ..., // optional
  tags: ..., // optional
};

// Call the `upsertNewArrivalRef()` function to get a reference to the mutation.
const ref = upsertNewArrivalRef(upsertNewArrivalVars);
// Variables can be defined inline as well.
const ref = upsertNewArrivalRef({ id: ..., spiritId: ..., displayOrder: ..., tags: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertNewArrivalRef(dataConnect, upsertNewArrivalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.newArrival_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.newArrival_upsert);
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
import { connectorConfig, upsertReview, UpsertReviewVariables } from '@dataconnect/generated';

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
  isPublished: ..., // optional
  imageUrls: ..., // optional
  createdAt: ..., // optional
  updatedAt: ..., // optional
};

// Call the `upsertReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertReview(upsertReviewVars);
// Variables can be defined inline as well.
const { data } = await upsertReview({ id: ..., spiritId: ..., userId: ..., rating: ..., title: ..., content: ..., nose: ..., palate: ..., finish: ..., likes: ..., isPublished: ..., imageUrls: ..., createdAt: ..., updatedAt: ..., });

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
import { connectorConfig, upsertReviewRef, UpsertReviewVariables } from '@dataconnect/generated';

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
  isPublished: ..., // optional
  imageUrls: ..., // optional
  createdAt: ..., // optional
  updatedAt: ..., // optional
};

// Call the `upsertReviewRef()` function to get a reference to the mutation.
const ref = upsertReviewRef(upsertReviewVars);
// Variables can be defined inline as well.
const ref = upsertReviewRef({ id: ..., spiritId: ..., userId: ..., rating: ..., title: ..., content: ..., nose: ..., palate: ..., finish: ..., likes: ..., isPublished: ..., imageUrls: ..., createdAt: ..., updatedAt: ..., });

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

## updateReviewLikesCount
You can execute the `updateReviewLikesCount` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateReviewLikesCount(vars: UpdateReviewLikesCountVariables): MutationPromise<UpdateReviewLikesCountData, UpdateReviewLikesCountVariables>;

interface UpdateReviewLikesCountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReviewLikesCountVariables): MutationRef<UpdateReviewLikesCountData, UpdateReviewLikesCountVariables>;
}
export const updateReviewLikesCountRef: UpdateReviewLikesCountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateReviewLikesCount(dc: DataConnect, vars: UpdateReviewLikesCountVariables): MutationPromise<UpdateReviewLikesCountData, UpdateReviewLikesCountVariables>;

interface UpdateReviewLikesCountRef {
  ...
  (dc: DataConnect, vars: UpdateReviewLikesCountVariables): MutationRef<UpdateReviewLikesCountData, UpdateReviewLikesCountVariables>;
}
export const updateReviewLikesCountRef: UpdateReviewLikesCountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateReviewLikesCountRef:
```typescript
const name = updateReviewLikesCountRef.operationName;
console.log(name);
```

### Variables
The `updateReviewLikesCount` mutation requires an argument of type `UpdateReviewLikesCountVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateReviewLikesCountVariables {
  id: UUIDString;
  likes?: number | null;
}
```
### Return Type
Recall that executing the `updateReviewLikesCount` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateReviewLikesCountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateReviewLikesCountData {
  spiritReview_update?: SpiritReview_Key | null;
}
```
### Using `updateReviewLikesCount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateReviewLikesCount, UpdateReviewLikesCountVariables } from '@dataconnect/generated';

// The `updateReviewLikesCount` mutation requires an argument of type `UpdateReviewLikesCountVariables`:
const updateReviewLikesCountVars: UpdateReviewLikesCountVariables = {
  id: ..., 
  likes: ..., // optional
};

// Call the `updateReviewLikesCount()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateReviewLikesCount(updateReviewLikesCountVars);
// Variables can be defined inline as well.
const { data } = await updateReviewLikesCount({ id: ..., likes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateReviewLikesCount(dataConnect, updateReviewLikesCountVars);

console.log(data.spiritReview_update);

// Or, you can use the `Promise` API.
updateReviewLikesCount(updateReviewLikesCountVars).then((response) => {
  const data = response.data;
  console.log(data.spiritReview_update);
});
```

### Using `updateReviewLikesCount`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateReviewLikesCountRef, UpdateReviewLikesCountVariables } from '@dataconnect/generated';

// The `updateReviewLikesCount` mutation requires an argument of type `UpdateReviewLikesCountVariables`:
const updateReviewLikesCountVars: UpdateReviewLikesCountVariables = {
  id: ..., 
  likes: ..., // optional
};

// Call the `updateReviewLikesCountRef()` function to get a reference to the mutation.
const ref = updateReviewLikesCountRef(updateReviewLikesCountVars);
// Variables can be defined inline as well.
const ref = updateReviewLikesCountRef({ id: ..., likes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateReviewLikesCountRef(dataConnect, updateReviewLikesCountVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.spiritReview_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.spiritReview_update);
});
```

## upsertReviewLike
You can execute the `upsertReviewLike` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertReviewLike(vars: UpsertReviewLikeVariables): MutationPromise<UpsertReviewLikeData, UpsertReviewLikeVariables>;

interface UpsertReviewLikeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertReviewLikeVariables): MutationRef<UpsertReviewLikeData, UpsertReviewLikeVariables>;
}
export const upsertReviewLikeRef: UpsertReviewLikeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertReviewLike(dc: DataConnect, vars: UpsertReviewLikeVariables): MutationPromise<UpsertReviewLikeData, UpsertReviewLikeVariables>;

interface UpsertReviewLikeRef {
  ...
  (dc: DataConnect, vars: UpsertReviewLikeVariables): MutationRef<UpsertReviewLikeData, UpsertReviewLikeVariables>;
}
export const upsertReviewLikeRef: UpsertReviewLikeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertReviewLikeRef:
```typescript
const name = upsertReviewLikeRef.operationName;
console.log(name);
```

### Variables
The `upsertReviewLike` mutation requires an argument of type `UpsertReviewLikeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertReviewLikeVariables {
  userId: string;
  reviewId: UUIDString;
}
```
### Return Type
Recall that executing the `upsertReviewLike` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertReviewLikeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertReviewLikeData {
  reviewLike_upsert: ReviewLike_Key;
}
```
### Using `upsertReviewLike`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertReviewLike, UpsertReviewLikeVariables } from '@dataconnect/generated';

// The `upsertReviewLike` mutation requires an argument of type `UpsertReviewLikeVariables`:
const upsertReviewLikeVars: UpsertReviewLikeVariables = {
  userId: ..., 
  reviewId: ..., 
};

// Call the `upsertReviewLike()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertReviewLike(upsertReviewLikeVars);
// Variables can be defined inline as well.
const { data } = await upsertReviewLike({ userId: ..., reviewId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertReviewLike(dataConnect, upsertReviewLikeVars);

console.log(data.reviewLike_upsert);

// Or, you can use the `Promise` API.
upsertReviewLike(upsertReviewLikeVars).then((response) => {
  const data = response.data;
  console.log(data.reviewLike_upsert);
});
```

### Using `upsertReviewLike`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertReviewLikeRef, UpsertReviewLikeVariables } from '@dataconnect/generated';

// The `upsertReviewLike` mutation requires an argument of type `UpsertReviewLikeVariables`:
const upsertReviewLikeVars: UpsertReviewLikeVariables = {
  userId: ..., 
  reviewId: ..., 
};

// Call the `upsertReviewLikeRef()` function to get a reference to the mutation.
const ref = upsertReviewLikeRef(upsertReviewLikeVars);
// Variables can be defined inline as well.
const ref = upsertReviewLikeRef({ userId: ..., reviewId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertReviewLikeRef(dataConnect, upsertReviewLikeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reviewLike_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reviewLike_upsert);
});
```

## deleteReviewLike
You can execute the `deleteReviewLike` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteReviewLike(vars: DeleteReviewLikeVariables): MutationPromise<DeleteReviewLikeData, DeleteReviewLikeVariables>;

interface DeleteReviewLikeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewLikeVariables): MutationRef<DeleteReviewLikeData, DeleteReviewLikeVariables>;
}
export const deleteReviewLikeRef: DeleteReviewLikeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteReviewLike(dc: DataConnect, vars: DeleteReviewLikeVariables): MutationPromise<DeleteReviewLikeData, DeleteReviewLikeVariables>;

interface DeleteReviewLikeRef {
  ...
  (dc: DataConnect, vars: DeleteReviewLikeVariables): MutationRef<DeleteReviewLikeData, DeleteReviewLikeVariables>;
}
export const deleteReviewLikeRef: DeleteReviewLikeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteReviewLikeRef:
```typescript
const name = deleteReviewLikeRef.operationName;
console.log(name);
```

### Variables
The `deleteReviewLike` mutation requires an argument of type `DeleteReviewLikeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteReviewLikeVariables {
  userId: string;
  reviewId: UUIDString;
}
```
### Return Type
Recall that executing the `deleteReviewLike` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteReviewLikeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteReviewLikeData {
  reviewLike_delete?: ReviewLike_Key | null;
}
```
### Using `deleteReviewLike`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteReviewLike, DeleteReviewLikeVariables } from '@dataconnect/generated';

// The `deleteReviewLike` mutation requires an argument of type `DeleteReviewLikeVariables`:
const deleteReviewLikeVars: DeleteReviewLikeVariables = {
  userId: ..., 
  reviewId: ..., 
};

// Call the `deleteReviewLike()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteReviewLike(deleteReviewLikeVars);
// Variables can be defined inline as well.
const { data } = await deleteReviewLike({ userId: ..., reviewId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteReviewLike(dataConnect, deleteReviewLikeVars);

console.log(data.reviewLike_delete);

// Or, you can use the `Promise` API.
deleteReviewLike(deleteReviewLikeVars).then((response) => {
  const data = response.data;
  console.log(data.reviewLike_delete);
});
```

### Using `deleteReviewLike`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteReviewLikeRef, DeleteReviewLikeVariables } from '@dataconnect/generated';

// The `deleteReviewLike` mutation requires an argument of type `DeleteReviewLikeVariables`:
const deleteReviewLikeVars: DeleteReviewLikeVariables = {
  userId: ..., 
  reviewId: ..., 
};

// Call the `deleteReviewLikeRef()` function to get a reference to the mutation.
const ref = deleteReviewLikeRef(deleteReviewLikeVars);
// Variables can be defined inline as well.
const ref = deleteReviewLikeRef({ userId: ..., reviewId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteReviewLikeRef(dataConnect, deleteReviewLikeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reviewLike_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reviewLike_delete);
});
```

## upsertReviewComment
You can execute the `upsertReviewComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertReviewComment(vars: UpsertReviewCommentVariables): MutationPromise<UpsertReviewCommentData, UpsertReviewCommentVariables>;

interface UpsertReviewCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertReviewCommentVariables): MutationRef<UpsertReviewCommentData, UpsertReviewCommentVariables>;
}
export const upsertReviewCommentRef: UpsertReviewCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertReviewComment(dc: DataConnect, vars: UpsertReviewCommentVariables): MutationPromise<UpsertReviewCommentData, UpsertReviewCommentVariables>;

interface UpsertReviewCommentRef {
  ...
  (dc: DataConnect, vars: UpsertReviewCommentVariables): MutationRef<UpsertReviewCommentData, UpsertReviewCommentVariables>;
}
export const upsertReviewCommentRef: UpsertReviewCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertReviewCommentRef:
```typescript
const name = upsertReviewCommentRef.operationName;
console.log(name);
```

### Variables
The `upsertReviewComment` mutation requires an argument of type `UpsertReviewCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertReviewCommentVariables {
  id: UUIDString;
  reviewId: UUIDString;
  userId: string;
  content: string;
  updatedAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `upsertReviewComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertReviewCommentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertReviewCommentData {
  reviewComment_upsert: ReviewComment_Key;
}
```
### Using `upsertReviewComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertReviewComment, UpsertReviewCommentVariables } from '@dataconnect/generated';

// The `upsertReviewComment` mutation requires an argument of type `UpsertReviewCommentVariables`:
const upsertReviewCommentVars: UpsertReviewCommentVariables = {
  id: ..., 
  reviewId: ..., 
  userId: ..., 
  content: ..., 
  updatedAt: ..., // optional
};

// Call the `upsertReviewComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertReviewComment(upsertReviewCommentVars);
// Variables can be defined inline as well.
const { data } = await upsertReviewComment({ id: ..., reviewId: ..., userId: ..., content: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertReviewComment(dataConnect, upsertReviewCommentVars);

console.log(data.reviewComment_upsert);

// Or, you can use the `Promise` API.
upsertReviewComment(upsertReviewCommentVars).then((response) => {
  const data = response.data;
  console.log(data.reviewComment_upsert);
});
```

### Using `upsertReviewComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertReviewCommentRef, UpsertReviewCommentVariables } from '@dataconnect/generated';

// The `upsertReviewComment` mutation requires an argument of type `UpsertReviewCommentVariables`:
const upsertReviewCommentVars: UpsertReviewCommentVariables = {
  id: ..., 
  reviewId: ..., 
  userId: ..., 
  content: ..., 
  updatedAt: ..., // optional
};

// Call the `upsertReviewCommentRef()` function to get a reference to the mutation.
const ref = upsertReviewCommentRef(upsertReviewCommentVars);
// Variables can be defined inline as well.
const ref = upsertReviewCommentRef({ id: ..., reviewId: ..., userId: ..., content: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertReviewCommentRef(dataConnect, upsertReviewCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reviewComment_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reviewComment_upsert);
});
```

## deleteReviewComment
You can execute the `deleteReviewComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteReviewComment(vars: DeleteReviewCommentVariables): MutationPromise<DeleteReviewCommentData, DeleteReviewCommentVariables>;

interface DeleteReviewCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewCommentVariables): MutationRef<DeleteReviewCommentData, DeleteReviewCommentVariables>;
}
export const deleteReviewCommentRef: DeleteReviewCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteReviewComment(dc: DataConnect, vars: DeleteReviewCommentVariables): MutationPromise<DeleteReviewCommentData, DeleteReviewCommentVariables>;

interface DeleteReviewCommentRef {
  ...
  (dc: DataConnect, vars: DeleteReviewCommentVariables): MutationRef<DeleteReviewCommentData, DeleteReviewCommentVariables>;
}
export const deleteReviewCommentRef: DeleteReviewCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteReviewCommentRef:
```typescript
const name = deleteReviewCommentRef.operationName;
console.log(name);
```

### Variables
The `deleteReviewComment` mutation requires an argument of type `DeleteReviewCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteReviewCommentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `deleteReviewComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteReviewCommentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteReviewCommentData {
  reviewComment_delete?: ReviewComment_Key | null;
}
```
### Using `deleteReviewComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteReviewComment, DeleteReviewCommentVariables } from '@dataconnect/generated';

// The `deleteReviewComment` mutation requires an argument of type `DeleteReviewCommentVariables`:
const deleteReviewCommentVars: DeleteReviewCommentVariables = {
  id: ..., 
};

// Call the `deleteReviewComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteReviewComment(deleteReviewCommentVars);
// Variables can be defined inline as well.
const { data } = await deleteReviewComment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteReviewComment(dataConnect, deleteReviewCommentVars);

console.log(data.reviewComment_delete);

// Or, you can use the `Promise` API.
deleteReviewComment(deleteReviewCommentVars).then((response) => {
  const data = response.data;
  console.log(data.reviewComment_delete);
});
```

### Using `deleteReviewComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteReviewCommentRef, DeleteReviewCommentVariables } from '@dataconnect/generated';

// The `deleteReviewComment` mutation requires an argument of type `DeleteReviewCommentVariables`:
const deleteReviewCommentVars: DeleteReviewCommentVariables = {
  id: ..., 
};

// Call the `deleteReviewCommentRef()` function to get a reference to the mutation.
const ref = deleteReviewCommentRef(deleteReviewCommentVars);
// Variables can be defined inline as well.
const ref = deleteReviewCommentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteReviewCommentRef(dataConnect, deleteReviewCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reviewComment_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reviewComment_delete);
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
  tags?: unknown | null;
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
import { connectorConfig, upsertNews, UpsertNewsVariables } from '@dataconnect/generated';

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
import { connectorConfig, upsertNewsRef, UpsertNewsVariables } from '@dataconnect/generated';

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

## deleteNews
You can execute the `deleteNews` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteNews(vars: DeleteNewsVariables): MutationPromise<DeleteNewsData, DeleteNewsVariables>;

interface DeleteNewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteNewsVariables): MutationRef<DeleteNewsData, DeleteNewsVariables>;
}
export const deleteNewsRef: DeleteNewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteNews(dc: DataConnect, vars: DeleteNewsVariables): MutationPromise<DeleteNewsData, DeleteNewsVariables>;

interface DeleteNewsRef {
  ...
  (dc: DataConnect, vars: DeleteNewsVariables): MutationRef<DeleteNewsData, DeleteNewsVariables>;
}
export const deleteNewsRef: DeleteNewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteNewsRef:
```typescript
const name = deleteNewsRef.operationName;
console.log(name);
```

### Variables
The `deleteNews` mutation requires an argument of type `DeleteNewsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteNewsVariables {
  id: string;
}
```
### Return Type
Recall that executing the `deleteNews` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteNewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteNewsData {
  newsArticle_delete?: NewsArticle_Key | null;
}
```
### Using `deleteNews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteNews, DeleteNewsVariables } from '@dataconnect/generated';

// The `deleteNews` mutation requires an argument of type `DeleteNewsVariables`:
const deleteNewsVars: DeleteNewsVariables = {
  id: ..., 
};

// Call the `deleteNews()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteNews(deleteNewsVars);
// Variables can be defined inline as well.
const { data } = await deleteNews({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteNews(dataConnect, deleteNewsVars);

console.log(data.newsArticle_delete);

// Or, you can use the `Promise` API.
deleteNews(deleteNewsVars).then((response) => {
  const data = response.data;
  console.log(data.newsArticle_delete);
});
```

### Using `deleteNews`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteNewsRef, DeleteNewsVariables } from '@dataconnect/generated';

// The `deleteNews` mutation requires an argument of type `DeleteNewsVariables`:
const deleteNewsVars: DeleteNewsVariables = {
  id: ..., 
};

// Call the `deleteNewsRef()` function to get a reference to the mutation.
const ref = deleteNewsRef(deleteNewsVars);
// Variables can be defined inline as well.
const ref = deleteNewsRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteNewsRef(dataConnect, deleteNewsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.newsArticle_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.newsArticle_delete);
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
  isWishlist?: boolean | null;
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
import { connectorConfig, upsertCabinet, UpsertCabinetVariables } from '@dataconnect/generated';

// The `upsertCabinet` mutation requires an argument of type `UpsertCabinetVariables`:
const upsertCabinetVars: UpsertCabinetVariables = {
  userId: ..., 
  spiritId: ..., 
  addedAt: ..., // optional
  notes: ..., // optional
  rating: ..., // optional
  isFavorite: ..., // optional
  isWishlist: ..., // optional
};

// Call the `upsertCabinet()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCabinet(upsertCabinetVars);
// Variables can be defined inline as well.
const { data } = await upsertCabinet({ userId: ..., spiritId: ..., addedAt: ..., notes: ..., rating: ..., isFavorite: ..., isWishlist: ..., });

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
import { connectorConfig, upsertCabinetRef, UpsertCabinetVariables } from '@dataconnect/generated';

// The `upsertCabinet` mutation requires an argument of type `UpsertCabinetVariables`:
const upsertCabinetVars: UpsertCabinetVariables = {
  userId: ..., 
  spiritId: ..., 
  addedAt: ..., // optional
  notes: ..., // optional
  rating: ..., // optional
  isFavorite: ..., // optional
  isWishlist: ..., // optional
};

// Call the `upsertCabinetRef()` function to get a reference to the mutation.
const ref = upsertCabinetRef(upsertCabinetVars);
// Variables can be defined inline as well.
const ref = upsertCabinetRef({ userId: ..., spiritId: ..., addedAt: ..., notes: ..., rating: ..., isFavorite: ..., isWishlist: ..., });

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

## deleteCabinet
You can execute the `deleteCabinet` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteCabinet(vars: DeleteCabinetVariables): MutationPromise<DeleteCabinetData, DeleteCabinetVariables>;

interface DeleteCabinetRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCabinetVariables): MutationRef<DeleteCabinetData, DeleteCabinetVariables>;
}
export const deleteCabinetRef: DeleteCabinetRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCabinet(dc: DataConnect, vars: DeleteCabinetVariables): MutationPromise<DeleteCabinetData, DeleteCabinetVariables>;

interface DeleteCabinetRef {
  ...
  (dc: DataConnect, vars: DeleteCabinetVariables): MutationRef<DeleteCabinetData, DeleteCabinetVariables>;
}
export const deleteCabinetRef: DeleteCabinetRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCabinetRef:
```typescript
const name = deleteCabinetRef.operationName;
console.log(name);
```

### Variables
The `deleteCabinet` mutation requires an argument of type `DeleteCabinetVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCabinetVariables {
  userId: string;
  spiritId: string;
}
```
### Return Type
Recall that executing the `deleteCabinet` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCabinetData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCabinetData {
  userCabinet_delete?: UserCabinet_Key | null;
}
```
### Using `deleteCabinet`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCabinet, DeleteCabinetVariables } from '@dataconnect/generated';

// The `deleteCabinet` mutation requires an argument of type `DeleteCabinetVariables`:
const deleteCabinetVars: DeleteCabinetVariables = {
  userId: ..., 
  spiritId: ..., 
};

// Call the `deleteCabinet()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCabinet(deleteCabinetVars);
// Variables can be defined inline as well.
const { data } = await deleteCabinet({ userId: ..., spiritId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCabinet(dataConnect, deleteCabinetVars);

console.log(data.userCabinet_delete);

// Or, you can use the `Promise` API.
deleteCabinet(deleteCabinetVars).then((response) => {
  const data = response.data;
  console.log(data.userCabinet_delete);
});
```

### Using `deleteCabinet`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCabinetRef, DeleteCabinetVariables } from '@dataconnect/generated';

// The `deleteCabinet` mutation requires an argument of type `DeleteCabinetVariables`:
const deleteCabinetVars: DeleteCabinetVariables = {
  userId: ..., 
  spiritId: ..., 
};

// Call the `deleteCabinetRef()` function to get a reference to the mutation.
const ref = deleteCabinetRef(deleteCabinetVars);
// Variables can be defined inline as well.
const ref = deleteCabinetRef({ userId: ..., spiritId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCabinetRef(dataConnect, deleteCabinetVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userCabinet_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userCabinet_delete);
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
import { connectorConfig, upsertModificationRequest, UpsertModificationRequestVariables } from '@dataconnect/generated';

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
import { connectorConfig, upsertModificationRequestRef, UpsertModificationRequestVariables } from '@dataconnect/generated';

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
import { connectorConfig, upsertWorldCupResult, UpsertWorldCupResultVariables } from '@dataconnect/generated';

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
import { connectorConfig, upsertWorldCupResultRef, UpsertWorldCupResultVariables } from '@dataconnect/generated';

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

## deleteSpirit
You can execute the `deleteSpirit` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteSpirit(vars: DeleteSpiritVariables): MutationPromise<DeleteSpiritData, DeleteSpiritVariables>;

interface DeleteSpiritRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSpiritVariables): MutationRef<DeleteSpiritData, DeleteSpiritVariables>;
}
export const deleteSpiritRef: DeleteSpiritRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSpirit(dc: DataConnect, vars: DeleteSpiritVariables): MutationPromise<DeleteSpiritData, DeleteSpiritVariables>;

interface DeleteSpiritRef {
  ...
  (dc: DataConnect, vars: DeleteSpiritVariables): MutationRef<DeleteSpiritData, DeleteSpiritVariables>;
}
export const deleteSpiritRef: DeleteSpiritRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSpiritRef:
```typescript
const name = deleteSpiritRef.operationName;
console.log(name);
```

### Variables
The `deleteSpirit` mutation requires an argument of type `DeleteSpiritVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSpiritVariables {
  id: string;
}
```
### Return Type
Recall that executing the `deleteSpirit` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSpiritData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSpiritData {
  spirit_delete?: Spirit_Key | null;
}
```
### Using `deleteSpirit`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSpirit, DeleteSpiritVariables } from '@dataconnect/generated';

// The `deleteSpirit` mutation requires an argument of type `DeleteSpiritVariables`:
const deleteSpiritVars: DeleteSpiritVariables = {
  id: ..., 
};

// Call the `deleteSpirit()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSpirit(deleteSpiritVars);
// Variables can be defined inline as well.
const { data } = await deleteSpirit({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSpirit(dataConnect, deleteSpiritVars);

console.log(data.spirit_delete);

// Or, you can use the `Promise` API.
deleteSpirit(deleteSpiritVars).then((response) => {
  const data = response.data;
  console.log(data.spirit_delete);
});
```

### Using `deleteSpirit`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSpiritRef, DeleteSpiritVariables } from '@dataconnect/generated';

// The `deleteSpirit` mutation requires an argument of type `DeleteSpiritVariables`:
const deleteSpiritVars: DeleteSpiritVariables = {
  id: ..., 
};

// Call the `deleteSpiritRef()` function to get a reference to the mutation.
const ref = deleteSpiritRef(deleteSpiritVars);
// Variables can be defined inline as well.
const ref = deleteSpiritRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSpiritRef(dataConnect, deleteSpiritVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.spirit_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.spirit_delete);
});
```

## upsertAiDiscoveryLog
You can execute the `upsertAiDiscoveryLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertAiDiscoveryLog(vars: UpsertAiDiscoveryLogVariables): MutationPromise<UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables>;

interface UpsertAiDiscoveryLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAiDiscoveryLogVariables): MutationRef<UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables>;
}
export const upsertAiDiscoveryLogRef: UpsertAiDiscoveryLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertAiDiscoveryLog(dc: DataConnect, vars: UpsertAiDiscoveryLogVariables): MutationPromise<UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables>;

interface UpsertAiDiscoveryLogRef {
  ...
  (dc: DataConnect, vars: UpsertAiDiscoveryLogVariables): MutationRef<UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables>;
}
export const upsertAiDiscoveryLogRef: UpsertAiDiscoveryLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertAiDiscoveryLogRef:
```typescript
const name = upsertAiDiscoveryLogRef.operationName;
console.log(name);
```

### Variables
The `upsertAiDiscoveryLog` mutation requires an argument of type `UpsertAiDiscoveryLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertAiDiscoveryLogVariables {
  id: string;
  userId?: string | null;
  analysis?: string | null;
  recommendations?: unknown | null;
  messageHistory?: unknown | null;
}
```
### Return Type
Recall that executing the `upsertAiDiscoveryLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertAiDiscoveryLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertAiDiscoveryLogData {
  aiDiscoveryLog_upsert: AiDiscoveryLog_Key;
}
```
### Using `upsertAiDiscoveryLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertAiDiscoveryLog, UpsertAiDiscoveryLogVariables } from '@dataconnect/generated';

// The `upsertAiDiscoveryLog` mutation requires an argument of type `UpsertAiDiscoveryLogVariables`:
const upsertAiDiscoveryLogVars: UpsertAiDiscoveryLogVariables = {
  id: ..., 
  userId: ..., // optional
  analysis: ..., // optional
  recommendations: ..., // optional
  messageHistory: ..., // optional
};

// Call the `upsertAiDiscoveryLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertAiDiscoveryLog(upsertAiDiscoveryLogVars);
// Variables can be defined inline as well.
const { data } = await upsertAiDiscoveryLog({ id: ..., userId: ..., analysis: ..., recommendations: ..., messageHistory: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertAiDiscoveryLog(dataConnect, upsertAiDiscoveryLogVars);

console.log(data.aiDiscoveryLog_upsert);

// Or, you can use the `Promise` API.
upsertAiDiscoveryLog(upsertAiDiscoveryLogVars).then((response) => {
  const data = response.data;
  console.log(data.aiDiscoveryLog_upsert);
});
```

### Using `upsertAiDiscoveryLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertAiDiscoveryLogRef, UpsertAiDiscoveryLogVariables } from '@dataconnect/generated';

// The `upsertAiDiscoveryLog` mutation requires an argument of type `UpsertAiDiscoveryLogVariables`:
const upsertAiDiscoveryLogVars: UpsertAiDiscoveryLogVariables = {
  id: ..., 
  userId: ..., // optional
  analysis: ..., // optional
  recommendations: ..., // optional
  messageHistory: ..., // optional
};

// Call the `upsertAiDiscoveryLogRef()` function to get a reference to the mutation.
const ref = upsertAiDiscoveryLogRef(upsertAiDiscoveryLogVars);
// Variables can be defined inline as well.
const ref = upsertAiDiscoveryLogRef({ id: ..., userId: ..., analysis: ..., recommendations: ..., messageHistory: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertAiDiscoveryLogRef(dataConnect, upsertAiDiscoveryLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.aiDiscoveryLog_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.aiDiscoveryLog_upsert);
});
```

## deleteReview
You can execute the `deleteReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface DeleteReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
}
export const deleteReviewRef: DeleteReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface DeleteReviewRef {
  ...
  (dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
}
export const deleteReviewRef: DeleteReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteReviewRef:
```typescript
const name = deleteReviewRef.operationName;
console.log(name);
```

### Variables
The `deleteReview` mutation requires an argument of type `DeleteReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteReviewVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `deleteReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteReviewData {
  spiritReview_delete?: SpiritReview_Key | null;
}
```
### Using `deleteReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteReview, DeleteReviewVariables } from '@dataconnect/generated';

// The `deleteReview` mutation requires an argument of type `DeleteReviewVariables`:
const deleteReviewVars: DeleteReviewVariables = {
  id: ..., 
};

// Call the `deleteReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteReview(deleteReviewVars);
// Variables can be defined inline as well.
const { data } = await deleteReview({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteReview(dataConnect, deleteReviewVars);

console.log(data.spiritReview_delete);

// Or, you can use the `Promise` API.
deleteReview(deleteReviewVars).then((response) => {
  const data = response.data;
  console.log(data.spiritReview_delete);
});
```

### Using `deleteReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteReviewRef, DeleteReviewVariables } from '@dataconnect/generated';

// The `deleteReview` mutation requires an argument of type `DeleteReviewVariables`:
const deleteReviewVars: DeleteReviewVariables = {
  id: ..., 
};

// Call the `deleteReviewRef()` function to get a reference to the mutation.
const ref = deleteReviewRef(deleteReviewVars);
// Variables can be defined inline as well.
const ref = deleteReviewRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteReviewRef(dataConnect, deleteReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.spiritReview_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.spiritReview_delete);
});
```

