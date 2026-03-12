import { NextResponse } from "next/server";
import { getPaypalAccessToken } from "@/utils/getPaypalAccessToken";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { setTransactionId } from "@/actions/payment/set-transaction-id";

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { ok: false, message: "No autenticado" },
            { status: 401 }
        );
    }

    const { internalOrderId } = await request.json();

    if (!internalOrderId || typeof internalOrderId !== "string") {
        return NextResponse.json(
            { ok: false, message: "internalOrderId es requerido" },
            { status: 400 }
        );
    }

    const order = await prisma.order.findFirst({
        where: {
            id: internalOrderId,
            userId: session.user.id,
            isPaid: false,
        },
    });

    if (!order) {
        return NextResponse.json(
            { ok: false, message: "Orden no encontrada o ya pagada" },
            { status: 404 }
        );
    }

    const access_token = await getPaypalAccessToken();

    if(!access_token) return;

    const body = {
        intent: "CAPTURE",
        purchase_units: [
            {
                custom_id: internalOrderId,
                invoice_id: internalOrderId,
                amount: {
                    currency_code: "USD",
                    value: order.total.toFixed(2),
                },
            },
        ],
    };

    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders`, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
        },
        method: "POST",
        body: JSON.stringify(body),

    });

    const paypalOrder = await response.json();

    
    await setTransactionId(internalOrderId, paypalOrder.id);

    if (!response.ok) {
        return NextResponse.json(
            {
                ok: false,
                message: "Error creando orden en PayPal",
                details: paypalOrder,
            },
            { status: response.status }
        );
    }

    return NextResponse.json({
        ok: true,
        orderId: paypalOrder.id,
    });
}