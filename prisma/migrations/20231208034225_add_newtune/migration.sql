/*
  Warnings:

  - You are about to drop the `Tune` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tune";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Tunes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artist" TEXT,
    "title" TEXT
);
