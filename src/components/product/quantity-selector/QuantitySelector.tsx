"use client"
import { useEffect, useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
    quantity: number;
    onQuantityCHanged: (value:number) => void;
}

export const QuantitySelector = ({quantity, onQuantityCHanged}:Props) => {

    const onValueChanged = (value:number) => {
        if(quantity + value < 1) return;
        onQuantityCHanged(quantity + value);  
    }

    return (
        <div className="flex">
            <button className="cursor-pointer" onClick={()=> onValueChanged(-1)}>
                <IoRemoveCircleOutline />
            </button>
            <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded">
                {quantity}
            </span>
            <button className="cursor-pointer" onClick={()=> onValueChanged(+1)}>
                <IoAddCircleOutline />
            </button>
        </div>

    )
}
