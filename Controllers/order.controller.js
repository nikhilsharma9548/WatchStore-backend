
import Order from "../Models/order.model.js";
import Product from "../Models/product.model.js";

// place order COD : /api/orde/cod


export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "invalid Data" });
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

        // create order
        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        });

        return res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
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



