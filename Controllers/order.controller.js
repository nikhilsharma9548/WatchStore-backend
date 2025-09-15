
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
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "please select a product" });
    }

    let productData = [];
    let amount = 0;

    // calculate total amount
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });

      amount += product.offerPrice * item.quantity;
    }

    // add 2% tax
    amount += Math.floor(amount * 0.02);

    // short order id
    const shortOrderId = "ORD-" + crypto.randomBytes(3).toString("hex").toUpperCase();

    // create order
    const order = await Order.create({
      orderId: shortOrderId,
      userId,
      items,
      amount,
      address,
      paymentType: "ONLINE",
    });

    // stripe gateway
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
      },
      quantity: item.quantity,
    }));

    // create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(), // ✅ MongoDB _id use karna zaruri hai
        userId,
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.log("❌ placeOrderStripe Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};


// Stripe webhook : /api/order/stripe
export const stripeWebhook = async (req, res) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log(`❌ Webhook Error: ${error.message}`);
    return res.json({ success: false, message: `Webhook Error: ${error.message}` });
  }

  switch (event.type) {
    case "checkout.session.completed": {  // ✅ Right event type
      const session = event.data.object;
      const { orderId, userId } = session.metadata;

      console.log("✅ Checkout Session Completed");
      console.log("OrderId:", orderId, "UserId:", userId);

      // update order status
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { isPaid: true },
        { new: true }
      );
      console.log("✅ Order Updated:", updatedOrder);

      // clear the cart
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { cartItems: {} },
        { new: true }
      );
      console.log("✅ User Cart Cleared:", updatedUser.cartItems);

      break;
    }

    case "checkout.session.expired": {
      console.log("⚠️ Checkout Session Expired");
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
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



