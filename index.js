import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser'
import connectDB from './Configs/MongoDB.js';
import cors from 'cors';
import userRouter from './Routes/user.Route.js';
import adminRouter from './Routes/admin.Route.js';
import connectClouudinary from './Configs/Cloudinary.js';
import productRouter from './Routes/product.Route.js';
import cartRouter from './Routes/cart.Route.js';
import addressRouter from './Routes/address.Route.js';
import orderRouter from './Routes/order.Route.js';

// mongodb connecion
await connectDB();
await connectClouudinary()

const app = express();
app.set("trust proxy", 1);  // ✅ required for Render / proxies
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['https://watch-store-frontend-three.vercel.app']


//MiddleWare configgration

app.use(cookieParser());
app.use(express.json());
app.use(cors({origin : allowedOrigins, credentials: true  }));


app.get('/', (req, res) => {res.send('API Working')});
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})