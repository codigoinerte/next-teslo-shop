"use client"
import { getStockBySlug } from '@/actions';
import { titleFont } from '@/config/fonts'
import { useEffect, useState } from 'react';

interface Props {
    slug:string;
}

export const StockLabel = ({ slug }:Props) => {

    const [stock, setStock] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const getStock = async () => {
        const inStock = await getStockBySlug(slug);
        setStock(inStock);
        setIsLoading(false);
    }

    useEffect(() => {
      
        getStock();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);
    
    return <h1 className={`${titleFont.className} w-fit antialiased font-bold text-sm ${isLoading ? 'animate-pulse bg-gray-300 text-transparent': ''}`}>Stock:{stock}</h1>;            
}
