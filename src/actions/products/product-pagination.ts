'use server'

import { Category } from "@/interfaces";
import { prisma } from "@/lib/prisma"
import { ValidTypes } from "@/seed/seed";

interface PaginationOptions {
    page?: number;
    take?: number;
    gender?: Category | null;
}

export const getPaginatedProductsWithImages = async ({ page = 1, take = 12, gender = null }:PaginationOptions) => {

    if(isNaN(Number(page)) || Number(page) < 1)page = 1;
    
    if(isNaN(Number(take))) take = 12;


    try {

        //1. Obtener los productos

        const products = await prisma.product.findMany({
            include: {
                ProductImage: {
                    take: 2,
                    select: {
                        url: true
                    }
                },
                category: {
                    select: {
                        name: true
                    }                
                }
            },
            take,
            skip: (page - 1) * take,
            ...(
                gender ? {
                    where: {
                        gender : gender
                    }
                } : {}
            )
            
        });

        //2. OBtener el total de paginas
        // todo:
        const totalCount = await prisma.product.count({
            ...(
                gender ? {
                    where: {
                        gender : gender
                    }
                } : {}
            )
        });
        const totalPages = Math.ceil(totalCount / take);

        return {
            currentPage: page,
            totalPages: totalPages,
            products: products.map(product => ({
                ...product,
                images: product.ProductImage.map(image => image.url),
                type: product.category.name.toLowerCase() as ValidTypes
            }))
        };
        
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new Error("No se pudo cargar los productos");
    }
}