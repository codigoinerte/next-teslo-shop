"use server"
import { prisma } from "@/lib/prisma";
import { sleep } from "@/utils";

export const getStockBySlug = async(slug:string) => {
    try {
        await sleep(2);

        const stock = await prisma.product.findUnique({
            select: {
                inStock: true
            },
            where: {
                slug
            }
        });

        if(!stock) return 0;

        return stock.inStock;

    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener stock por slug");    
    }
}