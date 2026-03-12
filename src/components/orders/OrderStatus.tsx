import clsx from 'clsx'
import React from 'react'
import { IoCartOutline } from 'react-icons/io5'

interface Props {
    isPaid: boolean;
}

export const OrderStatus = ({ isPaid }:Props) => {
    return (
        <div className={
        clsx("flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
            {
            'bg-green-500': isPaid,
            'bg-red-500': !isPaid
            }
        )
        }>
        <IoCartOutline size={30}/>
        {
            isPaid 
            ? <span className="mx-2">Pagada</span>
            : <span className="mx-2">Pendiente</span>
        }
        </div>
    )
}
