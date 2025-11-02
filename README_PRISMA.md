Prisma notes

After setting DATABASE_URL in .env:

1. Install deps
   npm install

2. Generate client
   npx prisma generate

3. Create migration and apply
   npx prisma migrate dev --name init

4. You can inspect DB
   npx prisma studio
