ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "UserSession" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Salesman" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Department" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Lead" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Brand" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
