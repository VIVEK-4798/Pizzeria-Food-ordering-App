import { metadata } from "@/app/layout";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Order } from "@/app/models/Order";
import { MenuItem } from "@/app/models/MenuItem";
const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {

    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }); 
    // console.log("headers:", req.headers);
    const sig = req.headers['stripe-signature'];
    console.log("headers stripe:", sig);
    console.log("videpo headers", req.headers.get('stripe-signature'));
    

    const {userInfo, cartProducts} = await req.json();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    
    const orderDoc = await Order.create({
        userEmail,
        ...userInfo,
        cartProducts,
        paid: false,
    })

    const stripeLineItems = [];
    for(const cartProduct of cartProducts){

        const productInfo = await MenuItem.findById(cartProduct._id);

        let productPrice = productInfo.basePrice;
        if(cartProduct.size){
            const size = productInfo.sizes
            .find(size => size._id.toString() === cartProduct.size._id.toString());
            productPrice += size.price;
        }
        if(cartProduct.extras?.length > 0){
            for (const cartProductExtraThing of cartProduct.extras){
                const productExtras = productInfo.extraIngredientsPrices;
                const extraThingInfo = productExtras
                .find(extra => extra._id.toString() === cartProductExtraThing._id.toString());
                productPrice += extraThingInfo.price;
            }
        }

        const productName = cartProduct.name;

        stripeLineItems.push({
            quantity: 1,
            price_data: {
                currency: 'inr',
                product_data: {
                    name: productName,
                },
                unit_amount: productPrice * 100,
            }
        });
    }
    
    const stripeSession = await stripe.checkout.sessions.create({
        line_items: stripeLineItems,
        mode: 'payment',
        customer_email: String(userEmail).trim(),
        success_url: process.env.NEXTAUTH_URL + 'cart?success=1',
        cancel_url: process.env.NEXTAUTH_URL + 'cart?canceled=1',
        metadata: {orderId:  orderDoc._id.toString()},
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: 'Delivery fee',
                    type: 'fixed_amount',
                    fixed_amount: {amount: 10000, currency: 'inr'},
                },
            }
        ]
    });

    return Response.json(stripeSession.url);
}