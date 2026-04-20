# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useListSpirits, useListTrendingSpirits, useListNewArrivals, useGetSpirit, useAdminListRawSpirits, useGetUserProfile, useListNewsArticles, useGetNewsArticle, useAuditAllUsers, useAuditAllNews } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useListSpirits(listSpiritsVars);

const { data, isPending, isSuccess, isError, error } = useListTrendingSpirits(listTrendingSpiritsVars);

const { data, isPending, isSuccess, isError, error } = useListNewArrivals(listNewArrivalsVars);

const { data, isPending, isSuccess, isError, error } = useGetSpirit(getSpiritVars);

const { data, isPending, isSuccess, isError, error } = useAdminListRawSpirits(adminListRawSpiritsVars);

const { data, isPending, isSuccess, isError, error } = useGetUserProfile(getUserProfileVars);

const { data, isPending, isSuccess, isError, error } = useListNewsArticles(listNewsArticlesVars);

const { data, isPending, isSuccess, isError, error } = useGetNewsArticle(getNewsArticleVars);

const { data, isPending, isSuccess, isError, error } = useAuditAllUsers();

const { data, isPending, isSuccess, isError, error } = useAuditAllNews();

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
import { listSpirits, listTrendingSpirits, listNewArrivals, getSpirit, adminListRawSpirits, getUserProfile, listNewsArticles, getNewsArticle, auditAllUsers, auditAllNews } from '@dataconnect/generated';


// Operation listSpirits:  For variables, look at type ListSpiritsVars in ../index.d.ts
const { data } = await ListSpirits(dataConnect, listSpiritsVars);

// Operation listTrendingSpirits:  For variables, look at type ListTrendingSpiritsVars in ../index.d.ts
const { data } = await ListTrendingSpirits(dataConnect, listTrendingSpiritsVars);

// Operation listNewArrivals:  For variables, look at type ListNewArrivalsVars in ../index.d.ts
const { data } = await ListNewArrivals(dataConnect, listNewArrivalsVars);

// Operation getSpirit:  For variables, look at type GetSpiritVars in ../index.d.ts
const { data } = await GetSpirit(dataConnect, getSpiritVars);

// Operation adminListRawSpirits:  For variables, look at type AdminListRawSpiritsVars in ../index.d.ts
const { data } = await AdminListRawSpirits(dataConnect, adminListRawSpiritsVars);

// Operation getUserProfile:  For variables, look at type GetUserProfileVars in ../index.d.ts
const { data } = await GetUserProfile(dataConnect, getUserProfileVars);

// Operation listNewsArticles:  For variables, look at type ListNewsArticlesVars in ../index.d.ts
const { data } = await ListNewsArticles(dataConnect, listNewsArticlesVars);

// Operation getNewsArticle:  For variables, look at type GetNewsArticleVars in ../index.d.ts
const { data } = await GetNewsArticle(dataConnect, getNewsArticleVars);

// Operation auditAllUsers: 
const { data } = await AuditAllUsers(dataConnect);

// Operation auditAllNews: 
const { data } = await AuditAllNews(dataConnect);


```