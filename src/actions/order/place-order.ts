"use server"

import { auth } from "@/auth";
import { Size } from "@/interfaces";
import { Address } from "@/interfaces/address.interface";
import { prisma } from "@/lib/prisma";
import { OrderItem } from '../../generated/prisma/client';

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;

}

export const placeOrder = async ( productIds: ProductToOrder[], address: Address) => {

    const session = await auth();
    
    // verificar sesion de usuario
    const userId = session?.user.id;
    if(!userId) return {
                    ok: false,
                    message: 'No hay sessión de usuario',
                };


    // obtener la informacion de los productos
    // Nota: recuerden que podemos llevar 2+ productos con el mismo ID

    const products = await prisma.product.findMany({
        where:{
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    });

    
    // calcular los montos // encabezado

    const itemsInOrder = productIds.reduce ( (  count, p )=>  count + p.quantity , 0);

    // los totales de tax, subtotal y total

    const { subTotal,tax,total } = productIds.reduce((totals, item)=> {

        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId);
        
        if(!product) throw new Error(`${item.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return  totals;
    }, { subTotal: 0, tax:0 , total: 0})

    // crear la transaccion de bade de datos

    try {
        
        const prismaTx = await prisma.$transaction(async (tx) => {

            //1. Actualizar el stock de los productos
            const updatedProductsPromises = products.map((product) => {

                //acumular los valores
                const productQuantity = productIds.filter(
                                            p => p.productId === product.id
                                        ).reduce((acc, item) => item.quantity + acc, 0);
                
                if(productQuantity === 0){
                    throw new Error(`${product.id}, no tiene cantidad definida`);
                }

                return tx.product.update({
                    where: { id: product.id },
                    data : {
                        // inStock: product.inStock - productQuantity - no hacer

                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })

            });

            const updatedProducts = await Promise.all(updatedProductsPromises);

            // verificar valores negativos en la existencia = no hay stock
            updatedProducts.forEach( prod => {
                if(prod.inStock < 0) throw new Error(`${prod.title} no tiene inventario suficiente`);
            });
                    

            //2. Crear la orden - Encabezado - Detalles
            const order = await tx.order.create({
                data:{

                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,                

                    orderItems: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }

                }
            })

            // Validar, si el price es cero, entonces lanzar un error


            //3. Crear la dirección de la orden
            
            const orderAddress =  await tx.orderAddress.create({
                data: {
                    address: address.address,
                    city: address.city,
                    firstName: address.firstName,
                    lastName: address.lastName,
                    phone: address.phone,
                    postalCode: address.postalCode,
                    address2: address.address2,
                    countryId: address.country,
                    orderId: order.id                
                }
            })


            return {
                order: order,
                updatedProducts: updatedProducts,
                orderAddress: orderAddress,
            }

        });

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx,
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return {
            ok: false,
            message: error.message
        }
    }


    
    
}