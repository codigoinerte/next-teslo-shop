"use client";

import { Product, ProductImage as ProductImageInterface } from "@/interfaces";
import { Category } from "@/interfaces/category.interface";

import { useForm } from "react-hook-form";
import clsx from "clsx";
import { createUpdateProduct } from "@/actions";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components/product/product-image/ProductImage";
import { deleteImageProduct } from "@/actions/products/delete-product-image";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductImageInterface[]};
  categories: Category[]
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
    title: string;
    slug: string;
    description: string;
    price: number;
    inStock: number;
    sizes: string [];
    tags: string; // camisa, t-shirt
    gender: 'men' | 'women' | 'kid' | 'unisex';
    categoryId: string;

    images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {

    const router = useRouter();
    const { 
        handleSubmit,
        register,
        formState: {  },
        getValues,
        setValue,
        watch
    } = useForm<FormInputs>({
        defaultValues: {
            ...product,
            tags: product.tags?.join(","),
            sizes: product.sizes ?? [],

            images: undefined,
        }
    });

    const sizes_selected = watch("sizes");

    const onSizeChanged = (size: string) => {
        const sizes = new Set(getValues("sizes"));
        sizes.has(size) ? sizes.delete(size) : sizes.add(size);
        // const newValues = sizes.includes(size) ? sizes.filter(s => s != size) : [...sizes, size];        
        setValue("sizes", Array.from(sizes));
    }

    const onSubmit = async (data:FormInputs) => {
        const formData = new FormData();

        const { images, ...productToSave} = data;
        
        if(product.id){
            formData.append('id', product.id ?? '');
        }

        formData.append('title', productToSave.title ?? '');
        formData.append('slug', productToSave.slug ?? '');
        formData.append('description', productToSave.description ?? '');
        formData.append('price', productToSave.price.toString());
        formData.append('inStock', productToSave.inStock.toString());
        formData.append('sizes', productToSave.sizes.toString());
        formData.append('tags', productToSave.tags);
        formData.append('categoryId', productToSave.categoryId);
        formData.append('gender', productToSave.gender);

        if(images){
            for(let i = 0 ; i < images.length ; i++){
                formData.append('images', images[i]);
            }
        }

        const { ok, product: productResponse } = await createUpdateProduct(formData);
        console.log(ok);

        if(!ok) alert('Producto no se pudo actualizar');

        router.replace(`/admin/product/${productResponse?.slug}`)
    }

    return (
        <form className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3" onSubmit={handleSubmit(onSubmit)}>
            {/* Textos */}
            <div className="w-full">
                <div className="flex flex-col mb-2">
                <span>Título</span>
                <input type="text" className="p-2 border rounded-md bg-gray-200" {...register("title", { required: true })}/>
                </div>

                <div className="flex flex-col mb-2">
                <span>Slug</span>
                <input type="text" className="p-2 border rounded-md bg-gray-200"  {...register("slug", { required: true })} />
                </div>

                <div className="flex flex-col mb-2">
                <span>Descripción</span>
                <textarea
                    rows={5}
                    className="p-2 border rounded-md bg-gray-200"
                     {...register("description", { required: true })}
                ></textarea>
                </div>

                <div className="flex flex-col mb-2">
                <span>Price</span>
                <input type="number" className="p-2 border rounded-md bg-gray-200"  {...register("price", { required: true, min: 0 })}/>
                </div>

                <div className="flex flex-col mb-2">
                <span>Tags</span>
                <input type="text" className="p-2 border rounded-md bg-gray-200"  {...register("tags", { required: true })}/>
                </div>

                <div className="flex flex-col mb-2">
                <span>Gender</span>
                <select className="p-2 border rounded-md bg-gray-200"  {...register("gender", { required: true })}>
                    <option value="">[Seleccione]</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kid">Kid</option>
                    <option value="unisex">Unisex</option>
                </select>
                </div>

                <div className="flex flex-col mb-2">
                <span>Categoria</span>
                <select className="p-2 border rounded-md bg-gray-200"  {...register("categoryId", { required: true })}>
                    <option value="">[Seleccione]</option>
                    {
                        categories.map(category => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))
                    }
                </select>
                </div>

                <button type="submit" className="btn-primary w-full cursor-pointer"
                //  disabled={!isValid}
                 >
                Guardar
                </button>
            </div>

            {/* Selector de tallas y fotos */}
            <div className="w-full">

                <div className="flex flex-col mb-2">
                <span>Inventario</span>
                <input type="number" className="p-2 border rounded-md bg-gray-200"  {...register("inStock", { required: true, min: 0 })}/>
                </div>

                {/* As checkboxes */}
                <div className="flex flex-col">

                <span>Tallas</span>
                <div className="flex flex-wrap">
                    
                    {
                    sizes.map( size => (
                        //  <--- si está seleccionado
                        <div 
                            key={ size } 
                            onClick={()=> onSizeChanged(size)}
                            className={clsx("flex items-center justify-center w-10 h-10 mr-2 border rounded-md transition-all text-center cursor-pointer", {
                                "bg-blue-500 text-white": sizes_selected.includes(size),
                            })}>
                        <span>{ size }</span>
                        </div>
                    ))
                    }

                </div>


                <div className="flex flex-col mb-2">

                    <span>Fotos</span>
                    <input 
                        {...register('images')}
                        type="file"
                        multiple 
                        className="p-2 border rounded-md bg-gray-200" 
                        accept="image/png, image/jpeg, image/avif"
                    />

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {
                        product.ProductImage?.map((image) => (

                            <div key={image.id}>
                                <ProductImage
                                    alt={product.title ?? ''}
                                    src={image.url}
                                    width={300}
                                    height={300}
                                    className="rounded-t-xl shadow-md w-full"
                                />
                                <button 
                                    type="button"
                                    onClick={async ()=> await deleteImageProduct(image.id, image.url) }
                                    className="btn-danger rounded-t-none! rounded-b-xl! w-full cursor-pointer">Eliminar</button>
                            </div>
                        ))
                    }

                </div>

                </div>
            </div>
        </form>
    );
};