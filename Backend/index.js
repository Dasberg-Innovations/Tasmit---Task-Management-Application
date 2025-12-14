import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT, MongoDbUrl } from './config.js';
import loginRoute from './Routes/loginRoute.js';
import taskRoutes from './Routes/taskRoute.js';
import GoalRoute from './Routes/GoalRoute.js';
import SettingsRoute from './Routes/SettingsRoute.js';

const app = express();

app.use(cors({
  origin: ['https://habotapp-frontend.onrender.com', 'http://localhost:5173'], 
  credentials: true
}));


app.get('/', (request, response) => {
    return response.status(200).send('Testing');
});

app.use('/', loginRoute);
app.use('/tasks', taskRoutes);
app.use('/goals', GoalRoute);
app.use('/settings', SettingsRoute);


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