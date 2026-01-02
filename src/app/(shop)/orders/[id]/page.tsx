import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
]

interface Props {
  params: {
    id:string;
  }
}

export default async function OrderPage({ params }:Props) {
  const { id } = await params;

  // Todo: verificar
  // Redirect(/)

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-250">
        <Title title={`Orden #${id}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">

            <div className={
              clsx("flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  'bg-green-500': true,
                  'bg-red-500': false
                }
              )
            }>
              <IoCartOutline size={30}/>
              {/* <span className="mx-2">Pendiente</span> */}
              <span className="mx-2">Pagada</span>
            </div>
          

          {/* Items del carrito */}
          {
            productsInCart.map((product) => (
              <div key={product.slug} className="flex mb-5">
                <Image 
                  src={`/products/${product.images[0]}`}
                  width={100}
                  height={100}
                  alt={product.title}
                  style={{
                    width:"100px",
                    height:"100px"
                  }}
                  className="mr-5 rounded object-fill"
                />

                <div>
                  <p>{product.title}</p>
                  <p>${product.price} x 3</p>
                  <p className="font-bold">Subtotal: ${product.price * 3}</p>                  
                </div>

              </div>
            ))
          }
          </div>

          {/* Checkout - Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">Fredy Martinez</p>
              <p className="font-bold">Av. Siempre viva 123</p>
              <p>Col. centro</p>
              <p>Alcaldía cuauhtémoc</p>
              <p>Ciudad de México</p>
              <p>CP. 123123123</p>
              <p>123.123.123</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2 mb-5">
              <span>No. Productos</span>
              <span className="text-right">3 artículos</span>
           
           
              <span>Subtotal</span>
              <span className="text-right">$ 100</span>
           
              <span>Impuestos (15%)</span>
              <span className="text-right">$ 100</span>
           
              <span className="text-2xl mt-5">Total:</span>
              <span className="text-2xl mt-5 text-right">$ 100</span>
            </div>
            <div>
              
              <div className={
              clsx("flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  'bg-green-500': true,
                  'bg-red-500': false
                }
              )
            }>
              <IoCartOutline size={30}/>
                {/* <span className="mx-2">Pendiente</span> */}
                <span className="mx-2">Pagada</span>
              </div>
              
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}