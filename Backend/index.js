import express from 'express'
import { PORT, MongoDbUrl } from './config.js';
import mongoose, { mongo } from 'mongoose';
import { User } from './Models/UserLoginModel.js';

const app = express();

app.get('/', (request, response) =>{
    console.log(request)
    return response.status(234).send('Testing')
});


mongoose
    .connect(MongoDbUrl)
    .then(() => {
        console.log('MongoDB Database is successfully connected');
        app.listen(PORT, () => {
    console.log(`Server is being hosted on localhost: ${PORT}`);
});

    })
    .catch((error) =>{
        console.log(error);
    });