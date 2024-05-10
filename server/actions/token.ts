'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

 export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await prisma.email_Token.findFirst({
            where: {email}
        })
         return verificationToken;
    } catch (error) {
        console.log(error);
        return;
    }
}

const generateEmailVerificationToken =  async (email:string) => {
    try {
        const token = crypto.randomUUID();
        const expires = new Date(new Date().getTime() + 3600 * 1000);
        const existingToken = await getVerificationTokenByEmail(email);
   

        if(existingToken) {
            await prisma.email_Token.delete({
                where: {
                    email: existingToken.email,
                    identifier: existingToken.identifier
                }
            });
        }

    

        const verificationToken = await prisma.email_Token.create({
            data: {
                email,
                token,
                expires
            }
        })
        return verificationToken;
    } catch (error) {
        console.log(error);
    }
    

}

export default generateEmailVerificationToken;