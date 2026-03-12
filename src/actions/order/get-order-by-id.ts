"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getOrderById = async (id: string) => {

    const session = await auth();
    if(!session?.user){
        return {
            ok:false,
            message: "Debe estar autenticado",
        }
    }

    try {
        
        const productsByOrder = await prisma.orderItem.findMany({
            include:{
                product: {
                    include: {
                        ProductImage: {
                            take: 1,
                            select: {
                                url: true
                            }
                        }
                    }
                }
            },
            where:{
                orderId: id
            }
        });

        

        const productFormatted = productsByOrder.map(({product, orderId, id, productId, ...orderItem}) => ({
            ...orderItem,
            slug: product.slug,
            title: product.title,
            image: product.ProductImage[0].url ?? '',
        }));

        // console.log(productFormatted);

        const addressByOrder = await prisma.orderAddress.findUnique({
            include:{
                country:{
                    select:{
                        name: true,
                    }
                }
            },
            where: {
                orderId: id
            }
        });

        const summaryOrder = await prisma.order.findUnique({
            where: {
                id: id
            }
        })

        if(!summaryOrder) throw `${id} no existe`;

        if(session.user.role === 'user') {
            if(session.user.id !== summaryOrder.userId){
                throw `${id} no es de ese usuario`;
            }
        }
      
        return {
            ok: true,
            body: {
                productsByOrder: productFormatted,
                address : addressByOrder,
                suymmary: summaryOrder,
            }
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return {
            ok: false,
            message: `Hubo un error ${error}`
        }
    }
}