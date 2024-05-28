'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/formatters'
import React from 'react'
import AddProducts, { UdateProducts } from '../../_actions/products'
import { useFormState, useFormStatus } from 'react-dom'
import { Product } from '@prisma/client'
import Image from 'next/image'


const ProductForm = ({product}:{product?:Product|null}) => {
  const [error, action] = useFormState(product ==null ?AddProducts:UdateProducts.bind(null,product.id),{})
    const [priceInCents, setPriceInCents] = React.useState<number|undefined>(product?.priceInCents)
  return (
    <form action={action}  className='space-y-8'>
      <div className=' space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input  type="text" id='name'
        defaultValue={product?.name} name='name' required/>
        {error.name&& <div className=' text-destructive'>{error.name}</div>}
      </div>
      <div className=' space-y-2'>
        <Label htmlFor='priceInCents'>Price In Cents</Label>
        <Input  type="priceInCents" 
        defaultValue={product?.priceInCents} id='priceInCents' name='priceInCents' required value={priceInCents} onChange={(e)=>setPriceInCents(Number(e.target.value)|| undefined)} / >
        {error.priceInCents&& <div className=' text-destructive'>{error.priceInCents}</div>}
      </div>
      <div className=' text-muted-foreground'>{formatCurrency((priceInCents||0)/100)}</div>
      <div className=' space-y-2'>
        <Label htmlFor='description'>description</Label>
        <Textarea id='description' defaultValue={product?.description} name='description' required  / >
        {error.description&& <div className=' text-destructive'>{error.description}</div>}
      </div>
      <div className=' space-y-2'>
        <Label htmlFor='file'>File</Label>
        <Input  type="file" id='file' name='file' required = {product == null}/>
        {product!=null&&(<div className=' text-muted-foreground'>{product.filePath}</div>)}
        {error.file&& <div className=' text-destructive'>{error.file}</div>}
      </div>
      <div className=' space-y-2'>
        <Label htmlFor='image'>Image</Label>
        <Input  type="file" id='image' name='image' required = {product ==null} />
        {product!=null&&<Image src={product.imagePath}  width={400} height={400} alt='product image'/>}
        {error.image&& <div className=' text-destructive'>{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
  )
}

export default ProductForm

function SubmitButton(){
  const {pending} = useFormStatus()
   return   <Button type='submit' disabled={pending}>{pending?"Saving...":"Save"}</Button>
     
}

function UpdateProduct(state: {}): {} | Promise<{}> {
  throw new Error('Function not implemented.')
}
