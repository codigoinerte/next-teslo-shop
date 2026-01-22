export const revalidate = 604800; // 7 dias

import { getProductBySlug } from "@/actions";
import { ProductMobileSlideshow, ProductSlideShow, QuantitySelector, SizeSelector, StockLabel } from "@/components";
import { titleFont } from "@/config/fonts";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from './ui/AddToCart';
import { Product } from "@/interfaces";

interface Props {
  params :{
    slug:string;
  }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
  ): Promise<Metadata> {
  const slug = (await params).slug
 
  // fetch post information
  const product = await getProductBySlug(slug);
 
  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph:{
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      // images: [],
      images:[`/products/${product?.images[1]}`],
    }
  }
}

export default async function ProductPage({params}:Props) {

  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if(!product){
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* slideshow */}
      <div className="col-span-1 md:col-span-2">
        {/* Desktop slideshow */}
        <ProductSlideShow 
          images={product.images}
          title={product.title}
          className="hidden md:block"
        />
        {/* Mobile slideshow */}
        <ProductMobileSlideshow
          images={product.images}
          title={product.title}
          className="block md:hidden"
        />
      </div>

      {/* detalles */}
      <div className="col-span-1 px-5">
        <StockLabel slug={slug} />
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>{product.title}</h1>
        <p className="text-lg mb-5">${product.price}</p>

        <AddToCart product={product} />

        {/* descripcion */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">
          {product.description}
        </p>
      </div>
      
    </div>
  );
}