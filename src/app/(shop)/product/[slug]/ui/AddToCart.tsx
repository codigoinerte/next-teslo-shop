"use client";
import { QuantitySelector, SizeSelector } from "@/components";
import type { Size, Product, CartProduct } from "@/interfaces";
import { useCartStore } from "@/store";
import { useState } from "react";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {

  const addProductToCart = useCartStore(state => state.addProductToCart);

  const [posted, setPosted] = useState(false);

  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);

  const addToCart = () => {
    setPosted(true);

    if (!size) return;
    if (quantity < 1) return;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      image: product.images[0] ?? ''
    }

    addProductToCart(cartProduct);

    setPosted(false);
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      {posted && !size && (
        <span className="mt-2 text-red-500 text-sm fade-in">
          Debe de seleccionar una talla*
        </span>
      )}

      {/* Selector de tallas */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChanged={setSize}
      />

      {/* Selector de cantidad */}
      <QuantitySelector quantity={quantity} onQuantityCHanged={setQuantity} />

      {/* Buton */}
      <button className="btn-primary my-5 cursor-pointer" onClick={addToCart}>
        Agregar al carrito
      </button>
    </>
  );
};
