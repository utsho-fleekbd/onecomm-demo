/*
  Warnings:

  - You are about to drop the `auth_sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "auth_sessions" DROP CONSTRAINT "auth_sessions_userId_fkey";

-- DropTable
DROP TABLE "auth_sessions";
