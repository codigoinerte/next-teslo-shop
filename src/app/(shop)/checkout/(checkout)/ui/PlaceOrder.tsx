
"use client"
import { placeOrder } from "@/actions";
import { useCartStore } from "@/store";
import { useAddressStore } from "@/store/address/address-store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { size } from "zod";

export const PlaceOrder = () => {

    const [summaryInfo, setSummaryInfo] = useState({
        items: "",
        subtotal: "",
        tax: "",
        total: ""
    });

    const updateSummary = () => {
        const info = summary();
        setSummaryInfo({
            items: `${info.itemsInCart} artículo${info.itemsInCart>1?'s':''}`,
            subtotal: currencyFormat(info.subTotal),
            tax:currencyFormat(info.tax),
            total: currencyFormat(info.total)
        });
    }

    const route = useRouter();
    const [loaded, setLoaded] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const address = useAddressStore(state => state.address);

    const summary = useCartStore(store => store.getSummaryInformation);

    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state => state.clearCart);

    useEffect(() => {
        updateSummary();    
        setLoaded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onPlaceOrder = async () => {

        setIsPlacingOrder(true);
        
        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }));
        
        const respuesta = await placeOrder(productsToOrder, address);

        if(!respuesta.ok) {
            setIsPlacingOrder(false);
            setErrorMessage(respuesta.message);
            return;
        }

        //* todo salio bien

        clearCart();
        route.replace("/orders/" + respuesta.order?.id);
    }
    
    if(loaded) return <p>Cargando ...</p>

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">{address.firstName} {address.lastName}</p>
              <p className="font-bold">{address.address}</p>
                {
                    address.address2 && <p>{address.address2}</p>
                }
              <p>{address.city}</p>
              <p>CP. {address.postalCode}</p>
              <p>{address.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">{summaryInfo.items}</span>
            
            
                <span>Subtotal</span>
                <span className="text-right">{summaryInfo.subtotal}</span>
            
                <span>Impuestos (15%)</span>
                <span className="text-right">{summaryInfo.tax}</span>
            
                <span className="text-2xl mt-5">Total:</span>
                <span className="text-2xl mt-5 text-right">{summaryInfo.total}</span>
            </div>
            <div>
              {/* Disclaimer */}
              <p className="mb-5 mt-5">
                <span className="text-xs">
                  Al hacer clic en &apos;Colocar orden&apos;, aceptas nuestros <a href="#" className="underline">Términos y condiciones</a> y <a href="#" className="underline">Política de privacidad</a>.
                </span>
              </p>

                {
                    errorMessage && 
                    <p className="text-red-500">{errorMessage}</p>
                }

              <button 
                onClick={onPlaceOrder}
                className={clsx({
                    "btn-primary": !isPlacingOrder,
                    "btn-disable": isPlacingOrder,
                })}
                //   href={"/orders/123"}
                >Colocar orden</button>
            </div>

          </div>
    )
}
