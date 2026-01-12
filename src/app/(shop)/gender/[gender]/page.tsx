export const revalidate = 60

import { notFound, redirect } from "next/navigation";
import { Pagination, ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";
import { getPaginatedProductsWithImages } from "@/actions";

interface Props{
  params:{
    gender: Category
  },
  searchParams: {
    page?: string;
    limit?: string;
  }
}

export default async function CategoryPage({ params, searchParams }:Props) {
  const { gender } = await params;
  const { page, limit } = await searchParams;
  
  const availableCategories = ["men", "women", "kid"];
  const labels:Record<Category, string> = {
    "men": "para hombres",
    "women": "para mujeres",
    "kid": "para niños",
    "unisex": "para todos"
  }
  if(!availableCategories.includes(gender)){
    notFound();
  }

  //products by seed
  const { products, totalPages } = await getPaginatedProductsWithImages({
      page: page ? parseInt(page) : 1,
      take: limit ? parseInt(limit) : 12,
      gender
    });
  
    if(products.length == 0 && !!page && +page > 0)
      redirect(`/gender/${gender}`);

    if(products.length == 0 && !!page && +page == 0)
        redirect(`/`);
    
  

  return (
    <>
      <Title title={`Articulos ${labels[gender] || "Category"}`} className="mb-2"/>
      
      <ProductGrid products={products} />
      
      <Pagination totalPages={totalPages}/>
    </>
  );
}