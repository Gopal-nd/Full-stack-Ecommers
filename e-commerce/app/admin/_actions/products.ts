// 'use server'
// import prisma from '@/db/db'
// import {z} from 'zod'
// import fs from 'fs/promises'
// import { redirect } from 'next/navigation'

// const fileSchema = z.instanceof(File,{message:"Required"})
// const ImageSchema = fileSchema.refine((file) => file.type.startsWith('image/'))
// const addschema = z.object({
//     name:z.string().min(1),
//     description:z.string().min(1),
//     priceInCents:z.coerce.number().int().min(1),
//     file:fileSchema.refine((file) => file.size>0,"requirted"),
//     image:ImageSchema.refine((file) => file.size>0, "requirted"),
// })
// const AddProducts = async(formData :FormData) => {
//     const result = addschema.safeParse(Object.fromEntries(formData.entries()))
//     if(result.success === false){
//         return result.error.formErrors.fieldErrors
//     }
//     const data = result.data
//   console.log(data)

//   await fs.mkdir('products',{recursive:true})
//   const filePath = `products/${crypto.randomUUID}-${data.file.name}`
// await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
 

//   await fs.mkdir('public/products',{recursive:true})
//   const imagePath = `/products/${crypto.randomUUID}-${data.image.name}`
// await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
 

// await prisma.product.create({
//     data:{
//         name:data.name,
//         description:data.description,
//         priceInCents:data.priceInCents,
//         filePath,
//         imagePath
//     }
//   })

//   redirect("/admin/products")
// }

// export default AddProducts
'use server';
import prisma from '@/db/db';
import { z } from 'zod';
import fs from 'fs/promises';
import { notFound, redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid'; // Use uuid package for generating UUID

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine((file) => file.type.startsWith('image/'), {
  message: "File must be an image",
});
const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, { message: "Required" }),
  image: imageSchema.refine((file) => file.size > 0, { message: "Required" }),
});

const AddProducts = async (prevState:unknown, formData: FormData) => {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  console.log(data);

  await fs.mkdir('products', { recursive: true });
  const fileUUID = uuidv4(); // Generate UUID
  const filePath = `products/${fileUUID}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  await fs.mkdir('public/products', { recursive: true });
  const imageUUID = uuidv4(); // Generate UUID
  const imagePath = `/products/${imageUUID}-${data.image.name}`;
  await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));

  await prisma.product.create({
    data: {
      isAvailableForPurchase:false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });

  redirect("/admin/products");
};
const editSchema = addSchema.extend({
  file:fileSchema.optional(),
  image:imageSchema.optional()
})

export const UdateProducts = async (id:string, prevState:unknown, formData: FormData) => {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  // console.log(data);
  const product = await prisma.product.findUnique({
    where:{
      id
    }
  })

  if(product==null) return notFound()
let filePath = product.filePath
    if(data.file!=null && data.file.size>0){
      await fs.unlink(product.filePath)
      const fileUUID = uuidv4(); // Generate UUID
       filePath = `products/${fileUUID}-${data.file.name}`;
      await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
    
    }
let imagePath = product.imagePath
    if(data.image!=null && data.image.size>0){
      await fs.unlink(`public${product.imagePath}`)
      const imageUUID = uuidv4(); // Generate UUID
  imagePath = `/products/${imageUUID}-${data.image.name}`;
  await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));

    }

 
 
 
  await prisma.product.update({
    where:{
      id
    },
    data: {
   
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });

  redirect("/admin/products");
};

export default AddProducts;

export async function toggleProductAvailibility(id:string,isAvailableForPurchase:boolean){
  if (!id || isAvailableForPurchase === undefined) {
    throw new Error('Invalid arguments: id and isAvailableForPurchase are required');
  }
  await prisma.product.update({
    where:{
      id
    },
    data:{
      isAvailableForPurchase
    }
  })
}

export async function DeleteProduct(id:string){
 const product =  await prisma.product.delete({
    where:{
      id
    }
  })
  if(product==null) return notFound()

    await fs.unlink(product.filePath)
    await fs.unlink(`public${product.imagePath}`)
}