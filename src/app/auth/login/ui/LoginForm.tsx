"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { authenticate } from "@/actions/auth/login";
import { IoInformationOutline } from "react-icons/io5";
import { useFormStatus } from "react-dom";
import clsx from "clsx";

export const LoginForm = () => {

    const [state, dispatch] = useActionState(authenticate, undefined);
    
    useEffect(() => {
      

        if(state === "Success"){
            //redireccionar
            window.location.replace("/");
        }
        
    }, [state])
    

    console.log(state);
    return (
        <form 
            action={dispatch}
            className="flex flex-col">

        <label htmlFor="email">Correo electrónico</label>
        <input className="px-5 py-2 bg-gray-200 rounded mb-5" type="email" name="email" id="email"/>

        <label htmlFor="password">Contraseña</label>
        <input className="px-5 py-2 bg-gray-200 rounded mb-5" type="password" name="password" id="password"/>

        {
            state === "CredentialsSignin" && (
                <div className="mb-4 flex flex-row bg-red-500 p-2 rounded-sm">
                    <IoInformationOutline className="h-5 w-5 text-white" />
                    <p className="text-sm text-white">Credenciales no son correctas</p>
                </div>
            )
        }

        <LoginButton />

        {/* divisor l ine */}
        <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-500"></div>
            <div className="px-2 text-gray-800">O</div>
            <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link href="/auth/new-account" className="btn-secondary text-center">
            Crear una nueva cuenta
        </Link>
        </form>
    );
};

const LoginButton = () => {
    const {pending} = useFormStatus();
    return  <button 
    className={clsx({
        "btn-primary": !pending,
        "btn-disabled": pending
    }) }
    disabled={pending}
    type="submit">Ingresar</button>
    
}
