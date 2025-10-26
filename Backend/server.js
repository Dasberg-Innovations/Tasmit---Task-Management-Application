import express from 'express'

const app = express();

app.listen(5000, () => {
    console.log("Server is being hosted on localhost: Port 5000.");
});