import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

// Each checked-out connection is closed on release. Workers must not reuse
// sockets created by a different request; transactions retain their own socket.
neonConfig.webSocketConstructor = globalThis.WebSocket;
export function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaNeon({
      connectionString: process.env.DATABASE_URL,
      maxUses: 1,
      connectionTimeoutMillis: 15000,
    }),
  });
}
