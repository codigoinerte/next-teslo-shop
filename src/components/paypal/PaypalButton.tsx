"use client";
import { INSTANCE_LOADING_STATE, OnApproveDataOneTimePayments, PayPalOneTimePaymentButton, usePayPal } from '@paypal/react-paypal-js/sdk-v6'
import { useRouter } from 'next/navigation';

interface Props {
    orderId: string,
}

export const PaypalButton = ({ orderId }: Props) => {
    const route = useRouter();
    const { loadingStatus } = usePayPal();

    const createOrder = async () => {
        const response = await fetch("/api/paypal/create-order", { 
            method: "POST",
            body: JSON.stringify({ internalOrderId: orderId }),

        });
        const data = await response.json();
        
        return { orderId: data.orderId };
    }

    const onApprove = async ({ orderId: approvedPaypalOrderId }: OnApproveDataOneTimePayments) => {
        const response = await fetch(`/api/paypal/capture-order/${approvedPaypalOrderId}`, {
            method: "POST"
        });
        const data = await response.json() as { 
            ok: boolean;
            transactionId: string;
            paypalOrderId: string;
            requestId: string;
            orderId: string;
        };
        

        if(data.ok){
            route.refresh();
        }        
    }

    if(loadingStatus === INSTANCE_LOADING_STATE.PENDING){
        return (
            <div className='animate-pulse flex flex-col gap-2'>
                <div className='h-9 bg-gray-300 rounded-md' />
            </div>
        )
    }

    return (
        <div data-paypal-button-container className='w-full'>
            <PayPalOneTimePaymentButton
                createOrder={createOrder}
                onApprove={onApprove}
                onCancel={(data) => console.log("Cancelled:", data)}
                onError={(error) => console.error("Error:", error)}
                presentationMode="auto"
                type="checkout"
                fullPageOverlay={{ 
                    enabled: true
                }}
            />
        </div>
    )
}
 