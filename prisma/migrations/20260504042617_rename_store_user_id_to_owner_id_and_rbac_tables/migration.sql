/*
  Warnings:

  - You are about to drop the column `userId` on the `stores` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[ownerId,slug]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "StoreMemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'INVITED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ModuleAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_userId_fkey";

-- DropIndex
DROP INDEX "stores_userId_idx";

-- DropIndex
DROP INDEX "stores_userId_slug_key";

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "PlatformRole" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "store_members" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "StoreMemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_member_roles" (
    "storeMemberId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "store_member_roles_pkey" PRIMARY KEY ("storeMemberId","roleId")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "action" "ModuleAction" NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateIndex
CREATE INDEX "store_members_userId_idx" ON "store_members"("userId");

-- CreateIndex
CREATE INDEX "store_members_storeId_idx" ON "store_members"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "store_members_storeId_userId_key" ON "store_members"("storeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "store_members_id_storeId_key" ON "store_members"("id", "storeId");

-- CreateIndex
CREATE INDEX "roles_storeId_idx" ON "roles"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_storeId_name_key" ON "roles"("storeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_id_storeId_key" ON "roles"("id", "storeId");

-- CreateIndex
CREATE INDEX "store_member_roles_storeId_idx" ON "store_member_roles"("storeId");

-- CreateIndex
CREATE INDEX "store_member_roles_roleId_idx" ON "store_member_roles"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "modules_name_key" ON "modules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE INDEX "permissions_moduleId_idx" ON "permissions"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_moduleId_action_key" ON "permissions"("moduleId", "action");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE INDEX "stores_ownerId_idx" ON "stores"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "stores_ownerId_slug_key" ON "stores"("ownerId", "slug");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_members" ADD CONSTRAINT "store_members_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_members" ADD CONSTRAINT "store_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_member_roles" ADD CONSTRAINT "store_member_roles_storeMemberId_storeId_fkey" FOREIGN KEY ("storeMemberId", "storeId") REFERENCES "store_members"("id", "storeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_member_roles" ADD CONSTRAINT "store_member_roles_roleId_storeId_fkey" FOREIGN KEY ("roleId", "storeId") REFERENCES "roles"("id", "storeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
