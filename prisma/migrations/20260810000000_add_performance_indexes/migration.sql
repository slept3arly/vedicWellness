CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

CREATE INDEX "User_deletedAt_createdAt_idx" ON "User"("deletedAt", "createdAt");
