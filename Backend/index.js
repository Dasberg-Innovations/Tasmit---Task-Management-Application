import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT, MongoDbUrl } from './config.js';
import loginRoute from './Routes/loginRoute.js';

const app = express();

app.use(cors());

app.use(express.json());


app.get('/', (request, response) => {
    return response.status(200).send('Testing');
});

app.use('/', loginRoute);

mongoose
    .connect(MongoDbUrl)
    .then(() => {
        console.log('MongoDB Database is successfully connected');
        app.listen(PORT, () => {
            console.log(`Server is being hosted on localhost: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });