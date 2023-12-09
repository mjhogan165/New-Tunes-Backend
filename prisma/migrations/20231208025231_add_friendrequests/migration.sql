-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sender" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
