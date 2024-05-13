'use server'

import { PrismaClient } from '@prisma/client'
import {createSafeActionClient} from 'next-safe-action'
import bcrypt from 'bcrypt'

import NewPasswordSchema from '@/types/new-password-schema'
import { getPasswordResetTokenByToken } from './token'

const prisma = new PrismaClient()
const action = createSafeActionClient();

const NewPassword = action(NewPasswordSchema, async ({password, token}) => {
    try {
        if(!token) return {error: "Token is Required"};

        const existingToken = await getPasswordResetTokenByToken(token);
        if(!existingToken) return {error: "Token not Found"};

        const hasExpired  = new Date(existingToken.expires) < new Date();
        if(hasExpired) return {error: "Token has expired"};

        const existingUser = await prisma.user.findFirst({
            where: {email: existingToken.email}
        });
        if(!existingUser) return {error: "User not found"};

        const hashpassword = await bcrypt.hash(password, 10);
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    password: hashpassword
                }
            });

            await tx.passwordResetToken.delete({
                where: {id: existingToken.id}
            });
        });
        return {success: "Password Updated"};
    } catch (error) {
        console.log(error);
    }
});

export default NewPassword;


// where: {
//     email: existingToken.email,
//     },
//     data: {
//     emailVerified: new Date(),
//     },