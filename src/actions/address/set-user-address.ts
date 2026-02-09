"use server"

import { Address } from "@/interfaces/address.interface";
import { prisma } from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId:string) => {
    try {

        const newAddress = await createOrReplaceAddress(address, userId);
        return  {
            ok: true,
            address: newAddress
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok:false,
            message: "No se pudo grabar la dirección"
        }
    }
}

const createOrReplaceAddress = async (address: Address, userId: string) => {
    try {
        const storedAddres = await prisma.userAddress.findUnique({
            where:{
                userId
            }
        });

        const addressToSave = {
                                address: address.address,
                                address2: address.address2,
                                countryId: address.country,
                                firstName: address.firstName,
                                lastName: address.lastName,
                                phone: address.phone,
                                postalCode: address.postalCode,
                                userId: userId,
                                city: address.city,
                            };

        if(!storedAddres) {
            const newAddress = await prisma.userAddress.create({
                data: addressToSave
            });
            return newAddress;
        }

        const updatedAddress = await prisma.userAddress.update({
            where: {
                id: storedAddres.id
            },
            data: addressToSave
        });

        return updatedAddress;


    } catch (error) {
        console.log(error);
        throw new Error("No se pudo grabar la dirección")
    }
}