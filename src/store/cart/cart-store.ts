import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State{
    cart: CartProduct[],

    getTotalItems : () => number;
    getSummaryInformation: () => {
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    }

    addProductToCart: (product: CartProduct) => void;
    updateProductQuantity:(product: CartProduct, quantity: number) => void;
    removeProduct:(product:CartProduct) => void;
};

export const useCartStore = create<State>()(
    
    persist(

            // logic of store cart
            (set, get) => ({
                cart: [],
                addProductToCart: (product: CartProduct) => {
                    const { cart } = get();
                            
                    //1. Revisar si el producto existe en el carrito con la talla seleccionada
                    const productInCart = cart.some(
                        (item) => (item.id === product.id && item.size === product.size)
                    );

                    if(!productInCart){
                        set({
                            cart: [...cart, product]
                        });
                        return;
                    }

                    //2. se que el producto existe por talla... tengo que incrementar/actualizar la cantidad

                    const updatedCartProducts = cart.map((item) => {
                        if(item.id === product.id && item.size === product.size){
                            return {
                                ...item,
                                quantity: item.quantity + product.quantity
                            }
                        }
                        return item;
                    });

                    set({
                        cart: updatedCartProducts
                    });

                },
                getTotalItems: () => {
                    const { cart } = get();

                    const totalItems = cart.reduce( (total, item) => total + item.quantity, 0 );

                    return totalItems;
                },
                updateProductQuantity: (product: CartProduct, newQuantity: number) => {
                    
                    const { cart } = get();

                    const updatedCartProducts = cart.map((item) => {
                        if(item.id === product.id && item.size === product.size){
                            return {
                                ...item,
                                quantity: newQuantity
                            }
                        }
                        return item;
                    });

                    set({
                        cart: updatedCartProducts
                    });


                },
                removeProduct:(product:CartProduct) => {
                    const { cart } = get();

                    console.log(cart);

                    const filteredProduct = cart.filter(
                        (item) => (item.id !== product.id || item.size !== product.size)
                    );

                    
                    set({
                        cart: filteredProduct
                    })
                },
                getSummaryInformation: () => {
                    const { cart } = get();

                    const subTotal = cart.reduce((subTotal, item) =>  subTotal + (item.quantity * item.price)  , 0);
                    const tax = subTotal * 0.15;
                    const total = subTotal + tax;
                    const itemsInCart = cart.reduce( (total, item) => total + item.quantity, 0 );

                    return {
                        subTotal,
                        tax,
                        total,
                        itemsInCart
                    }

                },
            })

        ,
        {
            name: "shopping-cart",
            
        }
    )


)