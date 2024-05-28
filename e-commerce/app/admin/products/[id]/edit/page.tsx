import PageHeader from "@/app/admin/_componets/PageHeader"
import ProductForm from "../../_components/ProductForm"
import prisma from "@/db/db"

const EditPage = async({params:{id}}:{
    params:{id:string}
}) => {
    const product = await prisma.product.findUnique({
        where:{
            id:id
        }
    })
  return (
    <>
    <PageHeader> Edit Product</PageHeader>
      <ProductForm  product={product}/>
    </>
  )
}

export default EditPage
