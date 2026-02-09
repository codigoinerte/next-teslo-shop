"use server"

import { prisma } from "@/lib/prisma"

export const deleteUserAddress = async (userId: string) => {
    
    if(!userId) return;

    try {
        const storedAddress = await prisma.userAddress.findUnique({
            where:{
                userId
            }
        });
        
        if(!storedAddress) return {
            ok:false,
            message: "No se encontro una dirección"
        }
            
        await prisma.userAddress.delete({
            where:{
                id: storedAddress.id
            }
        });
        
        return {
            ok: true,
            message: "Eliminación completa"
        }
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo eliminar la dirección")
    }
}