# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `main`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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
  - [*getReview*](#getreview)
  - [*listSpiritsForSitemap*](#listspiritsforsitemap)
  - [*getWorldCupResult*](#getworldcupresult)
  - [*listSpiritsForWorldCup*](#listspiritsforworldcup)
  - [*listAiDiscoveryLogs*](#listaidiscoverylogs)
  - [*listModificationRequests*](#listmodificationrequests)
  - [*listUserCabinet*](#listusercabinet)
  - [*listUserReviews*](#listuserreviews)
- [**Mutations**](#mutations)
  - [*upsertUser*](#upsertuser)
  - [*upsertSpirit*](#upsertspirit)
  - [*upsertNewArrival*](#upsertnewarrival)
  - [*upsertReview*](#upsertreview)
  - [*updateReview*](#updatereview)
  - [*upsertNews*](#upsertnews)
  - [*deleteNews*](#deletenews)
  - [*upsertCabinet*](#upsertcabinet)
  - [*deleteCabinet*](#deletecabinet)
  - [*upsertModificationRequest*](#upsertmodificationrequest)
  - [*upsertWorldCupResult*](#upsertworldcupresult)
  - [*deleteSpirit*](#deletespirit)
  - [*upsertAiDiscoveryLog*](#upsertaidiscoverylog)
  - [*deleteReview*](#deletereview)

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `main`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `main`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `main` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## listSpirits
You can execute the `listSpirits` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListSpirits(dc: DataConnect, vars?: ListSpiritsVariables, options?: useDataConnectQueryOptions<ListSpiritsData>): UseDataConnectQueryResult<ListSpiritsData, ListSpiritsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListSpirits(vars?: ListSpiritsVariables, options?: useDataConnectQueryOptions<ListSpiritsData>): UseDataConnectQueryResult<ListSpiritsData, ListSpiritsVariables>;
```

### Variables
The `listSpirits` Query has an optional argument of type `ListSpiritsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListSpiritsVariables {
  category?: string | null;
  subcategory?: string | null;
  country?: string | null;
}
```
### Return Type
Recall that calling the `listSpirits` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listSpirits` Query is of type `ListSpiritsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listSpirits`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListSpiritsVariables } from '@dataconnect/generated';
import { useListSpirits } from '@dataconnect/generated/react'

export default function ListSpiritsComponent() {
  // The `useListSpirits` Query hook has an optional argument of type `ListSpiritsVariables`:
  const listSpiritsVars: ListSpiritsVariables = {
    category: ..., // optional
    subcategory: ..., // optional
    country: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListSpirits(listSpiritsVars);
  // Variables can be defined inline as well.
  const query = useListSpirits({ category: ..., subcategory: ..., country: ..., });
  // Since all variables are optional for this Query, you can omit the `ListSpiritsVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useListSpirits();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListSpirits(dataConnect, listSpiritsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListSpirits(listSpiritsVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useListSpirits(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListSpirits(dataConnect, listSpiritsVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spirits);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## searchSpiritsPublic
You can execute the `searchSpiritsPublic` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useSearchSpiritsPublic(dc: DataConnect, vars?: SearchSpiritsPublicVariables, options?: useDataConnectQueryOptions<SearchSpiritsPublicData>): UseDataConnectQueryResult<SearchSpiritsPublicData, SearchSpiritsPublicVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useSearchSpiritsPublic(vars?: SearchSpiritsPublicVariables, options?: useDataConnectQueryOptions<SearchSpiritsPublicData>): UseDataConnectQueryResult<SearchSpiritsPublicData, SearchSpiritsPublicVariables>;
```

### Variables
The `searchSpiritsPublic` Query has an optional argument of type `SearchSpiritsPublicVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface SearchSpiritsPublicVariables {
  search?: string | null;
  category?: string | null;
  subcategory?: string | null;
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that calling the `searchSpiritsPublic` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `searchSpiritsPublic` Query is of type `SearchSpiritsPublicData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `searchSpiritsPublic`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, SearchSpiritsPublicVariables } from '@dataconnect/generated';
import { useSearchSpiritsPublic } from '@dataconnect/generated/react'

export default function SearchSpiritsPublicComponent() {
  // The `useSearchSpiritsPublic` Query hook has an optional argument of type `SearchSpiritsPublicVariables`:
  const searchSpiritsPublicVars: SearchSpiritsPublicVariables = {
    search: ..., // optional
    category: ..., // optional
    subcategory: ..., // optional
    limit: ..., // optional
    offset: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useSearchSpiritsPublic(searchSpiritsPublicVars);
  // Variables can be defined inline as well.
  const query = useSearchSpiritsPublic({ search: ..., category: ..., subcategory: ..., limit: ..., offset: ..., });
  // Since all variables are optional for this Query, you can omit the `SearchSpiritsPublicVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useSearchSpiritsPublic();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useSearchSpiritsPublic(dataConnect, searchSpiritsPublicVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useSearchSpiritsPublic(searchSpiritsPublicVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useSearchSpiritsPublic(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useSearchSpiritsPublic(dataConnect, searchSpiritsPublicVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spirits);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listAllCategories
You can execute the `listAllCategories` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListAllCategories(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllCategoriesData>): UseDataConnectQueryResult<ListAllCategoriesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListAllCategories(options?: useDataConnectQueryOptions<ListAllCategoriesData>): UseDataConnectQueryResult<ListAllCategoriesData, undefined>;
```

### Variables
The `listAllCategories` Query has no variables.
### Return Type
Recall that calling the `listAllCategories` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listAllCategories` Query is of type `ListAllCategoriesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListAllCategoriesData {
  spirits: ({
    category: string;
    categoryEn?: string | null;
  })[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listAllCategories`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListAllCategories } from '@dataconnect/generated/react'

export default function ListAllCategoriesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListAllCategories();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListAllCategories(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListAllCategories(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListAllCategories(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spirits);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listAllSubcategories
You can execute the `listAllSubcategories` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListAllSubcategories(dc: DataConnect, vars?: ListAllSubcategoriesVariables, options?: useDataConnectQueryOptions<ListAllSubcategoriesData>): UseDataConnectQueryResult<ListAllSubcategoriesData, ListAllSubcategoriesVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListAllSubcategories(vars?: ListAllSubcategoriesVariables, options?: useDataConnectQueryOptions<ListAllSubcategoriesData>): UseDataConnectQueryResult<ListAllSubcategoriesData, ListAllSubcategoriesVariables>;
```

### Variables
The `listAllSubcategories` Query has an optional argument of type `ListAllSubcategoriesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListAllSubcategoriesVariables {
  category?: string | null;
}
```
### Return Type
Recall that calling the `listAllSubcategories` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listAllSubcategories` Query is of type `ListAllSubcategoriesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListAllSubcategoriesData {
  spirits: ({
    subcategory?: string | null;
  })[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listAllSubcategories`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListAllSubcategoriesVariables } from '@dataconnect/generated';
import { useListAllSubcategories } from '@dataconnect/generated/react'

export default function ListAllSubcategoriesComponent() {
  // The `useListAllSubcategories` Query hook has an optional argument of type `ListAllSubcategoriesVariables`:
  const listAllSubcategoriesVars: ListAllSubcategoriesVariables = {
    category: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListAllSubcategories(listAllSubcategoriesVars);
  // Variables can be defined inline as well.
  const query = useListAllSubcategories({ category: ..., });
  // Since all variables are optional for this Query, you can omit the `ListAllSubcategoriesVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useListAllSubcategories();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListAllSubcategories(dataConnect, listAllSubcategoriesVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListAllSubcategories(listAllSubcategoriesVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useListAllSubcategories(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListAllSubcategories(dataConnect, listAllSubcategoriesVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spirits);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listTrendingSpirits
You can execute the `listTrendingSpirits` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListTrendingSpirits(dc: DataConnect, vars?: ListTrendingSpiritsVariables, options?: useDataConnectQueryOptions<ListTrendingSpiritsData>): UseDataConnectQueryResult<ListTrendingSpiritsData, ListTrendingSpiritsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListTrendingSpirits(vars?: ListTrendingSpiritsVariables, options?: useDataConnectQueryOptions<ListTrendingSpiritsData>): UseDataConnectQueryResult<ListTrendingSpiritsData, ListTrendingSpiritsVariables>;
```

### Variables
The `listTrendingSpirits` Query has an optional argument of type `ListTrendingSpiritsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListTrendingSpiritsVariables {
  limit?: number | null;
}
```
### Return Type
Recall that calling the `listTrendingSpirits` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listTrendingSpirits` Query is of type `ListTrendingSpiritsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listTrendingSpirits`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListTrendingSpiritsVariables } from '@dataconnect/generated';
import { useListTrendingSpirits } from '@dataconnect/generated/react'

export default function ListTrendingSpiritsComponent() {
  // The `useListTrendingSpirits` Query hook has an optional argument of type `ListTrendingSpiritsVariables`:
  const listTrendingSpiritsVars: ListTrendingSpiritsVariables = {
    limit: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListTrendingSpirits(listTrendingSpiritsVars);
  // Variables can be defined inline as well.
  const query = useListTrendingSpirits({ limit: ..., });
  // Since all variables are optional for this Query, you can omit the `ListTrendingSpiritsVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useListTrendingSpirits();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListTrendingSpirits(dataConnect, listTrendingSpiritsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListTrendingSpirits(listTrendingSpiritsVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useListTrendingSpirits(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListTrendingSpirits(dataConnect, listTrendingSpiritsVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spirits);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listNewArrivals
You can execute the `listNewArrivals` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListNewArrivals(dc: DataConnect, vars?: ListNewArrivalsVariables, options?: useDataConnectQueryOptions<ListNewArrivalsData>): UseDataConnectQueryResult<ListNewArrivalsData, ListNewArrivalsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListNewArrivals(vars?: ListNewArrivalsVariables, options?: useDataConnectQueryOptions<ListNewArrivalsData>): UseDataConnectQueryResult<ListNewArrivalsData, ListNewArrivalsVariables>;
```

### Variables
The `listNewArrivals` Query has an optional argument of type `ListNewArrivalsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListNewArrivalsVariables {
  limit?: number | null;
}
```
### Return Type
Recall that calling the `listNewArrivals` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listNewArrivals` Query is of type `ListNewArrivalsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listNewArrivals`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListNewArrivalsVariables } from '@dataconnect/generated';
import { useListNewArrivals } from '@dataconnect/generated/react'

export default function ListNewArrivalsComponent() {
  // The `useListNewArrivals` Query hook has an optional argument of type `ListNewArrivalsVariables`:
  const listNewArrivalsVars: ListNewArrivalsVariables = {
    limit: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListNewArrivals(listNewArrivalsVars);
  // Variables can be defined inline as well.
  const query = useListNewArrivals({ limit: ..., });
  // Since all variables are optional for this Query, you can omit the `ListNewArrivalsVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useListNewArrivals();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListNewArrivals(dataConnect, listNewArrivalsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListNewArrivals(listNewArrivalsVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useListNewArrivals(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListNewArrivals(dataConnect, listNewArrivalsVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spirits);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getSpirit
You can execute the `getSpirit` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetSpirit(dc: DataConnect, vars: GetSpiritVariables, options?: useDataConnectQueryOptions<GetSpiritData>): UseDataConnectQueryResult<GetSpiritData, GetSpiritVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetSpirit(vars: GetSpiritVariables, options?: useDataConnectQueryOptions<GetSpiritData>): UseDataConnectQueryResult<GetSpiritData, GetSpiritVariables>;
```

### Variables
The `getSpirit` Query requires an argument of type `GetSpiritVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetSpiritVariables {
  id: string;
}
```
### Return Type
Recall that calling the `getSpirit` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getSpirit` Query is of type `GetSpiritData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getSpirit`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetSpiritVariables } from '@dataconnect/generated';
import { useGetSpirit } from '@dataconnect/generated/react'

export default function GetSpiritComponent() {
  // The `useGetSpirit` Query hook requires an argument of type `GetSpiritVariables`:
  const getSpiritVars: GetSpiritVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetSpirit(getSpiritVars);
  // Variables can be defined inline as well.
  const query = useGetSpirit({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetSpirit(dataConnect, getSpiritVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetSpirit(getSpiritVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetSpirit(dataConnect, getSpiritVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spirit);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## adminListRawSpirits
You can execute the `adminListRawSpirits` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useAdminListRawSpirits(dc: DataConnect, vars?: AdminListRawSpiritsVariables, options?: useDataConnectQueryOptions<AdminListRawSpiritsData>): UseDataConnectQueryResult<AdminListRawSpiritsData, AdminListRawSpiritsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useAdminListRawSpirits(vars?: AdminListRawSpiritsVariables, options?: useDataConnectQueryOptions<AdminListRawSpiritsData>): UseDataConnectQueryResult<AdminListRawSpiritsData, AdminListRawSpiritsVariables>;
```

### Variables
The `adminListRawSpirits` Query has an optional argument of type `AdminListRawSpiritsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `adminListRawSpirits` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `adminListRawSpirits` Query is of type `AdminListRawSpiritsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `adminListRawSpirits`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AdminListRawSpiritsVariables } from '@dataconnect/generated';
import { useAdminListRawSpirits } from '@dataconnect/generated/react'

export default function AdminListRawSpiritsComponent() {
  // The `useAdminListRawSpirits` Query hook has an optional argument of type `AdminListRawSpiritsVariables`:
  const adminListRawSpiritsVars: AdminListRawSpiritsVariables = {
    limit: ..., // optional
    offset: ..., // optional
    category: ..., // optional
    distillery: ..., // optional
    isPublished: ..., // optional
    search: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useAdminListRawSpirits(adminListRawSpiritsVars);
  // Variables can be defined inline as well.
  const query = useAdminListRawSpirits({ limit: ..., offset: ..., category: ..., distillery: ..., isPublished: ..., search: ..., });
  // Since all variables are optional for this Query, you can omit the `AdminListRawSpiritsVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useAdminListRawSpirits();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useAdminListRawSpirits(dataConnect, adminListRawSpiritsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useAdminListRawSpirits(adminListRawSpiritsVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useAdminListRawSpirits(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useAdminListRawSpirits(dataConnect, adminListRawSpiritsVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spirits);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getUserProfile
You can execute the `getUserProfile` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, GetUserProfileVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetUserProfile(vars: GetUserProfileVariables, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, GetUserProfileVariables>;
```

### Variables
The `getUserProfile` Query requires an argument of type `GetUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetUserProfileVariables {
  id: string;
}
```
### Return Type
Recall that calling the `getUserProfile` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getUserProfile` Query is of type `GetUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetUserProfileData {
  user?: {
    id: string;
    nickname?: string | null;
    profileImage?: string | null;
    role?: string | null;
    themePreference?: string | null;
    isFirstLogin?: boolean | null;
    reviewsWritten?: number | null;
    heartsReceived?: number | null;
    tasteProfile?: unknown | null;
  } & User_Key;
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getUserProfile`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetUserProfileVariables } from '@dataconnect/generated';
import { useGetUserProfile } from '@dataconnect/generated/react'

export default function GetUserProfileComponent() {
  // The `useGetUserProfile` Query hook requires an argument of type `GetUserProfileVariables`:
  const getUserProfileVars: GetUserProfileVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetUserProfile(getUserProfileVars);
  // Variables can be defined inline as well.
  const query = useGetUserProfile({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetUserProfile(dataConnect, getUserProfileVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetUserProfile(getUserProfileVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetUserProfile(dataConnect, getUserProfileVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.user);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listNewsArticles
You can execute the `listNewsArticles` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListNewsArticles(dc: DataConnect, vars?: ListNewsArticlesVariables, options?: useDataConnectQueryOptions<ListNewsArticlesData>): UseDataConnectQueryResult<ListNewsArticlesData, ListNewsArticlesVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListNewsArticles(vars?: ListNewsArticlesVariables, options?: useDataConnectQueryOptions<ListNewsArticlesData>): UseDataConnectQueryResult<ListNewsArticlesData, ListNewsArticlesVariables>;
```

### Variables
The `listNewsArticles` Query has an optional argument of type `ListNewsArticlesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListNewsArticlesVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that calling the `listNewsArticles` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listNewsArticles` Query is of type `ListNewsArticlesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
    newsTags?: unknown | null;
    createdAt?: TimestampString | null;
  } & NewsArticle_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listNewsArticles`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListNewsArticlesVariables } from '@dataconnect/generated';
import { useListNewsArticles } from '@dataconnect/generated/react'

export default function ListNewsArticlesComponent() {
  // The `useListNewsArticles` Query hook has an optional argument of type `ListNewsArticlesVariables`:
  const listNewsArticlesVars: ListNewsArticlesVariables = {
    limit: ..., // optional
    offset: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListNewsArticles(listNewsArticlesVars);
  // Variables can be defined inline as well.
  const query = useListNewsArticles({ limit: ..., offset: ..., });
  // Since all variables are optional for this Query, you can omit the `ListNewsArticlesVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useListNewsArticles();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListNewsArticles(dataConnect, listNewsArticlesVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListNewsArticles(listNewsArticlesVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useListNewsArticles(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListNewsArticles(dataConnect, listNewsArticlesVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.newsArticles);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getNewsArticle
You can execute the `getNewsArticle` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetNewsArticle(dc: DataConnect, vars: GetNewsArticleVariables, options?: useDataConnectQueryOptions<GetNewsArticleData>): UseDataConnectQueryResult<GetNewsArticleData, GetNewsArticleVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetNewsArticle(vars: GetNewsArticleVariables, options?: useDataConnectQueryOptions<GetNewsArticleData>): UseDataConnectQueryResult<GetNewsArticleData, GetNewsArticleVariables>;
```

### Variables
The `getNewsArticle` Query requires an argument of type `GetNewsArticleVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetNewsArticleVariables {
  id: string;
}
```
### Return Type
Recall that calling the `getNewsArticle` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getNewsArticle` Query is of type `GetNewsArticleData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
    newsTags?: unknown | null;
    createdAt?: TimestampString | null;
  } & NewsArticle_Key;
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getNewsArticle`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetNewsArticleVariables } from '@dataconnect/generated';
import { useGetNewsArticle } from '@dataconnect/generated/react'

export default function GetNewsArticleComponent() {
  // The `useGetNewsArticle` Query hook requires an argument of type `GetNewsArticleVariables`:
  const getNewsArticleVars: GetNewsArticleVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetNewsArticle(getNewsArticleVars);
  // Variables can be defined inline as well.
  const query = useGetNewsArticle({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetNewsArticle(dataConnect, getNewsArticleVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetNewsArticle(getNewsArticleVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetNewsArticle(dataConnect, getNewsArticleVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.newsArticle);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## auditAllUsers
You can execute the `auditAllUsers` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useAuditAllUsers(dc: DataConnect, options?: useDataConnectQueryOptions<AuditAllUsersData>): UseDataConnectQueryResult<AuditAllUsersData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useAuditAllUsers(options?: useDataConnectQueryOptions<AuditAllUsersData>): UseDataConnectQueryResult<AuditAllUsersData, undefined>;
```

### Variables
The `auditAllUsers` Query has no variables.
### Return Type
Recall that calling the `auditAllUsers` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `auditAllUsers` Query is of type `AuditAllUsersData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AuditAllUsersData {
  users: ({
    id: string;
    nickname?: string | null;
    role?: string | null;
    isFirstLogin?: boolean | null;
  } & User_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `auditAllUsers`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useAuditAllUsers } from '@dataconnect/generated/react'

export default function AuditAllUsersComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useAuditAllUsers();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useAuditAllUsers(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useAuditAllUsers(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useAuditAllUsers(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.users);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## auditAllNews
You can execute the `auditAllNews` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useAuditAllNews(dc: DataConnect, options?: useDataConnectQueryOptions<AuditAllNewsData>): UseDataConnectQueryResult<AuditAllNewsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useAuditAllNews(options?: useDataConnectQueryOptions<AuditAllNewsData>): UseDataConnectQueryResult<AuditAllNewsData, undefined>;
```

### Variables
The `auditAllNews` Query has no variables.
### Return Type
Recall that calling the `auditAllNews` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `auditAllNews` Query is of type `AuditAllNewsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AuditAllNewsData {
  newsArticles: ({
    id: string;
    title: string;
    translations?: unknown | null;
  } & NewsArticle_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `auditAllNews`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useAuditAllNews } from '@dataconnect/generated/react'

export default function AuditAllNewsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useAuditAllNews();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useAuditAllNews(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useAuditAllNews(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useAuditAllNews(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.newsArticles);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## auditAllSpirits
You can execute the `auditAllSpirits` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useAuditAllSpirits(dc: DataConnect, options?: useDataConnectQueryOptions<AuditAllSpiritsData>): UseDataConnectQueryResult<AuditAllSpiritsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useAuditAllSpirits(options?: useDataConnectQueryOptions<AuditAllSpiritsData>): UseDataConnectQueryResult<AuditAllSpiritsData, undefined>;
```

### Variables
The `auditAllSpirits` Query has no variables.
### Return Type
Recall that calling the `auditAllSpirits` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `auditAllSpirits` Query is of type `AuditAllSpiritsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AuditAllSpiritsData {
  spirits: ({
    id: string;
  } & Spirit_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `auditAllSpirits`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useAuditAllSpirits } from '@dataconnect/generated/react'

export default function AuditAllSpiritsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useAuditAllSpirits();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useAuditAllSpirits(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useAuditAllSpirits(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useAuditAllSpirits(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spirits);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## auditAllReviews
You can execute the `auditAllReviews` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useAuditAllReviews(dc: DataConnect, options?: useDataConnectQueryOptions<AuditAllReviewsData>): UseDataConnectQueryResult<AuditAllReviewsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useAuditAllReviews(options?: useDataConnectQueryOptions<AuditAllReviewsData>): UseDataConnectQueryResult<AuditAllReviewsData, undefined>;
```

### Variables
The `auditAllReviews` Query has no variables.
### Return Type
Recall that calling the `auditAllReviews` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `auditAllReviews` Query is of type `AuditAllReviewsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `auditAllReviews`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useAuditAllReviews } from '@dataconnect/generated/react'

export default function AuditAllReviewsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useAuditAllReviews();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useAuditAllReviews(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useAuditAllReviews(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useAuditAllReviews(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spiritReviews);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listSpiritReviews
You can execute the `listSpiritReviews` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListSpiritReviews(dc: DataConnect, vars?: ListSpiritReviewsVariables, options?: useDataConnectQueryOptions<ListSpiritReviewsData>): UseDataConnectQueryResult<ListSpiritReviewsData, ListSpiritReviewsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListSpiritReviews(vars?: ListSpiritReviewsVariables, options?: useDataConnectQueryOptions<ListSpiritReviewsData>): UseDataConnectQueryResult<ListSpiritReviewsData, ListSpiritReviewsVariables>;
```

### Variables
The `listSpiritReviews` Query has an optional argument of type `ListSpiritReviewsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListSpiritReviewsVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that calling the `listSpiritReviews` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listSpiritReviews` Query is of type `ListSpiritReviewsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listSpiritReviews`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListSpiritReviewsVariables } from '@dataconnect/generated';
import { useListSpiritReviews } from '@dataconnect/generated/react'

export default function ListSpiritReviewsComponent() {
  // The `useListSpiritReviews` Query hook has an optional argument of type `ListSpiritReviewsVariables`:
  const listSpiritReviewsVars: ListSpiritReviewsVariables = {
    limit: ..., // optional
    offset: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListSpiritReviews(listSpiritReviewsVars);
  // Variables can be defined inline as well.
  const query = useListSpiritReviews({ limit: ..., offset: ..., });
  // Since all variables are optional for this Query, you can omit the `ListSpiritReviewsVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useListSpiritReviews();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListSpiritReviews(dataConnect, listSpiritReviewsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListSpiritReviews(listSpiritReviewsVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useListSpiritReviews(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListSpiritReviews(dataConnect, listSpiritReviewsVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spiritReviews);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getSpiritReviewsCount
You can execute the `getSpiritReviewsCount` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetSpiritReviewsCount(dc: DataConnect, options?: useDataConnectQueryOptions<GetSpiritReviewsCountData>): UseDataConnectQueryResult<GetSpiritReviewsCountData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetSpiritReviewsCount(options?: useDataConnectQueryOptions<GetSpiritReviewsCountData>): UseDataConnectQueryResult<GetSpiritReviewsCountData, undefined>;
```

### Variables
The `getSpiritReviewsCount` Query has no variables.
### Return Type
Recall that calling the `getSpiritReviewsCount` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getSpiritReviewsCount` Query is of type `GetSpiritReviewsCountData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetSpiritReviewsCountData {
  spiritReviews: ({
    id: UUIDString;
  } & SpiritReview_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getSpiritReviewsCount`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetSpiritReviewsCount } from '@dataconnect/generated/react'

export default function GetSpiritReviewsCountComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetSpiritReviewsCount();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetSpiritReviewsCount(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetSpiritReviewsCount(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetSpiritReviewsCount(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spiritReviews);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## findReview
You can execute the `findReview` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useFindReview(dc: DataConnect, vars: FindReviewVariables, options?: useDataConnectQueryOptions<FindReviewData>): UseDataConnectQueryResult<FindReviewData, FindReviewVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useFindReview(vars: FindReviewVariables, options?: useDataConnectQueryOptions<FindReviewData>): UseDataConnectQueryResult<FindReviewData, FindReviewVariables>;
```

### Variables
The `findReview` Query requires an argument of type `FindReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface FindReviewVariables {
  userId: string;
  spiritId: string;
}
```
### Return Type
Recall that calling the `findReview` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `findReview` Query is of type `FindReviewData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface FindReviewData {
  spiritReviews: ({
    id: UUIDString;
    likedBy?: string[] | null;
    likes?: number | null;
  } & SpiritReview_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `findReview`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, FindReviewVariables } from '@dataconnect/generated';
import { useFindReview } from '@dataconnect/generated/react'

export default function FindReviewComponent() {
  // The `useFindReview` Query hook requires an argument of type `FindReviewVariables`:
  const findReviewVars: FindReviewVariables = {
    userId: ..., 
    spiritId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useFindReview(findReviewVars);
  // Variables can be defined inline as well.
  const query = useFindReview({ userId: ..., spiritId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useFindReview(dataConnect, findReviewVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useFindReview(findReviewVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useFindReview(dataConnect, findReviewVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spiritReviews);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getReview
You can execute the `getReview` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetReview(dc: DataConnect, vars: GetReviewVariables, options?: useDataConnectQueryOptions<GetReviewData>): UseDataConnectQueryResult<GetReviewData, GetReviewVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetReview(vars: GetReviewVariables, options?: useDataConnectQueryOptions<GetReviewData>): UseDataConnectQueryResult<GetReviewData, GetReviewVariables>;
```

### Variables
The `getReview` Query requires an argument of type `GetReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetReviewVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `getReview` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getReview` Query is of type `GetReviewData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetReviewData {
  spiritReview?: {
    id: UUIDString;
    likedBy?: string[] | null;
    likes?: number | null;
  } & SpiritReview_Key;
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getReview`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetReviewVariables } from '@dataconnect/generated';
import { useGetReview } from '@dataconnect/generated/react'

export default function GetReviewComponent() {
  // The `useGetReview` Query hook requires an argument of type `GetReviewVariables`:
  const getReviewVars: GetReviewVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetReview(getReviewVars);
  // Variables can be defined inline as well.
  const query = useGetReview({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetReview(dataConnect, getReviewVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetReview(getReviewVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetReview(dataConnect, getReviewVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spiritReview);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listSpiritsForSitemap
You can execute the `listSpiritsForSitemap` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListSpiritsForSitemap(dc: DataConnect, options?: useDataConnectQueryOptions<ListSpiritsForSitemapData>): UseDataConnectQueryResult<ListSpiritsForSitemapData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListSpiritsForSitemap(options?: useDataConnectQueryOptions<ListSpiritsForSitemapData>): UseDataConnectQueryResult<ListSpiritsForSitemapData, undefined>;
```

### Variables
The `listSpiritsForSitemap` Query has no variables.
### Return Type
Recall that calling the `listSpiritsForSitemap` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listSpiritsForSitemap` Query is of type `ListSpiritsForSitemapData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listSpiritsForSitemap`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListSpiritsForSitemap } from '@dataconnect/generated/react'

export default function ListSpiritsForSitemapComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListSpiritsForSitemap();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListSpiritsForSitemap(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListSpiritsForSitemap(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListSpiritsForSitemap(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spirits);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getWorldCupResult
You can execute the `getWorldCupResult` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetWorldCupResult(dc: DataConnect, vars: GetWorldCupResultVariables, options?: useDataConnectQueryOptions<GetWorldCupResultData>): UseDataConnectQueryResult<GetWorldCupResultData, GetWorldCupResultVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetWorldCupResult(vars: GetWorldCupResultVariables, options?: useDataConnectQueryOptions<GetWorldCupResultData>): UseDataConnectQueryResult<GetWorldCupResultData, GetWorldCupResultVariables>;
```

### Variables
The `getWorldCupResult` Query requires an argument of type `GetWorldCupResultVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetWorldCupResultVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `getWorldCupResult` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getWorldCupResult` Query is of type `GetWorldCupResultData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getWorldCupResult`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetWorldCupResultVariables } from '@dataconnect/generated';
import { useGetWorldCupResult } from '@dataconnect/generated/react'

export default function GetWorldCupResultComponent() {
  // The `useGetWorldCupResult` Query hook requires an argument of type `GetWorldCupResultVariables`:
  const getWorldCupResultVars: GetWorldCupResultVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetWorldCupResult(getWorldCupResultVars);
  // Variables can be defined inline as well.
  const query = useGetWorldCupResult({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetWorldCupResult(dataConnect, getWorldCupResultVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetWorldCupResult(getWorldCupResultVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetWorldCupResult(dataConnect, getWorldCupResultVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.worldCupResult);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listSpiritsForWorldCup
You can execute the `listSpiritsForWorldCup` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListSpiritsForWorldCup(dc: DataConnect, vars?: ListSpiritsForWorldCupVariables, options?: useDataConnectQueryOptions<ListSpiritsForWorldCupData>): UseDataConnectQueryResult<ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListSpiritsForWorldCup(vars?: ListSpiritsForWorldCupVariables, options?: useDataConnectQueryOptions<ListSpiritsForWorldCupData>): UseDataConnectQueryResult<ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables>;
```

### Variables
The `listSpiritsForWorldCup` Query has an optional argument of type `ListSpiritsForWorldCupVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListSpiritsForWorldCupVariables {
  category?: string | null;
  subcategories?: string[] | null;
}
```
### Return Type
Recall that calling the `listSpiritsForWorldCup` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listSpiritsForWorldCup` Query is of type `ListSpiritsForWorldCupData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listSpiritsForWorldCup`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListSpiritsForWorldCupVariables } from '@dataconnect/generated';
import { useListSpiritsForWorldCup } from '@dataconnect/generated/react'

export default function ListSpiritsForWorldCupComponent() {
  // The `useListSpiritsForWorldCup` Query hook has an optional argument of type `ListSpiritsForWorldCupVariables`:
  const listSpiritsForWorldCupVars: ListSpiritsForWorldCupVariables = {
    category: ..., // optional
    subcategories: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListSpiritsForWorldCup(listSpiritsForWorldCupVars);
  // Variables can be defined inline as well.
  const query = useListSpiritsForWorldCup({ category: ..., subcategories: ..., });
  // Since all variables are optional for this Query, you can omit the `ListSpiritsForWorldCupVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useListSpiritsForWorldCup();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListSpiritsForWorldCup(dataConnect, listSpiritsForWorldCupVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListSpiritsForWorldCup(listSpiritsForWorldCupVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useListSpiritsForWorldCup(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListSpiritsForWorldCup(dataConnect, listSpiritsForWorldCupVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spirits);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listAiDiscoveryLogs
You can execute the `listAiDiscoveryLogs` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListAiDiscoveryLogs(dc: DataConnect, vars: ListAiDiscoveryLogsVariables, options?: useDataConnectQueryOptions<ListAiDiscoveryLogsData>): UseDataConnectQueryResult<ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListAiDiscoveryLogs(vars: ListAiDiscoveryLogsVariables, options?: useDataConnectQueryOptions<ListAiDiscoveryLogsData>): UseDataConnectQueryResult<ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables>;
```

### Variables
The `listAiDiscoveryLogs` Query requires an argument of type `ListAiDiscoveryLogsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListAiDiscoveryLogsVariables {
  limit: number;
}
```
### Return Type
Recall that calling the `listAiDiscoveryLogs` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listAiDiscoveryLogs` Query is of type `ListAiDiscoveryLogsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listAiDiscoveryLogs`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListAiDiscoveryLogsVariables } from '@dataconnect/generated';
import { useListAiDiscoveryLogs } from '@dataconnect/generated/react'

export default function ListAiDiscoveryLogsComponent() {
  // The `useListAiDiscoveryLogs` Query hook requires an argument of type `ListAiDiscoveryLogsVariables`:
  const listAiDiscoveryLogsVars: ListAiDiscoveryLogsVariables = {
    limit: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListAiDiscoveryLogs(listAiDiscoveryLogsVars);
  // Variables can be defined inline as well.
  const query = useListAiDiscoveryLogs({ limit: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListAiDiscoveryLogs(dataConnect, listAiDiscoveryLogsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListAiDiscoveryLogs(listAiDiscoveryLogsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListAiDiscoveryLogs(dataConnect, listAiDiscoveryLogsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.aiDiscoveryLogs);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listModificationRequests
You can execute the `listModificationRequests` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListModificationRequests(dc: DataConnect, options?: useDataConnectQueryOptions<ListModificationRequestsData>): UseDataConnectQueryResult<ListModificationRequestsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListModificationRequests(options?: useDataConnectQueryOptions<ListModificationRequestsData>): UseDataConnectQueryResult<ListModificationRequestsData, undefined>;
```

### Variables
The `listModificationRequests` Query has no variables.
### Return Type
Recall that calling the `listModificationRequests` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listModificationRequests` Query is of type `ListModificationRequestsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listModificationRequests`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListModificationRequests } from '@dataconnect/generated/react'

export default function ListModificationRequestsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListModificationRequests();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListModificationRequests(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListModificationRequests(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListModificationRequests(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.modificationRequests);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listUserCabinet
You can execute the `listUserCabinet` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListUserCabinet(dc: DataConnect, vars: ListUserCabinetVariables, options?: useDataConnectQueryOptions<ListUserCabinetData>): UseDataConnectQueryResult<ListUserCabinetData, ListUserCabinetVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListUserCabinet(vars: ListUserCabinetVariables, options?: useDataConnectQueryOptions<ListUserCabinetData>): UseDataConnectQueryResult<ListUserCabinetData, ListUserCabinetVariables>;
```

### Variables
The `listUserCabinet` Query requires an argument of type `ListUserCabinetVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListUserCabinetVariables {
  userId: string;
}
```
### Return Type
Recall that calling the `listUserCabinet` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listUserCabinet` Query is of type `ListUserCabinetData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListUserCabinetData {
  userCabinets: ({
    spiritId: string;
    isFavorite?: boolean | null;
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listUserCabinet`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListUserCabinetVariables } from '@dataconnect/generated';
import { useListUserCabinet } from '@dataconnect/generated/react'

export default function ListUserCabinetComponent() {
  // The `useListUserCabinet` Query hook requires an argument of type `ListUserCabinetVariables`:
  const listUserCabinetVars: ListUserCabinetVariables = {
    userId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListUserCabinet(listUserCabinetVars);
  // Variables can be defined inline as well.
  const query = useListUserCabinet({ userId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListUserCabinet(dataConnect, listUserCabinetVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListUserCabinet(listUserCabinetVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListUserCabinet(dataConnect, listUserCabinetVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.userCabinets);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listUserReviews
You can execute the `listUserReviews` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListUserReviews(dc: DataConnect, vars: ListUserReviewsVariables, options?: useDataConnectQueryOptions<ListUserReviewsData>): UseDataConnectQueryResult<ListUserReviewsData, ListUserReviewsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListUserReviews(vars: ListUserReviewsVariables, options?: useDataConnectQueryOptions<ListUserReviewsData>): UseDataConnectQueryResult<ListUserReviewsData, ListUserReviewsVariables>;
```

### Variables
The `listUserReviews` Query requires an argument of type `ListUserReviewsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListUserReviewsVariables {
  userId: string;
}
```
### Return Type
Recall that calling the `listUserReviews` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listUserReviews` Query is of type `ListUserReviewsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listUserReviews`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListUserReviewsVariables } from '@dataconnect/generated';
import { useListUserReviews } from '@dataconnect/generated/react'

export default function ListUserReviewsComponent() {
  // The `useListUserReviews` Query hook requires an argument of type `ListUserReviewsVariables`:
  const listUserReviewsVars: ListUserReviewsVariables = {
    userId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListUserReviews(listUserReviewsVars);
  // Variables can be defined inline as well.
  const query = useListUserReviews({ userId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListUserReviews(dataConnect, listUserReviewsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListUserReviews(listUserReviewsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListUserReviews(dataConnect, listUserReviewsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.spiritReviews);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `main` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## upsertUser
You can execute the `upsertUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertUser(options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
```

### Variables
The `upsertUser` Mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `upsertUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `upsertUser` Mutation is of type `UpsertUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `upsertUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertUserVariables } from '@dataconnect/generated';
import { useUpsertUser } from '@dataconnect/generated/react'

export default function UpsertUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertUser` Mutation requires an argument of type `UpsertUserVariables`:
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
  mutation.mutate(upsertUserVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., email: ..., nickname: ..., profileImage: ..., role: ..., themePreference: ..., isFirstLogin: ..., reviewsWritten: ..., heartsReceived: ..., tasteProfile: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertUserVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## upsertSpirit
You can execute the `upsertSpirit` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertSpirit(options?: useDataConnectMutationOptions<UpsertSpiritData, FirebaseError, UpsertSpiritVariables>): UseDataConnectMutationResult<UpsertSpiritData, UpsertSpiritVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertSpirit(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertSpiritData, FirebaseError, UpsertSpiritVariables>): UseDataConnectMutationResult<UpsertSpiritData, UpsertSpiritVariables>;
```

### Variables
The `upsertSpirit` Mutation requires an argument of type `UpsertSpiritVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
  importer?: string | null;
  rawCategory?: string | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that calling the `upsertSpirit` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `upsertSpirit` Mutation is of type `UpsertSpiritData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertSpiritData {
  spirit_upsert: Spirit_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `upsertSpirit`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertSpiritVariables } from '@dataconnect/generated';
import { useUpsertSpirit } from '@dataconnect/generated/react'

export default function UpsertSpiritComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertSpirit();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertSpirit(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertSpirit(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertSpirit(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertSpirit` Mutation requires an argument of type `UpsertSpiritVariables`:
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
    importer: ..., // optional
    rawCategory: ..., // optional
    metadata: ..., // optional
  };
  mutation.mutate(upsertSpiritVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., nameEn: ..., category: ..., categoryEn: ..., mainCategory: ..., subcategory: ..., distillery: ..., bottler: ..., abv: ..., volume: ..., country: ..., region: ..., imageUrl: ..., thumbnailUrl: ..., descriptionKo: ..., descriptionEn: ..., pairingGuideKo: ..., pairingGuideEn: ..., noseTags: ..., palateTags: ..., finishTags: ..., tastingNote: ..., status: ..., isPublished: ..., isReviewed: ..., rating: ..., reviewCount: ..., importer: ..., rawCategory: ..., metadata: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertSpiritVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.spirit_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## upsertNewArrival
You can execute the `upsertNewArrival` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertNewArrival(options?: useDataConnectMutationOptions<UpsertNewArrivalData, FirebaseError, UpsertNewArrivalVariables>): UseDataConnectMutationResult<UpsertNewArrivalData, UpsertNewArrivalVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertNewArrival(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertNewArrivalData, FirebaseError, UpsertNewArrivalVariables>): UseDataConnectMutationResult<UpsertNewArrivalData, UpsertNewArrivalVariables>;
```

### Variables
The `upsertNewArrival` Mutation requires an argument of type `UpsertNewArrivalVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertNewArrivalVariables {
  id: string;
  spiritId: string;
  displayOrder?: number | null;
  tags?: string[] | null;
}
```
### Return Type
Recall that calling the `upsertNewArrival` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `upsertNewArrival` Mutation is of type `UpsertNewArrivalData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertNewArrivalData {
  newArrival_upsert: NewArrival_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `upsertNewArrival`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertNewArrivalVariables } from '@dataconnect/generated';
import { useUpsertNewArrival } from '@dataconnect/generated/react'

export default function UpsertNewArrivalComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertNewArrival();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertNewArrival(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertNewArrival(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertNewArrival(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertNewArrival` Mutation requires an argument of type `UpsertNewArrivalVariables`:
  const upsertNewArrivalVars: UpsertNewArrivalVariables = {
    id: ..., 
    spiritId: ..., 
    displayOrder: ..., // optional
    tags: ..., // optional
  };
  mutation.mutate(upsertNewArrivalVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., spiritId: ..., displayOrder: ..., tags: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertNewArrivalVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.newArrival_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## upsertReview
You can execute the `upsertReview` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertReview(options?: useDataConnectMutationOptions<UpsertReviewData, FirebaseError, UpsertReviewVariables>): UseDataConnectMutationResult<UpsertReviewData, UpsertReviewVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertReview(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertReviewData, FirebaseError, UpsertReviewVariables>): UseDataConnectMutationResult<UpsertReviewData, UpsertReviewVariables>;
```

### Variables
The `upsertReview` Mutation requires an argument of type `UpsertReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `upsertReview` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `upsertReview` Mutation is of type `UpsertReviewData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertReviewData {
  spiritReview_upsert: SpiritReview_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `upsertReview`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertReviewVariables } from '@dataconnect/generated';
import { useUpsertReview } from '@dataconnect/generated/react'

export default function UpsertReviewComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertReview();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertReview(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertReview(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertReview(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertReview` Mutation requires an argument of type `UpsertReviewVariables`:
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
  mutation.mutate(upsertReviewVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., spiritId: ..., userId: ..., rating: ..., title: ..., content: ..., nose: ..., palate: ..., finish: ..., likes: ..., likedBy: ..., isPublished: ..., imageUrls: ..., createdAt: ..., updatedAt: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertReviewVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.spiritReview_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## updateReview
You can execute the `updateReview` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateReview(options?: useDataConnectMutationOptions<UpdateReviewData, FirebaseError, UpdateReviewVariables>): UseDataConnectMutationResult<UpdateReviewData, UpdateReviewVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateReview(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateReviewData, FirebaseError, UpdateReviewVariables>): UseDataConnectMutationResult<UpdateReviewData, UpdateReviewVariables>;
```

### Variables
The `updateReview` Mutation requires an argument of type `UpdateReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateReviewVariables {
  id: UUIDString;
  likes?: number | null;
  likedBy?: string[] | null;
}
```
### Return Type
Recall that calling the `updateReview` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `updateReview` Mutation is of type `UpdateReviewData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateReviewData {
  spiritReview_update?: SpiritReview_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `updateReview`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateReviewVariables } from '@dataconnect/generated';
import { useUpdateReview } from '@dataconnect/generated/react'

export default function UpdateReviewComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateReview();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateReview(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateReview(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateReview(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateReview` Mutation requires an argument of type `UpdateReviewVariables`:
  const updateReviewVars: UpdateReviewVariables = {
    id: ..., 
    likes: ..., // optional
    likedBy: ..., // optional
  };
  mutation.mutate(updateReviewVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., likes: ..., likedBy: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateReviewVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.spiritReview_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## upsertNews
You can execute the `upsertNews` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertNews(options?: useDataConnectMutationOptions<UpsertNewsData, FirebaseError, UpsertNewsVariables>): UseDataConnectMutationResult<UpsertNewsData, UpsertNewsVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertNews(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertNewsData, FirebaseError, UpsertNewsVariables>): UseDataConnectMutationResult<UpsertNewsData, UpsertNewsVariables>;
```

### Variables
The `upsertNews` Mutation requires an argument of type `UpsertNewsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `upsertNews` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `upsertNews` Mutation is of type `UpsertNewsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertNewsData {
  newsArticle_upsert: NewsArticle_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `upsertNews`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertNewsVariables } from '@dataconnect/generated';
import { useUpsertNews } from '@dataconnect/generated/react'

export default function UpsertNewsComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertNews();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertNews(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertNews(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertNews(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertNews` Mutation requires an argument of type `UpsertNewsVariables`:
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
  mutation.mutate(upsertNewsVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., title: ..., content: ..., imageUrl: ..., category: ..., source: ..., link: ..., date: ..., translations: ..., tags: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertNewsVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.newsArticle_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## deleteNews
You can execute the `deleteNews` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteNews(options?: useDataConnectMutationOptions<DeleteNewsData, FirebaseError, DeleteNewsVariables>): UseDataConnectMutationResult<DeleteNewsData, DeleteNewsVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteNews(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteNewsData, FirebaseError, DeleteNewsVariables>): UseDataConnectMutationResult<DeleteNewsData, DeleteNewsVariables>;
```

### Variables
The `deleteNews` Mutation requires an argument of type `DeleteNewsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteNewsVariables {
  id: string;
}
```
### Return Type
Recall that calling the `deleteNews` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `deleteNews` Mutation is of type `DeleteNewsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteNewsData {
  newsArticle_delete?: NewsArticle_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `deleteNews`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteNewsVariables } from '@dataconnect/generated';
import { useDeleteNews } from '@dataconnect/generated/react'

export default function DeleteNewsComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteNews();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteNews(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteNews(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteNews(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteNews` Mutation requires an argument of type `DeleteNewsVariables`:
  const deleteNewsVars: DeleteNewsVariables = {
    id: ..., 
  };
  mutation.mutate(deleteNewsVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteNewsVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.newsArticle_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## upsertCabinet
You can execute the `upsertCabinet` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertCabinet(options?: useDataConnectMutationOptions<UpsertCabinetData, FirebaseError, UpsertCabinetVariables>): UseDataConnectMutationResult<UpsertCabinetData, UpsertCabinetVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertCabinet(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCabinetData, FirebaseError, UpsertCabinetVariables>): UseDataConnectMutationResult<UpsertCabinetData, UpsertCabinetVariables>;
```

### Variables
The `upsertCabinet` Mutation requires an argument of type `UpsertCabinetVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `upsertCabinet` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `upsertCabinet` Mutation is of type `UpsertCabinetData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertCabinetData {
  userCabinet_upsert: UserCabinet_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `upsertCabinet`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertCabinetVariables } from '@dataconnect/generated';
import { useUpsertCabinet } from '@dataconnect/generated/react'

export default function UpsertCabinetComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertCabinet();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertCabinet(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertCabinet(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertCabinet(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertCabinet` Mutation requires an argument of type `UpsertCabinetVariables`:
  const upsertCabinetVars: UpsertCabinetVariables = {
    userId: ..., 
    spiritId: ..., 
    addedAt: ..., // optional
    notes: ..., // optional
    rating: ..., // optional
    isFavorite: ..., // optional
  };
  mutation.mutate(upsertCabinetVars);
  // Variables can be defined inline as well.
  mutation.mutate({ userId: ..., spiritId: ..., addedAt: ..., notes: ..., rating: ..., isFavorite: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertCabinetVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userCabinet_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## deleteCabinet
You can execute the `deleteCabinet` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteCabinet(options?: useDataConnectMutationOptions<DeleteCabinetData, FirebaseError, DeleteCabinetVariables>): UseDataConnectMutationResult<DeleteCabinetData, DeleteCabinetVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteCabinet(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCabinetData, FirebaseError, DeleteCabinetVariables>): UseDataConnectMutationResult<DeleteCabinetData, DeleteCabinetVariables>;
```

### Variables
The `deleteCabinet` Mutation requires an argument of type `DeleteCabinetVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteCabinetVariables {
  userId: string;
  spiritId: string;
}
```
### Return Type
Recall that calling the `deleteCabinet` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `deleteCabinet` Mutation is of type `DeleteCabinetData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteCabinetData {
  userCabinet_delete?: UserCabinet_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `deleteCabinet`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteCabinetVariables } from '@dataconnect/generated';
import { useDeleteCabinet } from '@dataconnect/generated/react'

export default function DeleteCabinetComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteCabinet();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteCabinet(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteCabinet(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteCabinet(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteCabinet` Mutation requires an argument of type `DeleteCabinetVariables`:
  const deleteCabinetVars: DeleteCabinetVariables = {
    userId: ..., 
    spiritId: ..., 
  };
  mutation.mutate(deleteCabinetVars);
  // Variables can be defined inline as well.
  mutation.mutate({ userId: ..., spiritId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteCabinetVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userCabinet_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## upsertModificationRequest
You can execute the `upsertModificationRequest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertModificationRequest(options?: useDataConnectMutationOptions<UpsertModificationRequestData, FirebaseError, UpsertModificationRequestVariables>): UseDataConnectMutationResult<UpsertModificationRequestData, UpsertModificationRequestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertModificationRequest(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertModificationRequestData, FirebaseError, UpsertModificationRequestVariables>): UseDataConnectMutationResult<UpsertModificationRequestData, UpsertModificationRequestVariables>;
```

### Variables
The `upsertModificationRequest` Mutation requires an argument of type `UpsertModificationRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `upsertModificationRequest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `upsertModificationRequest` Mutation is of type `UpsertModificationRequestData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertModificationRequestData {
  modificationRequest_upsert: ModificationRequest_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `upsertModificationRequest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertModificationRequestVariables } from '@dataconnect/generated';
import { useUpsertModificationRequest } from '@dataconnect/generated/react'

export default function UpsertModificationRequestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertModificationRequest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertModificationRequest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertModificationRequest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertModificationRequest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertModificationRequest` Mutation requires an argument of type `UpsertModificationRequestVariables`:
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
  mutation.mutate(upsertModificationRequestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., spiritId: ..., spiritName: ..., userId: ..., title: ..., content: ..., status: ..., createdAt: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertModificationRequestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.modificationRequest_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## upsertWorldCupResult
You can execute the `upsertWorldCupResult` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertWorldCupResult(options?: useDataConnectMutationOptions<UpsertWorldCupResultData, FirebaseError, UpsertWorldCupResultVariables>): UseDataConnectMutationResult<UpsertWorldCupResultData, UpsertWorldCupResultVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertWorldCupResult(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertWorldCupResultData, FirebaseError, UpsertWorldCupResultVariables>): UseDataConnectMutationResult<UpsertWorldCupResultData, UpsertWorldCupResultVariables>;
```

### Variables
The `upsertWorldCupResult` Mutation requires an argument of type `UpsertWorldCupResultVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `upsertWorldCupResult` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `upsertWorldCupResult` Mutation is of type `UpsertWorldCupResultData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertWorldCupResultData {
  worldCupResult_upsert: WorldCupResult_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `upsertWorldCupResult`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertWorldCupResultVariables } from '@dataconnect/generated';
import { useUpsertWorldCupResult } from '@dataconnect/generated/react'

export default function UpsertWorldCupResultComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertWorldCupResult();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertWorldCupResult(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertWorldCupResult(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertWorldCupResult(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertWorldCupResult` Mutation requires an argument of type `UpsertWorldCupResultVariables`:
  const upsertWorldCupResultVars: UpsertWorldCupResultVariables = {
    id: ..., 
    winnerId: ..., // optional
    category: ..., 
    subcategory: ..., // optional
    initialRound: ..., // optional
    timestamp: ..., // optional
  };
  mutation.mutate(upsertWorldCupResultVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., winnerId: ..., category: ..., subcategory: ..., initialRound: ..., timestamp: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertWorldCupResultVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.worldCupResult_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## deleteSpirit
You can execute the `deleteSpirit` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteSpirit(options?: useDataConnectMutationOptions<DeleteSpiritData, FirebaseError, DeleteSpiritVariables>): UseDataConnectMutationResult<DeleteSpiritData, DeleteSpiritVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteSpirit(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSpiritData, FirebaseError, DeleteSpiritVariables>): UseDataConnectMutationResult<DeleteSpiritData, DeleteSpiritVariables>;
```

### Variables
The `deleteSpirit` Mutation requires an argument of type `DeleteSpiritVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteSpiritVariables {
  id: string;
}
```
### Return Type
Recall that calling the `deleteSpirit` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `deleteSpirit` Mutation is of type `DeleteSpiritData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteSpiritData {
  spirit_delete?: Spirit_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `deleteSpirit`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteSpiritVariables } from '@dataconnect/generated';
import { useDeleteSpirit } from '@dataconnect/generated/react'

export default function DeleteSpiritComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteSpirit();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteSpirit(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSpirit(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSpirit(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteSpirit` Mutation requires an argument of type `DeleteSpiritVariables`:
  const deleteSpiritVars: DeleteSpiritVariables = {
    id: ..., 
  };
  mutation.mutate(deleteSpiritVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteSpiritVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.spirit_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## upsertAiDiscoveryLog
You can execute the `upsertAiDiscoveryLog` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertAiDiscoveryLog(options?: useDataConnectMutationOptions<UpsertAiDiscoveryLogData, FirebaseError, UpsertAiDiscoveryLogVariables>): UseDataConnectMutationResult<UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertAiDiscoveryLog(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertAiDiscoveryLogData, FirebaseError, UpsertAiDiscoveryLogVariables>): UseDataConnectMutationResult<UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables>;
```

### Variables
The `upsertAiDiscoveryLog` Mutation requires an argument of type `UpsertAiDiscoveryLogVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertAiDiscoveryLogVariables {
  id: string;
  userId?: string | null;
  analysis?: string | null;
  recommendations?: unknown | null;
  messageHistory?: unknown | null;
}
```
### Return Type
Recall that calling the `upsertAiDiscoveryLog` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `upsertAiDiscoveryLog` Mutation is of type `UpsertAiDiscoveryLogData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertAiDiscoveryLogData {
  aiDiscoveryLog_upsert: AiDiscoveryLog_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `upsertAiDiscoveryLog`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertAiDiscoveryLogVariables } from '@dataconnect/generated';
import { useUpsertAiDiscoveryLog } from '@dataconnect/generated/react'

export default function UpsertAiDiscoveryLogComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertAiDiscoveryLog();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertAiDiscoveryLog(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertAiDiscoveryLog(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertAiDiscoveryLog(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertAiDiscoveryLog` Mutation requires an argument of type `UpsertAiDiscoveryLogVariables`:
  const upsertAiDiscoveryLogVars: UpsertAiDiscoveryLogVariables = {
    id: ..., 
    userId: ..., // optional
    analysis: ..., // optional
    recommendations: ..., // optional
    messageHistory: ..., // optional
  };
  mutation.mutate(upsertAiDiscoveryLogVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., userId: ..., analysis: ..., recommendations: ..., messageHistory: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertAiDiscoveryLogVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.aiDiscoveryLog_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## deleteReview
You can execute the `deleteReview` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteReview(options?: useDataConnectMutationOptions<DeleteReviewData, FirebaseError, DeleteReviewVariables>): UseDataConnectMutationResult<DeleteReviewData, DeleteReviewVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteReview(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteReviewData, FirebaseError, DeleteReviewVariables>): UseDataConnectMutationResult<DeleteReviewData, DeleteReviewVariables>;
```

### Variables
The `deleteReview` Mutation requires an argument of type `DeleteReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteReviewVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `deleteReview` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `deleteReview` Mutation is of type `DeleteReviewData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteReviewData {
  spiritReview_delete?: SpiritReview_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `deleteReview`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteReviewVariables } from '@dataconnect/generated';
import { useDeleteReview } from '@dataconnect/generated/react'

export default function DeleteReviewComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteReview();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteReview(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteReview(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteReview(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteReview` Mutation requires an argument of type `DeleteReviewVariables`:
  const deleteReviewVars: DeleteReviewVariables = {
    id: ..., 
  };
  mutation.mutate(deleteReviewVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteReviewVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.spiritReview_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

