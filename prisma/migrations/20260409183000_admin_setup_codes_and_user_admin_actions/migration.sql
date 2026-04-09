-- CreateTable
CREATE TABLE "AdminSetupCode" (
    "id" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "usedByUserId" TEXT,
    "usedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSetupCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminSetupCode_expiresAt_idx" ON "AdminSetupCode"("expiresAt");

-- AddForeignKey
ALTER TABLE "AdminSetupCode" ADD CONSTRAINT "AdminSetupCode_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSetupCode" ADD CONSTRAINT "AdminSetupCode_usedByUserId_fkey" FOREIGN KEY ("usedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
