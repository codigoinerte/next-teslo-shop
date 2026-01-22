"use server"

import { prisma } from "@/lib/prisma";
import { ValidTypes } from "@/seed/seed";

export const getProductBySlug = async (slug:string) => {
    try {
        
        const product = await prisma.product.findFirst({
            include:{
                ProductImage: {
                    select:{
                        url: true
                    }
                },
                category: {
                    select: {
                        name: true
                    }                
                }
            },
            where:{
                slug: slug
            }
        });

        if(!product) return null;

        return {
            ...product,
            images: product.ProductImage.map(image => image.url),
            type: product.category.name.toLowerCase() as ValidTypes
        }

    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener producto por slug");    
    }
}