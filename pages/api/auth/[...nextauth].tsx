import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
const secret = process.env.NEXTAUTH_SECRET;


const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text"},
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch(`${process.env.API_URL}/auth/signin`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          })
          const user = await res.json()
          if(res.ok && user) {
            return user;
          }
          throw(new Error(user.error))
        } catch (error: any) {
          throw(new Error(error.message))
        }
      },
    }),
  ],
  session: { strategy: "jwt",},
  secret: secret,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {

        return {
          ...token,
          ...user,
          accessToken: user.token,
          refreshToken: user.refreshToken,
        }
      }

      return token
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.accessTokenExpires = token.accessTokenExpires
      return token
    },
  },
};

export default NextAuth(options);