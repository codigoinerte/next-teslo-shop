"use server"

import { PaypalOrderStatusResponse } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { getPaypalAccessToken } from "@/utils/getPaypalAccessToken"
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (transactionId:string) => {
    
    const token = await getPaypalAccessToken();
    
    if(!token) return {
        ok: false,
        return: "No existe el token",
    }

    const resp = await verifyPaypalPayment(transactionId, token);
    
    if(!resp) return {
        ok: false,
        message: 'Error al verificar el pago'
    }

    const { status, purchase_units } = resp;
    const { invoice_id: orderId } = purchase_units[0].payments.captures[0];

    if(status != 'COMPLETED') return {
        ok:false,
        message: 'Aún no se ha pagado en Paypal'
    }

    try {
        //TODO: realizar la actualización en nuestra base de datos
        

        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                isPaid: true,
                paidAt: new Date()
            }
        });

        //TODO: revalidar un path

        revalidatePath(`/orders/${orderId}`);

        return {
            ok:true,
            message: 'validación exitosa',
            orderId,
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok:false,
            message: '500 - El pago no se pudo realizar',
        }
    }

}

const verifyPaypalPayment = async ( paypalTransactionId: string, bearerToken:string ):Promise<PaypalOrderStatusResponse| null> => {

    // const papypalOrderUrl = 
    // TODO: make .env to paypal url

    const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${bearerToken}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    try {
        const response = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${paypalTransactionId}`, {
            ...requestOptions,
            cache: "no-store",
        });
        const result = await response.json();
        
        return result;
        
    } catch (error) {
        console.log(error);
        return null;
    }

}