"use client"
import Link from 'next/link'
import { titleFont } from '@/config/fonts'
import { useCartStore, useUIStore } from '@/store'
import { IoSearchOutline, IoCartOutline } from 'react-icons/io5'
import { useEffect, useState } from 'react'


export const TopMenu = () => {
    const totalItemsInCart = useCartStore(state => state.getTotalItems());
    const openMenu = useUIStore(state => state.openSideMenu);

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoaded(true);

    }, [])
    

    return (
        <nav className='flex flex-row justify-between items-center w-full px-5'>
            {/* Logo */}
            <div className='flex-1'>
                <Link href={"/"}>
                    <span className={`${titleFont.className} antialiased font-bold`}>Testlo</span>
                    <span> | Shop</span>
                </Link>
            </div>

            {/* Center Menu */}
            <div className='hidden sm:flex justify-between items-center flex-1'>
                <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100 block' href={"/gender/men"}>Hombres</Link>
                <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100 block' href={"/gender/women"}>Mujeres</Link>
                <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100 block' href={"/gender/kid"}>Niños</Link>
            </div>

            {/* Search cart Menu */}
            <div className='flex items-center flex-1 justify-end gap-3'>
                <Link href={"/search"}>
                    <IoSearchOutline className='w-5 h-5'/>
                </Link>

                <Link href={
                    (totalItemsInCart === 0 && loaded)
                    ? "/empty"
                    : "/cart"
                    }>
                    <div className='relative'>
                        {
                            loaded && (totalItemsInCart > 0) && (
                                <span className='fade-in absolute w-4 h-4 flex justify-center items-center text-xs rounded-full px-2 font-bold -top-2 -right-2 bg-blue-700 text-white'>
                                    {totalItemsInCart}
                                </span>
                            )
                        }
                        <IoCartOutline className='w-5 h-5' />
                    </div>
                </Link>

                <button className='m-2 p-2 rounded-md transition-all hover:bg-gray-100 cursor-pointer' onClick={openMenu}>
                    Menú
                </button>
            </div>

        </nav>
    )
}
