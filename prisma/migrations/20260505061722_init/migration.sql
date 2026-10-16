-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'EMPLOY');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ACTIVE', 'BLOCK');

-- CreateEnum
CREATE TYPE "Designation" AS ENUM ('GRAPHICS_DESIGNER', 'VIDEO_EDITOR', 'WEB_DEVELOPER', 'CINEMATOGRAPHER', 'CONTENT_WRITER', 'VOICE_ARTIST', 'DIGITAL_MARKETER');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "photoUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'EMPLOY',
    "skills" TEXT,
    "experience" INTEGER,
    "department" TEXT,
    "salary" DOUBLE PRECISION,
    "status" "STATUS" NOT NULL DEFAULT 'ACTIVE',
    "joiningDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
