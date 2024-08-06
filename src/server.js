const express = require('express');
const app = express();
app.use(express.json())

const routes = require("./routes")
app.use(routes)

const AppError = require("./utils/AppError")
app.use((error, request, response, next) => {
    if (error instanceof AppError){
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message
        })
    }
    console.error(error)

    return response.status(500).json({
        status : 'error',
        message : "ERROR interno do servidor!"
    })
});


const PORT = 3333;
app.listen(PORT, (()=>console.log(`The server is running at ${PORT}`)));