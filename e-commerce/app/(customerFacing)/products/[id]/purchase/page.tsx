import prisma from '@/db/db'
import { notFound } from 'next/navigation'
import React from 'react'
import Stripe from 'stripe'

const strip = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const page = async({params:{id}}:{params:{id:string}}) => {
    const product = await prisma.product.findUnique({
        where:{
            id
        }
    })
    if(product == null) return notFound()

      const paymentIntents = await strip.paymentIntents.create({
            amount:product.priceInCents,
            currency:"usd",
            metadata:{productId:product.id},
         
        
        })

        if( paymentIntents.client_secret==null){
            throw new Error("no client secret")
        }
  return <CheckOutForm  product = {product}
  clientSecret = {paymentIntents.client_secret}/>
}

export default page
