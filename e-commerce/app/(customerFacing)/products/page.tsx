import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard'
import prisma from '@/db/db'
import React, { Suspense } from 'react'

async function GetProducts(){
    return await  prisma.product.findMany({where:{isAvailableForPurchase:true},
    orderBy:{
        name:"asc"
    }})
}

const ProductsPage = () => {
  return (
    <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Suspense fallback={
                <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                </>
            }>
            <ProductsSuspence />
            </Suspense>
        </div>
  )
}

export default ProductsPage


async function ProductsSuspence(){
    const products =await GetProducts()
    return products.map(product =>(
        <ProductCard key={product.id} {...product}/>
       
    ))
}