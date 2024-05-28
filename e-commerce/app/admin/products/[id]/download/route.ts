import prisma from "@/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { headers } from "next/headers";

export async function GET(req:NextRequest,{params:{id}}:{params:{id:string}}){
const product = await prisma.product.findUnique({
    where:{id},
    select:{
        filePath:true,
        name:true
    }
})

if(product == null )return notFound()

    const {size} = await fs.stat(product.filePath)
    const file = await fs.readFile(product.filePath)
    const extenstion = product.filePath.split('.').pop()

    return new NextResponse(file
        ,{
            headers:{
                "content-Disposition":`attachment; filename=${product.name}.${extenstion}`,
                "content-Length":size.toString()
            }
        
    })
}