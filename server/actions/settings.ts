'use server'

import SettingsSchema from '@/types/settings-schema';
import { PrismaClient } from '@prisma/client'
import {createSafeActionClient} from 'next-safe-action'
import { auth } from '../auth';
import bcrypt from 'bcrypt'
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient()
const action = createSafeActionClient();

const settings = action(SettingsSchema, async(values) => {
  const user = await auth();
  if(!user) return {error: "User not Found"};

  const dbUser = await prisma.user.findFirst({
    where: {id: user.user.id}
  });
  if(!dbUser) return {error: "User not Found"};

  if(user.user.isOAuth){
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled =undefined;
  }

  if(values.password && values.newPassword && dbUser.password){
    const passwordMatch = await bcrypt.compare(values.password, dbUser.password);
    if(!passwordMatch) return {error: "Passwords does not match"};

    const samePassword = await bcrypt.compare(values.newPassword, dbUser.password);
    if(samePassword) return {error: "New Password is the Same as old Password"};
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;

  }
  await prisma.user.update({
    where: {id: dbUser.id},
    data: {
        password: values.password,
        twoFactorEnabled: values.isTwoFactorEnabled,
        email: values.email,
        image: values.image,
        name: values.name    
    }
  })
  revalidatePath("/dashboard/settings");
  return {success: "Settings Updated"}
});

export default settings

// user.update({
//     where: {
//         id: existingUser.id
//     },
//     data: {
//         password: hashpassword
//     }
// });