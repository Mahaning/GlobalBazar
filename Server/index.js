import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import cors from 'cors';
import authRout from './routes/authRoute.js';
import shopCategoriesRout from './routes/shopCategoryRoute.js';
import shopSubCategoriesRout from './routes/ShopSubCategoriesRoute.js';
dotenv.config();

connectDB();

const app=express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/v1/auth/',authRout);
app.use('/api/v1/shopeCategories/',shopCategoriesRout);
app.use('/api/v1/Shop-Sub-Category/',shopSubCategoriesRout)


app.get('/',(req,res)=>{
    res.send("<h1>Hellow </h1>");
});

const port=process.env.PORT || 8080;

app.listen(8080,()=>{
    console.log(`Server is connected at port : ${port}`);
});

