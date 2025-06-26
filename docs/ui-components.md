# Chiva TutorHub UI Components Plan

This document outlines the UI components that will be used in the Chiva TutorHub website, leveraging shadcn UI and Tailwind CSS.

## Color Scheme

The website will use a light blue theme as the primary color, complemented by a professional color palette:

```css
/* Tailwind CSS color configuration */
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', /* Primary brand color - light blue */
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  accent: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
}
```

## Typography

```css
/* Tailwind CSS typography configuration */
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  serif: ['Merriweather', 'ui-serif', 'Georgia', 'serif'],
  mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
},
```

## Core UI Components

### Navigation Components

1. **Main Navigation**
   - Responsive navbar with mobile hamburger menu
   - Active state indicators
   - Dropdown for Services submenu
   - shadcn UI components: `NavigationMenu`, `Button`

2. **Footer**
   - Contact information
   - Social media links
   - Quick links to main pages
   - shadcn UI components: `Separator`, `Input`, `Button`

### Home Page Components

1. **Hero Section**
   - Full-width banner with background image
   - Headline and subheadline
   - Call-to-action buttons
   - shadcn UI components: `Card`, `Button`

2. **Services Grid**
   - Card-based layout for each service
   - Icon, title, and brief description
   - "Learn More" link
   - shadcn UI components: `Card`, `CardHeader`, `CardContent`, `CardFooter`

3. **Testimonials Carousel**
   - Sliding testimonials with student feedback
   - Rating stars
   - Student name and subject
   - shadcn UI components: `Carousel`, `Card`

4. **Video Showcase**
   - Embedded video player
   - Video title and description
   - shadcn UI components: `AspectRatio`, `Card`

5. **Quick Contact Form**
   - Simplified contact form
   - Name, email, and message fields
   - Submit button
   - shadcn UI components: `Form`, `Input`, `Textarea`, `Button`

### About Page Components

1. **Profile Card**
   - Tutor photo
   - Name and credentials
   - Brief introduction
   - shadcn UI components: `Card`, `Avatar`

2. **Timeline**
   - Educational and professional milestones
   - Year indicators
   - Description of each milestone
   - shadcn UI components: `Separator`

3. **Skills Grid**
   - Visual representation of expertise areas
   - Progress indicators for skill levels
   - shadcn UI components: `Progress`

### Services Page Components

1. **Service Detail Card**
   - Comprehensive service description
   - List of topics covered
   - shadcn UI components: `Card`, `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`

2. **Topic List**
   - Expandable accordion for detailed topics
   - Nested lists for subtopics
   - shadcn UI components: `Accordion`, `List`

### Pricing Page Components

1. **Pricing Cards**
   - Tiered pricing options
   - Feature list for each tier
   - Call-to-action button
   - shadcn UI components: `Card`, `CardHeader`, `CardContent`, `CardFooter`, `Button`

2. **Pricing Toggle**
   - Switch between hourly/weekly/monthly pricing
   - shadcn UI components: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`

3. **Payment Form**
   - Stripe integration
   - Credit card input
   - Billing information fields
   - shadcn UI components: `Form`, `Input`, `Button`

### Resources Page Components

1. **Resource Filter**
   - Category selection
   - Free/paid toggle
   - Search functionality
   - shadcn UI components: `Select`, `Checkbox`, `Input`

2. **Resource Grid**
   - Card-based layout for resources
   - Thumbnail preview
   - Title and description
   - Download/purchase button
   - shadcn UI components: `Card`, `AspectRatio`, `Badge`, `Button`

3. **Resource Detail Modal**
   - Expanded view of resource details
   - Full description
   - Preview if available
   - Download/purchase options
   - shadcn UI components: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`

### Blog Page Components

1. **Blog Grid**
   - Card-based layout for blog posts
   - Featured image
   - Title and excerpt
   - Publication date and tags
   - shadcn UI components: `Card`, `AspectRatio`, `Badge`

2. **Blog Post**
   - Full article content
   - Rich text formatting
   - Author information
   - Related posts
   - shadcn UI components: `Card`, `Avatar`, `Separator`

3. **Blog Sidebar**
   - Categories list
   - Recent posts
   - Tag cloud
   - shadcn UI components: `Card`, `List`, `Badge`

### Contact Page Components

1. **Contact Form**
   - Full contact form with validation
   - Name, email, subject, message fields
   - Submit button
   - Success/error messages
   - shadcn UI components: `Form`, `Input`, `Select`, `Textarea`, `Button`, `Alert`

2. **Contact Information Card**
   - Email, phone, social media
   - Office hours
   - shadcn UI components: `Card`

3. **FAQ Accordion**
   - Common questions and answers
   - Expandable sections
   - shadcn UI components: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`

### Admin Dashboard Components

1. **Dashboard Layout**
   - Sidebar navigation
   - Header with user info
   - Main content area
   - shadcn UI components: `Sheet`, `Separator`, `Avatar`, `DropdownMenu`

2. **Resource Management**
   - Table of resources
   - Edit/delete actions
   - Upload form
   - shadcn UI components: `Table`, `Dialog`, `Form`, `FileInput`, `Button`

3. **Blog Editor**
   - Rich text editor
   - Image upload
   - Publish/draft toggle
   - shadcn UI components: `Tabs`, `Form`, `Input`, `Switch`

4. **Message Center**
   - Table of messages
   - Read/unread status
   - Reply functionality
   - shadcn UI components: `Table`, `Badge`, `Dialog`, `Textarea`

### Utility Components

1. **Chat Widget**
   - Floating chat button
   - Expandable chat window
   - Message input
   - shadcn UI components: `Sheet`, `Input`, `Button`

2. **Notification Toast**
   - Success/error messages
   - Automatic dismissal
   - shadcn UI components: `Toast`, `ToastAction`

3. **Loading Spinner**
   - Used during data fetching
   - shadcn UI components: `Skeleton`

4. **Pagination**
   - For blog and resources listings
   - Previous/next buttons
   - Page numbers
   - shadcn UI components: `Pagination`

## Responsive Design

All components will be designed with a mobile-first approach, ensuring they work well on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1440px+)

Tailwind's responsive utilities will be used extensively to adjust layouts based on screen size.

## Accessibility

All components will follow accessibility best practices:
- Proper ARIA attributes
- Keyboard navigation
- Sufficient color contrast
- Screen reader compatibility
- Focus management

## Animation and Interaction

Subtle animations will be used to enhance the user experience:
- Hover effects on interactive elements
- Smooth transitions between states
- Loading animations
- Page transitions

These will be implemented using Tailwind's transition utilities and Framer Motion for more complex animations.
