'use server'

import getBaseURL from "@/lib/base-url"
import {Resend} from "resend";

const domain = getBaseURL();
// const {SMTP_EMAIL, SMTP_PASSWORD, RESEND_API_KEY} = process.env;
const resend = new Resend(process.env.RESEND_API_KEY)

const SendVerificationEmail = async (email:string, token:string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  const {data, error} = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: "Confirmation Email",
    html: `<p>Click <a href='${confirmLink}'>here</a> confirm your Email</p>`
  });
  if(data) return data;
  if(error) return error;
  
 

}

export default SendVerificationEmail;