
import Order from "../Models/order.model.js";
import Product from "../Models/product.model.js";
import User from "../Models/User.model.js";
import crypto from "crypto";
import Stripe from "stripe";

// place order COD : /api/orde/cod

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "please select a product"});
        }

        // calculate the Amount using Items
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.json({ success: false, message: "Product not found" });
            }
            amount += product.offerPrice * item.quantity;
        }

        // add tax charge 2 %
        amount += Math.floor(amount * 0.02);

        // create a short order id 
        const shortOrderId = "ORD-" + crypto.randomBytes(3).toString("hex").toUpperCase();

        // create order
        await Order.create({
            orderId: shortOrderId, 
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        });

        return res.json({ success: true, message: "Order Placed", orderId: shortOrderId  });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// PLACE ORDER WITH ONLINE PAYMENT : /api/order/stripe

export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const {origin} = req.headers ;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "please select a product"});
        }
        let productData = [] ;
        
        // calculate the Amount using Items
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            })
            if (!product) {
                return res.json({ success: false, message: "Product not found" });
            }
            amount += product.offerPrice * item.quantity;
        }

        // add tax charge 2 %
        amount += Math.floor(amount * 0.02);

        // create a short order id 
        const shortOrderId = "ORD-" + crypto.randomBytes(3).toString("hex").toUpperCase();

        // create order
       const order =  await Order.create({
            orderId: shortOrderId, 
            userId,
            items,
            amount,
            address,
            paymentType: "ONLINE",
        });

        // Stripe gatway Initiialization
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        // create line items for stripe
        const line_items = productData.map((item) => {
            return{
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
                },
                quantity: item.quantity,
            }
        })

        // create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                 userId: userId.toString(),
            }
        })
        res.json({ success: true,  url: session.url });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Stripe webhook : /api/order/stripe
export const stripeWebhook = async (req, res) => {
    // stripe GITWAY Initiialization
     const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        res.json({success: false, message: `Webhook Error: ${error.message}`});
        console.log(`Webhook Error: ${error.message}`);
    }

    // Handle the checkout.session.completed event
    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // getting session metadata from payment intent
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            })
            const { orderId, userId } = session.data[0].metadata;

            // update the order status
            await Order.findByIdAndUpdate(orderId, {
                isPaid: true,
            })
            //clear the cart
            await User.findByIdAndUpdate(userId, {cartItems: {}});
            break;
            }
             case "payment_intent.failed":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // getting metadata from payment intent
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            })
            const { orderId } = session.data[0].metadata ;
            await Order.findByIdAndDelete(orderId);
            break;
        };

        default: console.log(`Unhandled event type ${event.type}`);
        break;

    }
    res.json({received: true});
}

// cancel Order by user 

export const cancelOrder = async (req, res) => {
  
};



// get order by userid : /api/order/user

export const getUserOrder = async(req, res) =>{
        try {
            const { userId } = req.body ;
            const orders = await Order.find({userId, $or: [{paymentType: "COD"}, {isPaid: true}]}).populate("items.product address").sort({createdAt: -1});

            res.json({success: true, orders})

        } catch (error) {
             console.log(error.message)
        res.json({success: false, message: error.message})
        }
}


// Get all orders for seller /admin : api/orders/admin

export const getAllOrder = async(req, res) =>{
        try {
            const orders = await Order.find({$or: [{paymentType: "COD"}, {isPaid: true}]}).populate("items.product address").sort({createdAt: -1});;

            res.json({success: true, orders})

        } catch (error) {
             console.log(error.message)
        res.json({success: false, message: error.message})
        }
}



