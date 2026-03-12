export interface getPaypalToken {
    scope: string,
    access_token: string,
    token_type: string,
    app_id: string,
    expires_in: number,
    nonce: string
}

export const getPaypalAccessToken = async ():Promise<string|null> => {
    const clientId = process.env.PAYPAL_CLIENT_ID ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;

    if (!clientId || !secret) {
        throw new Error("Faltan credenciales de PayPal en variables de entorno");
    }

    const auth = Buffer
        .from(`${clientId}:${secret}`)
        .toString("base64");

    
    const body = new URLSearchParams({
        grant_type: "client_credentials",
    });

    try {
        const responseToken = await fetch(`https://api-m.sandbox.paypal.com/v1/oauth2/token`, { 
                headers:{
                    Accept: "application/json",
                    "Accept-Language": "en_US",                
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },            
                method: "POST",
                body: body.toString(),
                cache: "no-store",
        });
    
        const data = await responseToken.json() as getPaypalToken;
        return data.access_token;
        
    } catch (error) {
        console.log(error);
        return null;
    }
}