-- CreateTable
CREATE TABLE "NewTune" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artist" TEXT,
    "title" TEXT,
    "img" TEXT,
    "createdBy" TEXT,
    "comment" TEXT,
    "tagged" TEXT
);

-- CreateTable
CREATE TABLE "ISearchResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artist" TEXT,
    "title" TEXT
);
