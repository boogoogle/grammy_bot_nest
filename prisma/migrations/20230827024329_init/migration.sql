-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tgAccountId" BIGINT NOT NULL DEFAULT 0,
    "tgUsername" TEXT
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "mnemonic" TEXT NOT NULL,
    "tgAccountId" BIGINT,
    CONSTRAINT "wallets_tgAccountId_fkey" FOREIGN KEY ("tgAccountId") REFERENCES "users" ("tgAccountId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_tgAccountId_key" ON "users"("tgAccountId");
