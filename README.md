# PaperMint Resume Maker — React + Express + MongoDB

A distinctive full-stack resume maker with a warm editorial visual identity instead of the common black/blue dashboard style.

## Includes
- React + Vite frontend
- Express backend
- MongoDB + Mongoose persistence
- Personal, experience, education, projects, skills and certifications
- 3 resume templates
- Live A4 preview
- Print / Save PDF
- Create/read/update/delete REST API
- MongoDB health endpoint
- Responsive UI

## Connect YOUR MongoDB

1. Go to `backend`.
2. Rename `.env.example` to `.env`.
3. Replace the placeholder with your MongoDB Atlas connection string:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/resume_maker?retryWrites=true&w=majority
```

4. Start backend:

```bash
cd backend
npm install
npm run dev
```

You should see:

```text
✓ MongoDB connected
✓ API running at http://localhost:5000
```

5. In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Confirm MongoDB
Open `http://localhost:5000/api/health`.

A successful connection reports `database: "connected"` and `mongoConfigured: true`.

After clicking **Save Resume**, the document is stored in your MongoDB `resumes` collection.

## MongoDB Atlas checklist
- Create an Atlas cluster.
- Create a database user.
- Add your IP in Network Access.
- Copy the Node.js connection string.
- Put it in `backend/.env`.
- Never upload `.env` to GitHub.

## API
- GET `/api/health`
- GET `/api/resumes`
- GET `/api/resumes/:id`
- POST `/api/resumes`
- PUT `/api/resumes/:id`
- DELETE `/api/resumes/:id`

## Future production upgrades
Authentication, user-specific resumes, public share links, server-side PDF generation, cloud uploads, autosave, drag-and-drop ordering, and AI-assisted bullet suggestions.
