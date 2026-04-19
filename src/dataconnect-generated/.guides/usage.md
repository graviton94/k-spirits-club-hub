# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listSpirits, listNewArrivals, getSpirit, adminListRawSpirits, getUserProfile, listNewsArticles, getNewsArticle, auditAllUsers, auditAllNews, auditAllSpirits } from '@k-spirits/dataconnect';


// Operation listSpirits:  For variables, look at type ListSpiritsVars in ../index.d.ts
const { data } = await ListSpirits(dataConnect, listSpiritsVars);

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

// Operation auditAllSpirits: 
const { data } = await AuditAllSpirits(dataConnect);


```