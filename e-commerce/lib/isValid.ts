
export async function isValidPassword(password:string
	,hash:string){
        console.log(await HashedPassword(password))
return await HashedPassword(password) === hash

}

async function HashedPassword(password:string){
    const arrayBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(password));
	return Buffer.from(arrayBuffer).toString('base64');
}