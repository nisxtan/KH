# Kiran Handicraft Pvt Ltd - Production Ready Full Stack Website

A premium showcase and catalog website for a handicraft statue business based in Bouddha, Kathmandu, Nepal.

## Tech Stack

### Frontend
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit & Redux Persist
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **API Client:** Axios
- **UI Components:** Swiper (Carousel), React Hot Toast

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** TypeORM
- **Database:** PostgreSQL (Neon)
- **Authentication:** JWT (JSON Web Tokens) & Bcryptjs
- **Image Storage:** Cloudinary
- **Middleware:** Multer, CORS, Helmet, Cookie-parser

## Project Structure
```
/client  -> Next.js Frontend
/server  -> Express Backend
```

## Setup Instructions

### Backend Setup
1. Navigate to `/server`
2. Install dependencies: `npm install`
3. Create a `.env` file from `.env.example` and fill in your credentials:
   - `DATABASE_URL` (Neon PostgreSQL)
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
4. Run the seed script to create the admin user: `npm run seed`
5. Start development server: `npm run dev`

### Frontend Setup
1. Navigate to `/client`
2. Install dependencies: `npm install`
3. Create a `.env.local` file:
   - `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
4. Start development server: `npm run dev`

## Deployment Instructions

### Frontend (Vercel)
1. Push the `/client` code to a GitHub repository.
2. Connect the repository to Vercel.
3. Set the **Root Directory** to `client`.
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://YOUR-RENDER-SERVICE.onrender.com/api` (must end with `/api`)
5. Redeploy after changing env vars.

### Backend (Render)
1. Push the `/server` code to a GitHub repository.
2. Create a new Web Service on Render.
3. Set the **Root Directory** to `server`.
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add environment variables from `server/.env.example`, especially:
   - `DATABASE_URL` — Neon connection string
   - `JWT_SECRET` — long random string
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://YOUR-APP.vercel.app` (exact origin, no trailing slash; comma-separate preview URLs if needed)
   - Cloudinary keys if using image uploads

### Database (Neon)
1. Create a PostgreSQL database on [Neon](https://neon.tech).
2. Copy the connection string and use it as `DATABASE_URL` on Render.
3. **Run the seed once** from your machine (with `DATABASE_URL` pointing at Neon):
   ```bash
   cd server
   npm install
   npm run seed
   ```
   This creates the admin user (`admin` / `admin123`) and default site settings.  
   **Do not** insert a plain-text password into Neon manually — passwords must be bcrypt-hashed (the seed does this).

### Production troubleshooting

| Symptom | Likely cause | Fix |
|--------|----------------|-----|
| Site mostly English on Vercel; works locally | `NEXT_PUBLIC_API_URL` missing or wrong | Set to Render URL + `/api`, redeploy Vercel |
| API calls fail / CORS errors in browser | `FRONTEND_URL` on Render does not match Vercel URL | Set exact `https://….vercel.app` on Render, redeploy |
| `/admin` login fails | Same as above, or no seeded user | Fix env vars; run `npm run seed`; login with **username** `admin`, not email |
| Nepali/Chinese text looks wrong | Latin fonts only (fixed in app via Noto fonts) | Redeploy client after pull |
| Mixed English + translated text | Open locale URL e.g. `/ne` not `/en` | Use language switcher or `/ne`, `/fr`, etc. |

**Verify API:** open `https://YOUR-RENDER-SERVICE.onrender.com/` — should return `Kiran Handicraft API is running`.

## Admin Credentials
- **Default Username:** admin
- **Default Password:** admin123
(Generated via `npm run seed`)

## Key Features
- **Premium Design:** Gold, Bronze, and Cream color palette with premium typography.
- **Product Catalog:** Beautiful grid and detailed view for statues.
- **WhatsApp Integration:** Direct inquiry button pre-filled with product details.
- **Admin Dashboard:** Full CRUD operations for managing products and images.
- **Mobile First:** Fully responsive across all devices.
- **SEO Optimized:** Meta tags and semantic HTML for search engine visibility.

---
Developed with precision for Kiran Handicraft Pvt Ltd.
