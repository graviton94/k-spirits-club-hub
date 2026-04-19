# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUser, upsertSpirit, upsertReview, upsertNews, upsertCabinet, upsertModificationRequest, upsertWorldCupResult, listSpirits, listNewArrivals, getSpirit } from '@k-spirits/dataconnect';


// Operation upsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);

// Operation upsertSpirit:  For variables, look at type UpsertSpiritVars in ../index.d.ts
const { data } = await UpsertSpirit(dataConnect, upsertSpiritVars);

// Operation upsertReview:  For variables, look at type UpsertReviewVars in ../index.d.ts
const { data } = await UpsertReview(dataConnect, upsertReviewVars);

// Operation upsertNews:  For variables, look at type UpsertNewsVars in ../index.d.ts
const { data } = await UpsertNews(dataConnect, upsertNewsVars);

// Operation upsertCabinet:  For variables, look at type UpsertCabinetVars in ../index.d.ts
const { data } = await UpsertCabinet(dataConnect, upsertCabinetVars);

// Operation upsertModificationRequest:  For variables, look at type UpsertModificationRequestVars in ../index.d.ts
const { data } = await UpsertModificationRequest(dataConnect, upsertModificationRequestVars);

// Operation upsertWorldCupResult:  For variables, look at type UpsertWorldCupResultVars in ../index.d.ts
const { data } = await UpsertWorldCupResult(dataConnect, upsertWorldCupResultVars);

// Operation listSpirits:  For variables, look at type ListSpiritsVars in ../index.d.ts
const { data } = await ListSpirits(dataConnect, listSpiritsVars);

// Operation listNewArrivals:  For variables, look at type ListNewArrivalsVars in ../index.d.ts
const { data } = await ListNewArrivals(dataConnect, listNewArrivalsVars);

// Operation getSpirit:  For variables, look at type GetSpiritVars in ../index.d.ts
const { data } = await GetSpirit(dataConnect, getSpiritVars);


```