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