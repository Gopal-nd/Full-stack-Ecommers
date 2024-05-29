import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import prisma from '@/db/db'
import { Product } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense } from 'react'

async function GetMostPopularProducts(){

    return await prisma.product.findMany({where:{
        isAvailableForPurchase:true
    },orderBy:{
        orders:{
            _count:"desc"
        
        },
        
    },
    take:6
})
}
async function GetNewProducts(){
  
    return await  prisma.product.findMany({where:{
        isAvailableForPurchase:true
    },orderBy:{
       createdAt:"desc"
        
    },
    take:6
})
}


function wait(duration :number){
    return new Promise((resolve) => setTimeout(resolve, duration) )
}


const page = () => {
  return (
<main className=' space-y-12'>
<ProductGridSection productsFetcher = {GetMostPopularProducts} title="Most Popular"/>
<ProductGridSection productsFetcher = {GetNewProducts} title="Newest"/>
</main>
  )
}

export default page

type productFetchersectionProps= {
    title:string
    productsFetcher:()=>Promise<Product[]>
}

function ProductGridSection({productsFetcher,title}:productFetchersectionProps){
return(
    <>
    <div className='space-y-4'>
        <div className='flex gap-4'>
            <h2 className='text-3xl font-bold'>{title}</h2>
            <Button variant={'outline'} asChild>
                <Link href={'/products'} className='space-x-2'>
                    <span>View All</span>
                    <ArrowRight className='size-4'/>
                </Link>
            </Button>
        </div>
        <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Suspense fallback={
                <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                </>
            }>
            <ProductSuspence productsFetcher={productsFetcher}/>
            </Suspense>
        </div>
    </div>
    </>
)
}

async function ProductSuspence({productsFetcher,}:{productsFetcher:()=>Promise<Product[]>}){
   return (await productsFetcher()).map(product =>(
        <ProductCard key={product.id} {...product}/>
       
    ))
}