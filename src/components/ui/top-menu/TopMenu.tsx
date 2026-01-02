"use client"
import Link from 'next/link'
import { titleFont } from '@/config/fonts'
import { useUIStore } from '@/store'
import { IoSearchOutline, IoCartOutline } from 'react-icons/io5'


export const TopMenu = () => {
    const openMenu = useUIStore(state => state.openSideMenu);

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
                <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100 block' href={"/category/men"}>Hombres</Link>
                <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100 block' href={"/category/women"}>Mujeres</Link>
                <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100 block' href={"/category/kid"}>Niños</Link>
            </div>

            {/* Search cart Menu */}
            <div className='flex items-center flex-1 justify-end gap-3'>
                <Link href={"/search"}>
                    <IoSearchOutline className='w-5 h-5'/>
                </Link>

                <Link href={"/cart"}>
                    <div className='relative'>
                        <span className='absolute w-4 h-4 flex justify-center items-center text-xs rounded-full px-2 font-bold -top-2 -right-2 bg-blue-700 text-white'>
                            3
                        </span>
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
