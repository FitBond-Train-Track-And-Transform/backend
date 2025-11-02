Trainer backend (Node + Express + TypeScript + Prisma + MySQL)

Quick start
1. copy .env.example to .env and fill DATABASE_URL and JWT_SECRET
2. npm install
3. npx prisma generate
4. npx prisma migrate dev --name init
5. npm run dev

API
POST /api/auth/signup
POST /api/auth/signin

Trainer model: name, age, gender, specialization, email, password

