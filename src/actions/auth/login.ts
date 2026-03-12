"use server";
import {signIn } from '@/auth'
import { sleep } from '@/utils';
import { object } from 'zod';

export async function authenticate(
    prevState:string | undefined,
    formData:FormData
) {
     try {
        // await sleep(2);
        // console.log(Object.fromEntries(formData));

        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirect: false,
        });

        return 'Success';

     } catch (error) {

        if(JSON.stringify((error as Error).toString()).includes("CredentialsSignin")){
            return 'CredentialsSignin'
        }
        return 'UnknownError';
     }
}

export const login = async (email:string, password:string) => {
    try {
        await signIn('credentials', {email, password, redirect: false})
        return {
            ok:true,
        }
    } catch (error) {
        console.log(error);
        return {
            ok:false,
            message: "No se pudo iniciar sesión"
        }
    }
}