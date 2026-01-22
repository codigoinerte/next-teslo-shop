"use client"
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store'
import { currencyFormat } from '@/utils';

export const OrderSummary = () => {

    const [summaryInfo, setSummaryInfo] = useState({
        items: "",
        subtotal: "",
        tax: "",
        total: ""

    })

    const [loaded, setLoaded] = useState(false);
    const cart = useCartStore(store => store.cart);
    const summary = useCartStore(store => store.getSummaryInformation);
    

    useEffect(() => {
      
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoaded(true);
    }, [])

    const updateSummary = () => {
        const info = summary();
        setSummaryInfo({
            items: `${info.itemsInCart} artículo${info.itemsInCart>1?'s':''}`,
            subtotal: currencyFormat(info.subTotal),
            tax:currencyFormat(info.tax),
            total: currencyFormat(info.total)
        });
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        updateSummary();
        
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart])
    
    

    if(!loaded) return <p>Loading...</p>;
    
    
    return (
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
    )
}
