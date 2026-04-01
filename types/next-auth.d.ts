import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string;
    user: {
      /** The user's postal address. */
    } & DefaultSession["user"];
  }

  interface JWT extends DefaultJWT {
    accessToken?: string;
  }
}
