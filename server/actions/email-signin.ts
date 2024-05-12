'use server'

import { PrismaClient } from '@prisma/client'
import LoginSchema from '@/types/login-schema';
import {createSafeActionClient} from 'next-safe-action'
import { generateEmailVerificationToken } from './token';
import SendVerificationEmail from './email';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';

const prisma = new PrismaClient()
const action = createSafeActionClient();

const EmailSignIn = action(LoginSchema, async ({email, password, code}) => {
    try {
        // console.log(email, password, code);
        // if User do not exist
        const existingUser = await prisma.user.findUnique({
            where: {email: email}
        })
        if(!existingUser) return {error: "User not Found"}

        // if user Email is not Verify
        if(existingUser.emailVerified === null){
            const verificationToken = await generateEmailVerificationToken(existingUser.email);
            await SendVerificationEmail(verificationToken!.email, verificationToken!.token);
            return {success: "Confirmation Email Reset"};
        }

        await signIn('credentials', {
            email,
            password,
            redirectTo: "/"
        });

        return {Success :'User Sign in!'};

    } catch (error) {
        console.log(error);
        if(error instanceof AuthError){
            switch (error.type) {
                case 'CredentialsSignin':
                return {error: "Email or Password is Incorrect"};
                case 'AccessDenied':
                    return {error: error.message};
                case 'OAuthSignInError':
                    return {error: error.message};    
                default: 
                    return {error: "Some thing went wrong"};    
            }
        }
        throw error;
    }

})

export default EmailSignIn;