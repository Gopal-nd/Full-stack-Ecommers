import { match } from "assert";
import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./lib/isValid";

export async function middleware(req:NextRequest){
if(await checkAdmin(req) == false){
    return new NextResponse("UnAuthorised",{
        status:401,
        headers:{
            "WWW-Authenticate":"Basic"
        }
    })
}
}

async function checkAdmin(req:NextRequest){
    const authHeader = req.headers.get("Authorization")|| req.headers.get('authorization')

if(authHeader ==null) return false
    // const {pathname}=req.nextUrl
    // return pathname.startsWith('/admin')

    const [username,password] = Buffer.from(authHeader.split(" ")[1],"base64").toString().split(":")

    console.log(username,password)
    if(username == null || password == null) return false
    if(username == 'gopal' && password=="gopal123") return true

}

export const config = {
    matcher:'/admin/:path*',
}