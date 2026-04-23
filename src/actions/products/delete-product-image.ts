'use server';
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from "next/cache";

const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;

cloudinary.config({ 
    cloud_name: 'dq6bvexhh', 
    api_key: CLOUDINARY_KEY, 
    api_secret: CLOUDINARY_SECRET
});
    
export const deleteImageProduct = async (id: number, imageUrl: string)=>{

    if(!imageUrl.startsWith('http'))
        return {
            ok: false,
            message: 'No se puede borrar imagenes de FS'
        }

    try {
        const image = await prisma.productImage.findUnique({ where : { id }, 
            select: { 
                id: true,  
                productId: true,
                url: true,
                product: 
                    { 
                        select: 
                            { 
                                slug: true 
                            } 
                        } 
                }});
    
        if(!image) return;        

        const imageUrl = image?.url || '';
        const idImageCloudinary = imageUrl.split('/').pop()?.split('.')[0] ?? '';
        await cloudinary.uploader.destroy(idImageCloudinary);

        await prisma.productImage.delete({where: { id: image?.id }});

        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${image.product?.slug}`);
        revalidatePath(`/products/${image.product?.slug}`);

        return {
            ok: true,
            message: 'se elemino exitosamente'
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo eliminar la imagen'
        };
    }

}