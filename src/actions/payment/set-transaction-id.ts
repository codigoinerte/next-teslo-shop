"use server"

import { prisma } from "@/lib/prisma"

export const setTransactionId = async (orderId:string, transactionId:string) => {

    try {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { transactionId }
        })
        
        return {
            ok: true,
            message: "registro completo",
            order
        };
    } catch (error) {
        return {
            ok: false,
            message: "No se pudo actualizar el id de la transacción",
            error
        };
    }
}