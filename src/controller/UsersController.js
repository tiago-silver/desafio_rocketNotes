const AppError = require("../utils/AppError")
class UsersController {
    create(request, response) {
        const { name, email, password} = request.body

        if(!name){
            throw new AppError("Nome obrigatório")
        }
        return response.json({name, email, password})
    }
}

module.exports = UsersController