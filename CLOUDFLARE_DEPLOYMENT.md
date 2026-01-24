# Cloudflare Pages Configuration

## Deployment Settings

- **Framework preset**: Next.js (Static HTML Export)
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Node version**: 18.x or higher

## Environment Variables

Set these in Cloudflare Pages dashboard:

```
FOOD_SAFETY_KOREA_API_KEY=your_key_here
WHISKYBASE_API_KEY=your_key_here
```

## Custom Headers (Optional)

Create `public/_headers` file for security headers:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Redirects (Optional)

Create `public/_redirects` file:

```
/admin/* 200
/spirits/* 200
```

## Notes

- Next.js static export is used for Cloudflare Pages compatibility
- Dynamic features require Cloudflare Workers or Pages Functions
- Database integration recommended: Cloudflare D1 or Turso
