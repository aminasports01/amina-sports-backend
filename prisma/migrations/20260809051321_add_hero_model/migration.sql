-- CreateTable
CREATE TABLE "Hero" (
    "id" TEXT NOT NULL,
    "offer" JSONB NOT NULL,
    "banner" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);
