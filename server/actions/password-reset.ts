'use server'

import ResetPasswordSchema from '@/types/reset-password-schema';
import { PrismaClient } from '@prisma/client'
import {createSafeActionClient} from 'next-safe-action'
import { generatePasswordResetToken } from './token';
import { SendPasswordResetEmail } from './email';

const prisma = new PrismaClient()
const action = createSafeActionClient();

const PasswordReset = action(ResetPasswordSchema, async({email})  => {
    try {
        const existingUser = await prisma.user.findFirst({
            where: {email}
        });
        if(!existingUser) return {error: "User not found"}

        const passwordResetToken = await generatePasswordResetToken(email);
        if(!passwordResetToken) return {error: "Token not found"}
        if(passwordResetToken) {
            await SendPasswordResetEmail(passwordResetToken?.email, passwordResetToken?.token)
        }
        return {success: "Reset Password Email Sent"}
    } catch (error) {
        console.log(error)
    }

    
});

export default PasswordReset