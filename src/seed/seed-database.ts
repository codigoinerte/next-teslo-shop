import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { initialData } from "./seed";
import { countries } from "./seed-countries";


const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main(){

    // Borrar registros previos 
    await prisma.userAddress.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();

    const { categories, products, users} = initialData;

    await prisma.user.createMany({
        data:users
    });

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

    // productos - usar Promise.all en lugar de forEach
    await Promise.all(
        products.map(async (product) => {
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
    );

    //countries
    await prisma.country.createMany({
        data: countries
    });

    console.log('Seed ejecutado correctamente');
}

(async () => {

    if(process.env.NODE_ENV === 'production') return;

    await main();
    await prisma.$disconnect();
})();