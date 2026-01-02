import { notFound } from "next/navigation";
import { ProductGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";
import { Category } from "@/interfaces";

interface Props {
  params:{
    id:Category;
  }
}

export default async function CategoryPage({ params }:Props) {
  const {id} = await params;
  const availableCategories = ["men", "women", "kid"];
  const labels:Record<Category, string> = {
    "men": "para hombres",
    "women": "para mujeres",
    "kid": "para niños",
    "unisex": "para todos"
  }
  if(!availableCategories.includes(id)){
    notFound();
  }

  //products by seed
  const products = initialData.products.filter(product => product.gender == id);

  return (
    <>
      <Title title={`Articulos ${labels[id] || "Category"}`} className="mb-2"/>
      
      <ProductGrid products={products} />    
    </>
  );
}