'use server'

import { PrismaClient } from '@prisma/client'
import LoginSchema from '@/types/login-schema';
import {createSafeActionClient} from 'next-safe-action'

const prisma = new PrismaClient()
const action = createSafeActionClient();

const EmailSignIn = action(LoginSchema, async ({email, password, code}) => {
    console.log(email, password, code);

    const existingUser = await prisma.user.findUnique({
        where: {email: email}
    })
    if(!existingUser) return {error: "Email not Found"}

    return {Success :email};
})

export default EmailSignIn;