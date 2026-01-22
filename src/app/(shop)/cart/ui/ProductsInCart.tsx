"use client"
import { useEffect, useState } from "react";
import { QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";

export const ProductsInCart = () => {

    const updateCartQuantity = useCartStore(store => store.updateProductQuantity);

    const removeProduct = useCartStore(store => store.removeProduct);

    const [loaded, setLoaded] = useState(false);

    const productsIncart = useCartStore(state => state.cart);

    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoaded(true);
    }, [])
    

    if(!loaded) {
        return <p>Loading...</p>
    }

    return (
        <>
        {productsIncart.map((product) => (
            <div key={`${product.slug}-${product.size}`} className="flex mb-5">
            <Image
                src={`/products/${product.image}`}
                width={100}
                height={100}
                alt={product.title}
                style={{
                width: "100px",
                height: "100px",
                }}
                className="mr-5 rounded object-fill"
            />

            <div>
                <p><Link className="hover:underline cursor-pointer" href={`/product/${product.slug}`}>{product.size} - {product.title}</Link></p>
                <p>${product.price}</p>
                <QuantitySelector 
                    quantity={product.quantity} 
                    onQuantityCHanged={(quantity)=>{
                        updateCartQuantity(product, quantity)
                    }}
                />

                <button 
                    className="underline mt-3"
                    onClick={()=> removeProduct(product) }>Remover</button>
            </div>
            </div>
        ))}
        </>
    );
};
