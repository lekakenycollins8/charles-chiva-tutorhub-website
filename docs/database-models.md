# Chiva TutorHub Database Models

This document outlines the database models for the Chiva TutorHub website using MongoDB Atlas with Prisma ORM.

## Database Models

### Admin Model
```prisma
model Admin {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String   // Hashed password
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Resource Model
```prisma
model Resource {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String
  type        String   // "document" or "video"
  category    String   // "chemistry", "mathematics", "business", "accounting"
  isPaid      Boolean  @default(false)
  price       Float?   // Null if isPaid is false
  fileUrl     String   // URL to GridFS, Cloudinary, or other storage
  fileType    String   // MIME type
  fileSize    Int      // Size in bytes
  downloads   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Blog Model
```prisma
model Blog {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  title        String
  slug         String   @unique
  content      String   // Rich text content
  excerpt      String?  // Short summary for listings
  featuredImage String?  // URL to image
  tags         String[] // Array of tags
  publishedAt  DateTime @default(now())
  updatedAt    DateTime @updatedAt
  isPublished  Boolean  @default(true)
}
```

### Message Model
```prisma
model Message {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  email     String
  subject   String?
  message   String
  response  String?  // Admin response to the message
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Video Model (For Homepage Videos)
```prisma
model Video {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String?
  videoUrl    String   // Cloudinary URL
  thumbnailUrl String?  // Thumbnail image URL
  isFeatured  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Payment Model
```prisma
model Payment {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  amount        Float
  currency      String   @default("USD")
  status        String   // "pending", "completed", "failed"
  customerEmail String
  customerName  String?
  resourceId    String?  @db.ObjectId
  stripePaymentId String  // Stripe payment ID for reference
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## File Storage Strategy

### Small Files (< 16MB)
- Stored directly in MongoDB using GridFS
- Includes:
  - PDF documents
  - Small images
  - Text-based study materials

### Large Files and Videos
- Stored in Cloudinary
- Includes:
  - Video content
  - Large documents
  - High-resolution images

## Database Connection

The database connection will be established using Prisma with MongoDB Atlas. The connection string will be stored in environment variables for security.

Example connection setup:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
```

## Environment Variables

Required environment variables for the database connection:

```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/chiva-tutorhub?retryWrites=true&w=majority"
```

Additional environment variables for file storage:

```
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```
