import express from 'express'
import { upload } from '../Configs/Multer.js';
import authAdmin from '../MiddleWare/authadmin.middleware.js';
import { addProduct, changeStock, productById, productList } from '../Controllers/product.controller.js';

const productRouter = express.Router();

productRouter.post('/add',upload.array(["images"]), authAdmin, addProduct)
productRouter.get('/list', productList)
productRouter.get('/id', productById)
productRouter.post('/stock', authAdmin, changeStock)

export default productRouter