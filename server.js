import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
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

//? Sanitize Data middleware
app.use(mongoSanitize());

//? Set security header
app.use(helmet());

//? prevent cross site scripting
app.use(xss());

//? Rate Limit
const limiter = rateLimit({
  windowMS: 10 * 60 * 1000, //? this is for 10 minutes
  max: 100,
});

app.use(limiter);

//Prevent http param pollution
app.use(limiter);

app.use(hpp());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => res.json({ message: 'Wassup from server ' }));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use(notFound);
app.use(errorHandler);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// if (process.env.NODE_ENV === 'production') {
//   const __dirname = path.resolve();

//   app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//   app.use(express.static(path.join(__dirname, '/frontend/dist')));

//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
//   );
// } else {
//   const __dirname = path.resolve();
//   app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
//   app.get('/', (req, res) => res.send('express api is running '));
// }

app.listen(port, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`.cyan.bold
  )
);

export default app;
