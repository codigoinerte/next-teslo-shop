import { randomUUID } from "crypto";
import { auth } from "@/auth";
import { getPaypalAccessToken } from "@/utils/getPaypalAccessToken";
import { NextResponse } from "next/server";
import { paypalCheckPayment } from "@/actions/payment/paypal-check-payment";

export async function POST(request:Request, segments:RouteContext<"/api/paypal/capture-order/[id]">){
    const paypalOrderId = (await segments.params).id;

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { ok: false, message: "No autenticado" },
            { status: 401 }
        );
    }

    if (!paypalOrderId || typeof paypalOrderId !== "string") {
        return NextResponse.json(
            { ok: false, message: "paypalOrderId es requerido" },
            { status: 400 }
        );
    }

    const access_token = await getPaypalAccessToken();

    if(!access_token) return;

    const requestId = randomUUID();

    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}/capture`, {
        headers: {
            "Authorization": `Bearer ${access_token}`,
            "PayPal-Request-Id": requestId,
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
        method: "POST",
        body: JSON.stringify({}),

    });

    const captureData = await response.json();

    if (!response.ok) {
        return NextResponse.json(
            {
                ok: false,
                message: "Error capturando orden en PayPal",
                details: captureData,
            },
            { status: response.status }
        );
    }

    const transactionId = captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    if (!transactionId || typeof transactionId !== "string") {
        return NextResponse.json(
            {
                ok: false,
                message: "No se pudo obtener transactionId de la captura",
                details: captureData,
            },
            { status: 422 }
        );
    }

    const responseCheckPayment =  await paypalCheckPayment(paypalOrderId);
    if(!responseCheckPayment?.ok){
        return NextResponse.json({
            ok:false,

        })
    }

    return NextResponse.json({
        ok: true,
        transactionId,
        paypalOrderId,
        requestId,
        orderId: responseCheckPayment.orderId ?? '',
    })
}