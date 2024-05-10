'use server'

import { PrismaClient } from '@prisma/client'
import RegisterSchema from '@/types/register-schema'
import {createSafeActionClient} from 'next-safe-action'
import bcrypt from 'bcrypt'

import generateEmailVerificationToken from './token'
import SendVerificationEmail from './email'

const prisma = new PrismaClient()
const action = createSafeActionClient();



const EmailRegister = action(RegisterSchema, async ({email, password, name}) => {
    // console.log(email, password, name);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = await generateEmailVerificationToken(email);

        // Checking if User Already exists
        const existingUser  = await prisma.user.findUnique({
            where: {email}
        })
        

        if(existingUser) {
            if(existingUser.emailVerified === null){
                await SendVerificationEmail(email, verificationToken!.token)
                return {success: "Email Comfirmation Reset"}
            }
            return {error: "User Already exists"}
        } 
        if(!existingUser) {
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword
                }
            })
            await SendVerificationEmail(email, verificationToken!.token);
            return {success: "Email Comfirmation Sent"}
        }
    } catch (error) {
        console.log("During EmailRegistering", error);
    }
    
})

export default EmailRegister;