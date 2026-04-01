import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// DEBUG: Show RAW env values before trimming
console.log(`🔍 [DEBUG]: RAW GOOGLE_CLIENT_ID = "${process.env.GOOGLE_CLIENT_ID}"`);
console.log(`🔍 [DEBUG]: RAW GOOGLE_CLIENT_SECRET = "${process.env.GOOGLE_CLIENT_SECRET}"`);

const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

if (!clientId || !clientSecret) {
  throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables. Please check your .env.local file.");
}

// Debug logging to confirm cleaned lengths and lack of hidden newlines/spaces
console.log(`✅ [NextAuth]: Cleaned Client ID: "${clientId}"`);
console.log(`✅ [NextAuth]: Cleaned Client ID length: ${clientId.length}`);
console.log(`✅ [NextAuth]: Cleaned Client Secret length: ${clientSecret.length}`);

export const authOptions: NextAuthOptions = {
  // 1. Enable NextAuth debug logging to capture OAuth errors in the terminal
  debug: true,

  providers: [
    GoogleProvider({
      // 2. Sanitize and use variables securely without trailing newlines (\n)
      clientId: clientId,
      clientSecret: clientSecret,
      // Explicitly set the callback URL to match Google Cloud Console
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // 3. Correct Google scopes
          scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // 4. Properly map the Google access token onto the NextAuth JWT token
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    // 5. Safely expose the access token into the user session
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: "/",
  },
};


