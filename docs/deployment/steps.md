# Deployment Guidelines

## 1. Local setups
1. Install node dependencies: `npm install`
2. Launch local server: `npm run dev`

## 2. Supabase Migrations
1. Link to your cloud instance: `supabase link --project-ref your-ref`
2. Push DDL files: `supabase db push`

## 3. Production Build
1. Bundle visual static assets: `npm run build`
2. Deploy the compiled `dist/` directory to Vercel, Netlify, or AWS CloudFront CDN.
