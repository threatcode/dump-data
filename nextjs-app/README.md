# RingID - Modern Social Platform

A Next.js 16 application for connecting with friends, sharing moments, and discovering news and trends.

## Features

- **Authentication**: Secure sign-in/sign-up with Supabase
- **Dashboard**: Personalized home page with quick access to all features
- **Feed**: Share and discover posts from your network
- **News Portal**: Curated articles and trends with categories
- **Messaging**: Real-time chat with friends
- **User Profiles**: Customizable profiles with profile pictures
- **Saved Items**: Bookmark articles for later reading
- **Settings**: Privacy and notification preferences

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS 3
- **UI Components**: shadcn/ui inspired components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Vercel Blob
- **State Management**: React Hooks + Custom Hooks
- **HTTP Client**: Axios + SWR for data fetching

## Project Structure

```
nextjs-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   ├── dashboard/              # Dashboard page
│   │   ├── feed/                   # Feed page
│   │   ├── news/                   # News portal
│   │   ├── chat/                   # Messaging
│   │   ├── profile/                # User profile
│   │   ├── saved/                  # Saved items
│   │   ├── settings/               # Settings page
│   │   ├── signin/                 # Sign in
│   │   ├── signup/                 # Sign up
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   ├── AppLayout.tsx           # App layout wrapper
│   │   ├── ProtectedRoute.tsx      # Route protection
│   │   └── FeedPost.tsx            # Feed post component
│   ├── hooks/
│   │   └── useAuth.ts              # Authentication hook
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client
│   │   └── utils.ts                # Utility functions
│   └── context/                    # React context providers
├── public/
│   └── robots.txt                  # SEO robots file
├── next.config.js                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── vercel.json                     # Vercel deployment config
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextjs-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase and Vercel Blob credentials.

4. Run the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Vercel Blob (optional, for file uploads)
BLOB_READ_WRITE_TOKEN=your_blob_token
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Pages and Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/signin` | Sign in page |
| `/signup` | Sign up page |
| `/dashboard` | User dashboard (protected) |
| `/feed` | Social feed (protected) |
| `/news` | News portal (protected) |
| `/chat` | Messaging (protected) |
| `/profile` | User profile (protected) |
| `/saved` | Saved items (protected) |
| `/settings` | Settings (protected) |

## Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel project settings
3. Deploy with `git push` to main branch

```bash
vercel
```

### Deploy to Custom Server

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS-in-JS with Tailwind CSS
- Static generation where possible
- API route optimization

## SEO Features

- Metadata optimization with title templates
- Open Graph tags for social sharing
- Sitemap generation (`/sitemap.xml`)
- Robots.txt for search engines
- Semantic HTML structure
- Proper heading hierarchy

## Security

- Supabase authentication and RLS policies
- CSRF protection
- XSS prevention with React's built-in escaping
- Secure headers configured
- Environment variables for sensitive data

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m 'Add your feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@ringid.app or open an issue on GitHub.

## Roadmap

- [ ] Real-time notifications
- [ ] Video streaming
- [ ] Advanced search
- [ ] Recommendation algorithm
- [ ] Mobile app
- [ ] Blockchain integration
- [ ] Advanced analytics

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Core features: Auth, Feed, News, Chat, Profile
- Responsive design
- SEO optimization
- Vercel deployment ready
