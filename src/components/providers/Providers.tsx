"use client"

import { SessionProvider } from "next-auth/react"
import {
    PayPalProvider,
} from "@paypal/react-paypal-js/sdk-v6";


interface Props {
    children:React.ReactNode;
}
export const Providers = ({children}:Props) => {
    // console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '');
    return (
        <PayPalProvider
            
            clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? ''}
            environment="sandbox"
            components={["paypal-payments"]}
            pageType="checkout">
            <SessionProvider>
                {children}
            </SessionProvider>
        </PayPalProvider>
    )
}
