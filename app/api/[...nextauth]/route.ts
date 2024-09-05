import NextAuth, { Session} from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { JWT } from "next-auth/jwt"
import { Account } from "next-auth"

declare module "next-auth" {
    interface Session {
      accessToken?: string
    }
  }

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "user-read-currently-playing user-read-playback-state",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }