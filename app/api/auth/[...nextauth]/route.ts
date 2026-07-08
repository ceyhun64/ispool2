import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// authOptions tek kaynaktan (lib/auth.ts) gelir — diğer tüm API route'ları da
// getServerSession için aynı kaynağı kullanır. İki bağımsız kopya session/
// callback davranışının sessizce ayrışmasına yol açabiliyordu.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
