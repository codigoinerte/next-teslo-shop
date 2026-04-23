import { getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";
import { getCategories } from "@/actions/categories/getCategories";

interface Props {
    params: {
        slug:string;
    }
}
export default async function ProductPage({ params }:Props) {

    const { slug } = await params;

    const [ product, categories ] = await  Promise.all([
                                                getProductBySlug(slug),
                                                getCategories()
                                            ]);

    const categoryFromatted = categories.map(category => ({
                                    label: category.name.toString(),
                                    value: category.id.toString(),
                                }));

    //TODO:  new
    if(!product && slug !== 'new') redirect("/admin/products");

    const title = slug === 'new' ? 'Nuevo producto' : 'Editar producto';

    return (
        <>
            <Title title={title} />

            <ProductForm product={product ?? {}} categories={categoryFromatted}/>
        </>
    );
}