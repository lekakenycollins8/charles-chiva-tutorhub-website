import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create NextAuth handler with our configuration
const handler = NextAuth(authOptions);

// Export GET and POST handlers for API route
export { handler as GET, handler as POST };
