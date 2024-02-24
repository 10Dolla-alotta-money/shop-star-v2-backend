import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';

const port = process.env.PORT || 5000;

dotenv.config();
connectDB();

const app = express();

//* Body Parser
app.use(express.json());

//* Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use(notFound);
app.use(errorHandler);

// app.get('/api/config/paypal', (req, res) =>
//   res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
// );

// if (process.env.NODE_ENV === 'production') {
//   const __dirname = path.resolve();

//   app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//   app.use(express.static(path.join(__dirname, '/frontend/dist')));

//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
//   );
// } else {
//   app.get('/', (req, res) => res.send('express api is running '));

//   const __dirname = path.resolve();
//   app.get('/', (req, res) => {
//     res.send('API is running....');
//   });
//   app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
// }

app.listen(port, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`.cyan.bold
  )
);

export default app;
