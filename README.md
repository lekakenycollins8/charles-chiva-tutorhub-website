# Charles Chiva TutorHub

A comprehensive tutoring platform built with Next.js that connects students with educational resources and tutoring services. Features include resource downloads, pricing plans, blog content management, and secure payment processing.

## Features

- **Resource Management**: Browse and download educational materials with secure access control
- **Video Tutorials**: Stream educational video content with tracking
- **Pricing Plans**: Multiple subscription tiers with different access levels
- **Payment Processing**: Integrated Mpesa STK Push for secure mobile payments in Kenya
- **Admin Dashboard**: Complete content management system for resources, videos, and blog posts
- **Authentication**: Secure user authentication with role-based access (admin-only system)
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **Blog System**: Content management for educational articles and announcements with rich text editing
- **Contact Management**: Contact form submission tracking and management
- **File Upload**: Cloudinary integration for media file storage

## Tech Stack

- **Framework**: Next.js 15 (App Router) with Turbopack
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Authentication**: NextAuth.js v4
- **Payment Provider**: Mpesa STK Push (Safaricom Daraja API)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **File Storage**: Cloudinary for media files
- **Rich Text Editor**: Tiptap with custom extensions
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: Zustand
- **Animations**: Framer Motion and Lottie React
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Mpesa Daraja developer account for payment processing
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
# Database (PostgreSQL - Neon)
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Mpesa Payment (Daraja API)
MPESA_CONSUMER_KEY="your-consumer-key"
MPESA_CONSUMER_SECRET="your-consumer-secret"
MPESA_PASSKEY="your-passkey"
MPESA_BUSINESS_SHORTCODE="your-business-shortcode"
MPESA_TILL_NUMBER="your-till-number"
MPESA_CALLBACK_URL="https://your-domain.com/api/mpesa/callback"
MPESA_ENVIRONMENT="sandbox" # or "production"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
MPESA_CURRENCY="KES"

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

4. Seed the database (optional):
```bash
npm run db:seed
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
│   │   ├── auth/         # NextAuth authentication
│   │   ├── mpesa/        # Mpesa payment integration
│   │   ├── resources/   # Resource download endpoints
│   │   └── upload/       # File upload endpoint
│   ├── about/            # About page
│   ├── blog/             # Blog pages
│   ├── contact/          # Contact page
│   ├── pricing/          # Pricing plans page
│   ├── resources/        # Resources page
│   ├── services/         # Services page
│   ├── privacy/          # Privacy policy
│   └── terms/            # Terms of service
├── components/            # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── blog/             # Blog components
│   ├── contact/          # Contact form components
│   ├── pricing/          # Payment-related components
│   ├── resources/        # Resource display components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components
├── hooks/                 # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── actions/          # Server actions for database operations
│   ├── utils/            # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client configuration
│   ├── cloudinary.ts     # Cloudinary configuration
│   ├── mpesa.ts          # Mpesa integration
│   └── types.ts          # TypeScript type definitions
├── data/                 # Static data and configurations
│   ├── aboutData.ts      # About page content
│   ├── pricing.ts        # Pricing plans data
│   ├── resources.ts      # Resources data
│   ├── services.ts       # Services data
│   └── testimonials.ts   # Testimonials data
└── types/                 # TypeScript type definitions
    ├── blog.ts           # Blog types
    ├── contact.ts        # Contact types
    ├── resource.ts       # Resource types
    └── video.ts          # Video types
prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seed script
```

## Payment Integration

This platform uses Mpesa STK Push for mobile payments in Kenya:

### Mpesa STK Push
- **Resource Purchases**: One-time payments for downloadable content via Mpesa
- **Subscription Plans**: Pay for tutoring sessions using Mpesa
- **STK Push**: Payment prompt sent directly to customer's phone
- **Webhook Processing**: Automatic payment verification and access granting
- **Transaction Type**: Supports both Paybill and Till Number payments

### Payment Flow

1. User enters phone number and initiates payment
2. System sends STK push request to Mpesa API
3. User receives Mpesa prompt on phone and enters PIN
4. Mpesa processes payment and sends callback webhook
5. System verifies payment and grants access (downloads or plan activation)

### Webhook Testing

The project includes scripts for webhook testing during development:
- `setup-ngrok-webhook.sh` - Set up ngrok tunnel for webhook testing
- `start-webhook-testing.sh` - Start webhook testing environment
- `test-webhook.sh` - Test webhook endpoints

See `webhook-testing-guide.md` for detailed instructions.

## Database Schema

The application uses PostgreSQL with the following main models:

- **User**: Admin users with authentication credentials
- **Resource**: Educational materials (files) with download tracking
- **Video**: Tutorial videos with view tracking
- **BlogPost**: Blog articles with rich content and relations
- **ContactSubmission**: Contact form submissions with status tracking
- **Payment**: Payment records for both resources and plans
- **CheckoutMetadata**: Temporary storage for checkout sessions

## Deployment

### Production Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Environment Variables for Production

Ensure all environment variables are properly configured in your hosting environment, especially:
- PostgreSQL connection strings (DATABASE_URL and DIRECT_URL)
- IntaSend API keys
- Paystack API keys
- NextAuth configuration
- Cloudinary credentials

### Build Command

```bash
npm run build
```

This will run Prisma migrations and build the Next.js application.

## Development Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed the database with initial data

## Additional Documentation

The project includes additional setup guides:

- `CLOUDINARY_SETUP.md` - Detailed Cloudinary configuration instructions
- `webhook-testing-guide.md` - Webhook testing with ngrok for Mpesa callbacks
- `env-migration-guide.txt` - Environment variable migration guide

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running and accessible
- Verify DATABASE_URL and DIRECT_URL are correctly set
- Run `npx prisma generate` after schema changes

### Payment Webhook Issues
- Use ngrok for local webhook testing
- Verify webhook secrets match in both payment provider and environment
- Check webhook URL is publicly accessible

### Build Errors
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Regenerate Prisma client: `npx prisma generate`

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
