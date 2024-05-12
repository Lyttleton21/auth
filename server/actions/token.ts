'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

// Reading from the email_token model if the provide email exists
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

// creating a verification token
export const generateEmailVerificationToken =  async (email:string) => {
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

// Reading from the email_token model if the provide token exists
export const checkEmailToken =  async (token: string) => {
    try {
        const checkToken = await prisma.email_Token.findFirst({
            where: {token: token}
        });
        return checkToken;
    } catch (error) {
        console.log(error);
    }
}


export const newVerification = async (token:string) => {
    try {
        // check if token is valid
        const existingToken = await checkEmailToken(token);
        // console.log(existingToken);
        if(!existingToken) return {error: "Token does not Exist"};

        // check if token has expired 
        const hasExpires = await new Date(existingToken.expires) < new Date();
        if(hasExpires) return {error: "Token has Expires"};

        // checking if does not exist
        const existingUser = await prisma.user.findFirst({
            where: {
                email: existingToken.email
            }
        });
        if(!existingUser) return {error: "Email does not exist"};

        // Verify the Email address
        await prisma.user.update({
            where: {
            email: existingToken.email,
            },
            data: {
            emailVerified: new Date(),
            },
        })

        // Delete the existing token
        await prisma.email_Token.delete({
            where: {
                identifier: existingToken.identifier
            }
        });

        return {success: "Email is Verified"};
    } catch (error) {
        console.log("ERROR WHILE TRYING TO VERIFY EMAIL",error);
    }
}


