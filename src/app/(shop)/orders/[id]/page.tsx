import { getOrderById } from "@/actions/order/get-order-by-id";
import { OrderStatus, PaypalButton, Title } from "@/components";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Image from "next/image";

import { redirect } from "next/navigation";
import { IoCartOutline } from "react-icons/io5";

interface Props {
  params: {
    id:string;
  }
}

export default async function OrderPage({ params }:Props) {
  const { id } = await params;

  const response = await getOrderById(id);

  if(response.ok === false) redirect("/");

  // Todo llamar el server action
  // Todo: verificar
  
  const { productsByOrder, address, suymmary } = response.body!;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-250">
        <Title title={`Orden #${id.split("-").at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">

          <OrderStatus isPaid={suymmary.isPaid}  />
          

          {/* Items del carrito */}
          {
            productsByOrder.map((product) => (
              <div key={`${product.slug}-${product.size}`} className="flex mb-5">
                <Image 
                  src={`/products/${product.image}`}
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
                  <p>{product.size} - {product.title}</p>
                  <p>${product.price} x ${product.quantity}</p>
                  <p className="font-bold">Subtotal: ${product.price * product.quantity}</p>                  
                </div>

              </div>
            ))
          }
          </div>

          {/* Checkout - Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">{address?.firstName} {address?.lastName}</p>
              <p className="font-bold">{address?.address}</p>
              {
                address?.address2 && <p>{address?.address2}</p>
              }
              <p>{address?.city}</p>
              <p>CP. {address?.postalCode}</p>
              <p>{address?.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2 mb-5">
              <span>No. Productos</span>
              <span className="text-right">{suymmary?.itemsInOrder} artículo{suymmary.itemsInOrder > 1 ? 's' : ''}</span>
           
           
              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(suymmary?.subTotal ?? 0)}</span>
           
              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(suymmary?.tax ?? 0)}</span>
           
              <span className="text-2xl mt-5">Total:</span>
              <span className="text-2xl mt-5 text-right">{currencyFormat(suymmary?.total ?? 0)}</span>
            </div>
            <div>
              
              {
                suymmary.isPaid 
                ? <OrderStatus isPaid={suymmary.isPaid}  />
                : <PaypalButton orderId={id} />
              }
              
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}