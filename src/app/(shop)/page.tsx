export const revalidate = 60

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: string;
    limit?: string;
  }
}

export default async function Home({searchParams}:Props) {

  const {page, limit} = await searchParams;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: page ? parseInt(page) : 1,
    take: limit ? parseInt(limit) : 12,
  });

  if(products.length == 0)
      redirect('/');

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2"/>

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages}/>

    </>
  );
}
