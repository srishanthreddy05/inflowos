import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
console.log("🔥 FINAL ENV:", process.env.GOOGLE_CLIENT_ID);
