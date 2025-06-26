# Chiva TutorHub Authentication and Admin Dashboard Plan

This document outlines the authentication system and admin dashboard for the Chiva TutorHub website.

## Authentication System

Since the website only requires admin authentication (no user login), we'll implement a streamlined authentication system focused on security and simplicity.

### Authentication Technology

- **NextAuth.js** for authentication management
- **Credentials Provider** for email/password authentication
- **MongoDB** for storing admin credentials
- **bcrypt** for password hashing

### Authentication Flow

1. **Admin Login**
   - Secure login page with email and password fields
   - CSRF protection
   - Rate limiting to prevent brute force attacks
   - Remember me functionality

2. **Session Management**
   - JWT-based sessions
   - Secure HTTP-only cookies
   - Configurable session duration
   - Automatic session refresh

3. **Security Measures**
   - Password hashing with bcrypt
   - Environment variable protection for secrets
   - HTTPS enforcement
   - Protection against common vulnerabilities (XSS, CSRF)

### Implementation Details

```javascript
// Example NextAuth configuration
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email }
        });

        if (!admin) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, admin.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
});
```

## Admin Dashboard

The admin dashboard will provide a centralized interface for managing all dynamic content on the website.

### Dashboard Structure

1. **Dashboard Home**
   - Overview statistics
   - Recent activity
   - Quick action buttons

2. **Resource Management**
   - List of all resources
   - Add new resource form
   - Edit existing resources
   - Delete resources
   - Toggle free/paid status
   - View download statistics

3. **Blog Management**
   - List of all blog posts
   - Create new post with rich text editor
   - Edit existing posts
   - Delete posts
   - Draft/publish toggle
   - View reading statistics

4. **Message Center**
   - List of all messages from contact form and chat
   - Read/unread status
   - Reply functionality
   - Archive old messages
   - Filter by date, read status, etc.

5. **Video Management**
   - Upload videos for homepage
   - Select featured video
   - Edit video details
   - Remove videos

6. **Settings**
   - Update admin profile
   - Change password
   - Site configuration options

### Access Control

- All dashboard routes will be protected with authentication
- API routes for data manipulation will verify admin session
- Middleware will redirect unauthenticated users to login page

```javascript
// Example middleware for protecting admin routes
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
```

### User Experience

- Responsive design for desktop and tablet use
- Intuitive navigation between dashboard sections
- Consistent UI patterns for CRUD operations
- Immediate feedback for user actions
- Confirmation dialogs for destructive actions
- Search and filter capabilities for content management

## Implementation Approach

1. **Setup Authentication**
   - Install NextAuth.js
   - Configure Credentials provider
   - Create login page
   - Set up protected routes

2. **Create Dashboard Layout**
   - Design sidebar navigation
   - Create responsive layout
   - Implement header with admin info

3. **Implement Resource Management**
   - Create resource listing interface
   - Build resource upload form with file handling
   - Implement edit/delete functionality
   - Add free/paid toggle

4. **Implement Blog Management**
   - Set up rich text editor
   - Create blog post form
   - Build post listing interface
   - Implement draft/publish functionality

5. **Implement Message Center**
   - Create message listing interface
   - Build reply functionality
   - Implement read/unread toggling
   - Add filtering and search

6. **Implement Video Management**
   - Create video upload interface
   - Build video listing
   - Implement featured video selection

7. **Add Settings**
   - Create profile update form
   - Implement password change functionality
   - Add site configuration options

## Security Considerations

- Regular security audits
- Input validation on all forms
- Protection against common vulnerabilities
- Secure handling of file uploads
- Rate limiting for authentication attempts
- Secure storage of credentials and tokens
