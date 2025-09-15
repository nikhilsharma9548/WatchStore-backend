import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './Configs/MongoDB.js';
import cors from 'cors';
import userRouter from './Routes/user.Route.js';
import adminRouter from './Routes/admin.Route.js';
import connectClouudinary from './Configs/Cloudinary.js';
import productRouter from './Routes/product.Route.js';
import cartRouter from './Routes/cart.Route.js';
import addressRouter from './Routes/address.Route.js';
import orderRouter from './Routes/order.Route.js';
import { stripeWebhook } from './Controllers/order.controller.js';

// MongoDB & Cloudinary connect
await connectDB();
await connectClouudinary();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['https://watch-store-frontend-three.vercel.app'];

// ✅ CORS middleware sabse pehle lagao
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ OPTIONS allow karo
}));

// ✅ Webhook ko raw body chahiye, isliye cors ke baad define karo
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

// ✅ Ye middlewares ab CORS ke baad aa sakte hain
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => { res.send('API Working') });

app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
