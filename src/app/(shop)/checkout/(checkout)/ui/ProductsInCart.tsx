"use client"
import { useEffect, useState } from "react";
import { useCartStore } from "@/store";
import Image from "next/image";

import { currencyFormat } from "@/utils";

export const ProductsInCart = () => {

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
                <p><span>{product.size} - {product.title}</span> ({product.quantity})</p>
                <p className="font-bold">{currencyFormat(product.price * product.quantity)}</p>                
            </div>
            </div>
        ))}
        </>
    );
};
