# Charles Chiva TutorHub

A comprehensive tutoring platform built with Next.js that connects students with educational resources and tutoring services. Features include resource downloads, pricing plans, and secure payment processing.

## Features

- **Resource Management**: Browse and download educational materials with secure access control
- **Pricing Plans**: Multiple subscription tiers with different access levels
- **Payment Processing**: Integrated IntaSend payment system for secure transactions
- **Admin Dashboard**: Complete content management system for resources, videos, and blog posts
- **Authentication**: Secure user authentication with role-based access
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **Blog System**: Content management for educational articles and announcements

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment Provider**: IntaSend (formerly PayPal)
- **Styling**: Tailwind CSS + shadcn/ui
- **File Storage**: Cloudinary for media files
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- IntaSend account for payment processing
- Cloudinary account for file storage

### Environment Setup

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure the following variables:
```env
# Database
DATABASE_URL="mongodb://localhost:27017/tutorhub"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# IntaSend Payment
INTASEND_PUBLISHABLE_KEY="your-publishable-key"
INTASEND_SECRET_KEY="your-secret-key"
INTASEND_WEBHOOK_SECRET="your-webhook-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard routes
│   ├── api/               # API endpoints
│   └── (pages)/           # Public pages
├── components/            # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   └── pricing/          # Payment-related components
├── lib/                  # Utility functions and configurations
│   ├── actions/          # Database operations
│   └── types.ts          # TypeScript type definitions
└── data/                 # Static data and configurations
```

## Payment Integration

This platform uses **IntaSend** for payment processing. The system supports:

- **Resource Purchases**: One-time payments for downloadable content
- **Subscription Plans**: Recurring payments for premium access
- **Webhook Processing**: Automatic payment verification and access granting

### Payment Flow

1. User initiates payment via IntaSend checkout
2. Payment metadata is stored temporarily in database
3. IntaSend processes payment and sends webhook confirmation
4. System verifies payment and grants access (downloads or plan activation)

## Deployment

### Production Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Environment Variables for Production

Ensure all environment variables are properly configured in your hosting environment, especially:
- Database connection string
- IntaSend API keys
- NextAuth configuration
- Cloudinary credentials

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software for Charles Chiva TutorHub.

## Support

For support and questions, please contact the development team.
