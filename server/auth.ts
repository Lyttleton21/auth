import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import NextAuth from "next-auth"
import github from "next-auth/providers/github"
import Credentials  from "next-auth/providers/credentials"
import LoginSchema from "@/types/login-schema"
import bcrypt from 'bcrypt'
 
const prisma = new PrismaClient()
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  session: {strategy: "jwt"},
  callbacks:{
    async session({session, token}){
      if(session && token.sub){
        session.user.id = token.sub;
      }
      if(session.user && token.role){
        session.user.role = token.role as string
      }
      if(session.user){
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.isOAuth = token.isOAuth as boolean
        session.user.image = token.image as string
      }
      return session
    },
    async jwt({token}){
      if(!token.sub) return token;

      const existingUser = await prisma.user.findFirst({
        where: {id: token.sub}
      });
      if(!existingUser)return token;

      const existingAccount = await prisma.account.findFirst({
        where: {userId: existingUser.id}
      });
      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.image = existingUser.image
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled
      return token;
    }
  },
  providers: [
    github({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        allowDangerousEmailAccountLinking: true
    }),
    Credentials({
      authorize: async (credentials) => {
        const validateFields = LoginSchema.safeParse(credentials);

        if(validateFields.success){
          const {email, password} = validateFields.data;

          const user = await prisma.user.findFirst({
            where: {email:email}
          });
          if(!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password!);
          if(passwordMatch) return user;
        }
        return null;
      }
    })
  ],
})