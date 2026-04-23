'use server'

import { Product } from '@/generated/prisma/client';
import { Gender, Size } from '@/generated/prisma/enums';
// import { Size } from '@/interfaces';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;

cloudinary.config({ 
    cloud_name: 'dq6bvexhh', 
    api_key: CLOUDINARY_KEY, 
    api_secret: CLOUDINARY_SECRET
});
    

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce
                .number()
                .min(0)
                .transform( val => Number(val.toFixed(2))),
    inStock: z.coerce
                .number()
                .min(0)
                .transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender),

})

export const createUpdateProduct = async( formData: FormData) => {
    

    const data = Object.fromEntries(formData);
    const productParsed = productSchema.safeParse(data);

    if(!productParsed.success){
        console.log(productParsed.error);
        return {
            ok: false,
        }
    }

    const product = productParsed.data;

    product.slug = product.slug.toLocaleLowerCase().replace(/ /g, '-').trim();

    const { id, ...rest } = product;

    try {
        
        const primsaTx = await prisma.$transaction(async(tx)=>{
    
            let product: Product;
    
            const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase());
    
            if(id){
                //actualizar
                product = await tx.product.update({
                    where: {  id },
                    data: {
                        ...rest,
                        sizes: { 
                            set: rest.sizes as Size[]
                        },
                        tags:  tagsArray
                    },
                });
    
                // console.log({ updatedProduct: product });
    
            }else {
                //crear
                product = await tx.product.create({
                    data: {
                        ...rest,
                        sizes: { 
                            set: rest.sizes as Size[]
                        },
                        tags:  tagsArray
                    }
                });
    
                // console.log({ productCreated: product});
            }

            // proceso de carga y guardado de imagenes

            // Recorrer las imagenes y guardarlas

            if(formData.getAll('images')){
               const images = await uploadImages(formData.getAll('images') as File[]);
               if(images.length ==  0){
                    throw new Error('No se pudo cargar las imagenes, rollingback');
               }
               await tx.productImage.createMany({
                 data: images.map(img => ({ 
                    url: img,
                    productId: product.id
                 }))
               });

            }
    
            return {
                product
            }
        });

        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${product.slug}`);
        revalidatePath(`/products/${product.slug}`);

        return {
            ok: true,
            product: primsaTx.product
        }

    } catch {
        return {
            ok: false,
            message: 'Revisar los logs no se pudo actualizar/crear'
        }
    }

}

const uploadImages = async (files: File[]) => {
    const promises = files.map(async (file:File)=> {
        const buffer = Buffer.from(await file.arrayBuffer());
        return new Promise<UploadApiResponse>(async (resolve, reject)=> {
            await cloudinary.uploader.upload_stream(
                { resource_type : 'image', format: 'webp'},
                (error, result) => {
                    if(error) reject(error);
                    else resolve(result!);
                }
            ).end(buffer);
        })
    })

    try {
        const responses = await Promise.all(promises);
        return responses.map(item => item.secure_url);
        
    } catch (error) {
        console.log(error);
        return []
    }
}
