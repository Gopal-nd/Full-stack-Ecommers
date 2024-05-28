import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

import React from "react";
async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: { priceInCents: true },
    _count: true,
  });

  return {
    amount: (data._sum.priceInCents || 0) / 100,
    numberofSales: data._count,
  };
}

async function getUserdata(){

   const userCount = await prisma.user.count()
   const orderData = await prisma.order.aggregate({
      _sum: { priceInCents: true },
   
    })
  
  
  return {
    userCount,
    averageValuePerUser:userCount===0 ? 0 : (orderData._sum.priceInCents || 0)/ userCount/100
  }
}

async function getProductData() {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
   const activeCount = await prisma.product.count({where:{isAvailableForPurchase:true}})
   const inActiveCount = await prisma.product.count({where:{isAvailableForPurchase:false}})

   return{
    activeCount,
    inActiveCount
   
   }
}

const page = async() => {
  const salesData = await getSalesData()
  const usersData = await getUserdata()
  const productData = await getProductData()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashbordCard
        title="Sales"
        subtitle={`${formatNumber(salesData.amount)} Orders`}
        body={formatCurrency(salesData.numberofSales)}
      />
      <DashbordCard
        title="Customers"
        subtitle={`${formatCurrency(usersData.averageValuePerUser)} Average Value`}
        body={formatNumber(usersData.userCount)}
      />
      <DashbordCard
        title="Product Data"
        subtitle={` ${formatNumber(productData.inActiveCount)} Inactive Products`}
        body={formatNumber(productData.activeCount)}
      />
    </div>
  );
};

export default page;

type Cardsdescription = {
  title: string;
  subtitle: string;
  body:string
};

function DashbordCard({ title, subtitle, body }: Cardsdescription) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription> {subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
      {/* <CardFooter>
      <p>Card Footer</p>
    </CardFooter> */}
    </Card>
  );
}
