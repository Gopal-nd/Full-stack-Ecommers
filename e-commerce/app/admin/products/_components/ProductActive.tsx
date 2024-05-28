'use client'
import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import React, { startTransition, useTransition } from 'react'
import { DeleteProduct, toggleProductAvailibility } from '../../_actions/products'
import { useRouter } from 'next/navigation'


export const ActiveproductToggel = ({id,isAvailableForPurchase}:{id:string,isAvailableForPurchase:boolean}) => {
    const router = useRouter()
    
    const [isPending,startTransition ] = useTransition()
  return (
  <DropdownMenuItem disabled={isPending} onClick={()=>startTransition(async()=>{
  
    await toggleProductAvailibility(id, !isAvailableForPurchase)
    router.refresh()
  })}>{
    isAvailableForPurchase? "Deactivate":"Activate"
  }

  </DropdownMenuItem>
  )
}


export function DeleteDropdownItem({id,disabled,}:{id:string,disabled:boolean}) {
    const [isPending,startTransition ] = useTransition()
    const router = useRouter()
  return (
    <DropdownMenuItem disabled={disabled|| isPending} onClick={()=>{startTransition(async()=>{
        await DeleteProduct(id)})
        router.refresh() }}>Delete

    </DropdownMenuItem>
  )
}

