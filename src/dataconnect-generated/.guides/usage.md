# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useUpsertUser, useUpsertSpirit, useUpsertNewArrival, useUpsertReview, useUpdateReview, useUpsertNews, useDeleteNews, useUpsertCabinet, useDeleteCabinet, useUpsertModificationRequest } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useUpsertUser(upsertUserVars);

const { data, isPending, isSuccess, isError, error } = useUpsertSpirit(upsertSpiritVars);

const { data, isPending, isSuccess, isError, error } = useUpsertNewArrival(upsertNewArrivalVars);

const { data, isPending, isSuccess, isError, error } = useUpsertReview(upsertReviewVars);

const { data, isPending, isSuccess, isError, error } = useUpdateReview(updateReviewVars);

const { data, isPending, isSuccess, isError, error } = useUpsertNews(upsertNewsVars);

const { data, isPending, isSuccess, isError, error } = useDeleteNews(deleteNewsVars);

const { data, isPending, isSuccess, isError, error } = useUpsertCabinet(upsertCabinetVars);

const { data, isPending, isSuccess, isError, error } = useDeleteCabinet(deleteCabinetVars);

const { data, isPending, isSuccess, isError, error } = useUpsertModificationRequest(upsertModificationRequestVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUser, upsertSpirit, upsertNewArrival, upsertReview, updateReview, upsertNews, deleteNews, upsertCabinet, deleteCabinet, upsertModificationRequest } from '@dataconnect/generated';


// Operation upsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);

// Operation upsertSpirit:  For variables, look at type UpsertSpiritVars in ../index.d.ts
const { data } = await UpsertSpirit(dataConnect, upsertSpiritVars);

// Operation upsertNewArrival:  For variables, look at type UpsertNewArrivalVars in ../index.d.ts
const { data } = await UpsertNewArrival(dataConnect, upsertNewArrivalVars);

// Operation upsertReview:  For variables, look at type UpsertReviewVars in ../index.d.ts
const { data } = await UpsertReview(dataConnect, upsertReviewVars);

// Operation updateReview:  For variables, look at type UpdateReviewVars in ../index.d.ts
const { data } = await UpdateReview(dataConnect, updateReviewVars);

// Operation upsertNews:  For variables, look at type UpsertNewsVars in ../index.d.ts
const { data } = await UpsertNews(dataConnect, upsertNewsVars);

// Operation deleteNews:  For variables, look at type DeleteNewsVars in ../index.d.ts
const { data } = await DeleteNews(dataConnect, deleteNewsVars);

// Operation upsertCabinet:  For variables, look at type UpsertCabinetVars in ../index.d.ts
const { data } = await UpsertCabinet(dataConnect, upsertCabinetVars);

// Operation deleteCabinet:  For variables, look at type DeleteCabinetVars in ../index.d.ts
const { data } = await DeleteCabinet(dataConnect, deleteCabinetVars);

// Operation upsertModificationRequest:  For variables, look at type UpsertModificationRequestVars in ../index.d.ts
const { data } = await UpsertModificationRequest(dataConnect, upsertModificationRequestVars);


```