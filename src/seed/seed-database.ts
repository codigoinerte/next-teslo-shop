import { prisma } from "../lib/prisma";
import { initialData } from "./seed";


async function main(){

    // Borrar registros previos    
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    const { categories, products} = initialData;

    // Categorias
    const categoriesData = categories.map(category => ({
        name: category
    }));
    
    await prisma.category.createMany({
        data: categoriesData
    });

    const categoriesDB = await prisma.category.findMany();
    
    const catgoriesMap = categoriesDB.reduce((map, category) => {

        map[category.name.toLowerCase()] = category.id;

        return map;
    }, {} as Record<string, string>); // <string = shirt, string = categoryID>

    // productos
    products.forEach(async (product)=> {
        const { type, images, ...rest} = product;
        const dbProduct = await prisma.product.create({
            data:{
                ...rest,
                categoryId: catgoriesMap[type],

            }
        });

        //Imagenes
        const imagesData = images.map(image => ({
            url:image,
            productId: dbProduct.id
        }));

        await prisma.productImage.createMany({
            data: imagesData
        });
    })

    console.log('Seed ejecutado correctamente');
}

(()=>{

    if(process.env.NODE_ENV === 'production') return;

    main();
})();