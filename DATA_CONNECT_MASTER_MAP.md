# Data Connect Master Map & API Dictionary (v1.0)
*Source: dataconnect/schema/schema.gql*

This document is the **Single Source of Truth (SSoT)** for all relational entities.

---

## 🏗️ 1. All Tables (Schema Definitions)

### [User] - User Profile & Auth
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String!` | Primary Key (UID) |
| `email` | `String` | |
| `nickname` | `String` | |
| `profileImage` | `String` | |
| `role` | `String` | `ADMIN`, `USER`, `EXPERT` |
| `themePreference` | `String` | `dark`, `light` |
| `isFirstLogin` | `Boolean` | |
| `reviewsWritten` | `Int` | Denormalized |
| `heartsReceived` | `Int` | Denormalized |
| `tasteProfile` | `Any` | JSON Object |
| `createdAt` | `Timestamp` | |

### [Spirit] - Spirit Catalog
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String!` | Primary Key |
| `name` | `String!` | |
| `nameEn` | `String` | |
| `category` | `String!` | |
| `categoryEn` | `String` | |
| `mainCategory` | `String` | |
| `subcategory` | `String` | |
| `distillery` | `String` | |
| `bottler` | `String` | |
| `abv` | `Float` | |
| `volume` | `Int` | |
| `country` | `String` | |
| `region` | `String` | |
| `imageUrl` | `String!` | |
| `thumbnailUrl` | `String` | |
| `descriptionKo` | `String` | |
| `descriptionEn` | `String` | |
| `pairingGuideKo` | `String` | |
| `pairingGuideEn` | `String` | |
| `noseTags` | `[String!]` | |
| `palateTags` | `[String!]` | |
| `finishTags` | `[String!]` | |
| `tastingNote` | `String` | |
| `status` | `String` | |
| `importer` | `String` | |
| `rawCategory` | `String` | |
| `isPublished` | `Boolean` | |
| `isReviewed` | `Boolean` | |
| `reviewedBy` | `String` | |
| `reviewedAt` | `Timestamp` | |
| `rating` | `Float` | |
| `reviewCount` | `Int` | |
| `metadata` | `Any` | |
| `createdAt` | `Timestamp!` | |
| `updatedAt` | `Timestamp!` | |

### [UserCabinet] - Personal Cabinet
| Field | Type | Description |
| :--- | :--- | :--- |
| `user` | `User!` | Relation (userId) |
| `spirit` | `Spirit!` | Relation (spiritId) |
| `addedAt` | `Timestamp` | |
| `notes` | `String` | |
| `rating` | `Int` | |
| `isFavorite` | `Boolean` | |
| `isWishlist` | `Boolean` | |

### [SpiritReview] - Tasting Reviews
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID!` | Primary Key |
| `spirit` | `Spirit!` | Relation |
| `user` | `User!` | Relation |
| `rating` | `Int!` | |
| `title` | `String` | |
| `content` | `String!` | |
| `nose` | `String` | Tag string |
| `palate` | `String` | Tag string |
| `finish` | `String` | Tag string |
| `likes` | `Int` | |
| `isPublished` | `Boolean` | |
| `imageUrls` | `[String!]` | |
| `createdAt` | `Timestamp!` | |
| `updatedAt` | `Timestamp!` | |

### [ReviewLike] - Review Reactions
| Field | Type | Description |
| :--- | :--- | :--- |
| `user` | `User!` | Relation |
| `review` | `SpiritReview!` | Relation |
| `createdAt` | `Timestamp` | |

### [ReviewComment] - Review Discussions
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID!` | Primary Key |
| `review` | `SpiritReview!` | Relation |
| `user` | `User!` | Relation |
| `content` | `String` | |
| `createdAt` | `Timestamp` | |
| `updatedAt` | `Timestamp` | |

### [NewArrival] - Home Curation
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String!` | Primary Key |
| `spirit` | `Spirit!` | Relation |
| `displayOrder` | `Int` | |
| `tags` | `[String!]` | |
| `createdAt` | `Timestamp` | |

### [NewsArticle] - Industry News
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String!` | Primary Key |
| `title` | `String!` | |
| `content` | `String!` | |
| `imageUrl` | `String` | |
| `category` | `String` | |
| `source` | `String` | |
| `link` | `String` | |
| `date` | `String` | |
| `translations` | `Any` | |
| `tags` | `Any` | |
| `createdAt` | `Timestamp` | |
| `updatedAt` | `Timestamp` | |

### [ModificationRequest] - Data Correction
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String!` | Primary Key |
| `spiritId` | `String!` | |
| `spiritName` | `String` | |
| `userId" | `String` | |
| `title` | `String!` | |
| `content` | `String!` | |
| `status` | `String` | |
| `createdAt` | `Timestamp` | |

### [WorldCupResult] - Game Results
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID!` | Primary Key |
| `winner` | `Spirit!` | Relation |
| `category" | `String!` | |
| `subcategory` | `String` | |
| `initialRound` | `Int` | |
| `timestamp` | `Timestamp` | |

### [AiDiscoveryLog] - Chat Memory
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String!` | Primary Key |
| `userId` | `String` | |
| `analysis` | `String` | |
| `recommendations` | `Any` | JSON: [{id, name, reason...}] |
| `messageHistory` | `Any` | JSON: [{role, content}] |
| `createdAt` | `Timestamp` | |

---

## 🛠️ 2. Rules of Engagement
1. **Naming**: Strictly **CamelCase** for all Data Connect fields. 
2. **Aliasing**: Never create snake_case aliases in resolvers.
3. **Validation**: Use `DATA_CONNECT_MASTER_MAP.md` as the validator for all AI generated code. 
