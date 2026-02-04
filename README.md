# SPI Lead Collection

Lead capture and management app for events. The app supports admin summaries, lead export, business card extraction (Azure Document Intelligence + OpenAI), and image uploads to S3. Built with Next.js App Router, Prisma, and PostgreSQL.

**Getting Started**

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the required variables:

```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="your-s3-bucket"
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT="https://<your-resource>.cognitiveservices.azure.com/"
AZURE_DOCUMENT_INTELLIGENCE_KEY="..."
OPENAI_API_KEY="..."
```

3. Run Prisma migrations (or push schema to your dev database):

```bash
npx prisma migrate dev
# or
npx prisma db push
```

4. Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

**Required Environment Variables**

`DATABASE_URL`: PostgreSQL connection string used by Prisma.

`AWS_REGION`: AWS region for S3 uploads.

`AWS_ACCESS_KEY_ID`: AWS access key for S3.

`AWS_SECRET_ACCESS_KEY`: AWS secret key for S3.

`AWS_S3_BUCKET`: S3 bucket name used for uploads.

`AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT`: Azure Document Intelligence endpoint.

`AZURE_DOCUMENT_INTELLIGENCE_KEY`: Azure Document Intelligence API key.

`OPENAI_API_KEY`: OpenAI API key used for business card extraction.
