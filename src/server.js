const express = require('express');
require("express-async-errors")
const routes = require("./routes")
const migrationsRun = require("./database/sqlite/migrations")
const AppError = require("./utils/AppError")


const app = express();
app.use(express.json())
app.use(routes)
migrationsRun()

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