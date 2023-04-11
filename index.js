require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');
const PORT = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, 'https://dev.nfcsportal.com', '*', 'http://localhost:3000', 'https://nfcs-f.onrender.com', 'https://www.nfcs.space/']
}));
app.use('/api', router);
app.use(errorMiddleware);


const start = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server start PORT=${PORT} ${process.env.SMPT_PASSWORD}`) )
    }catch (error) {
        console.log(error)
    }
};

start();
