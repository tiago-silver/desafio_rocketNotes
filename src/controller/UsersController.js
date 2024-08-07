const AppError = require("../utils/AppError")
// Import conexão com banco de dados 
const sqliteConnection = require("../database/sqlite")
const { hash, compare} = require("bcryptjs")


class UsersController {
    async create(request, response) {
        const { name, email, password} = request.body
        const database = await sqliteConnection()
        

        const CheckUserEmailExists = await database.get("SELECT * FROM users WHERE email = (?)",[email])
        if(CheckUserEmailExists){
            throw new AppError("Este email já existe!")
        }

        const hashedPassword = await hash(password, 8)

        await database.run("INSERT INTO users (name, email, password) VALUES(?, ?, ?)", [name, email, hashedPassword])

        return response.json({message: "Usuário cadastrado com sucesso!"})
    }

    async update(request, response) {
        const { name, email, password, oldPassword} = request.body
        const { id } = request.params

        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        if (!user) {
            throw new AppError("Este usuário não existe!")
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("Este e-mail já esta em uso!")
        }


        user.name = name ?? user.name
        user.email = email ?? user.email

        if(password && !oldPassword) {
            throw new AppError("Você precisa informar a senha antiga!")
        }

        if(password && oldPassword){
            const cheOldPassword = await compare(oldPassword, user.password)
            if(!cheOldPassword){
                throw new AppError("A senha antiga não confere!")
            }
            user.password = await hash(password , 8)
        }

        await database.run(`UPDATE users SET name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME("now") 
            WHERE id = (?)`, [user.name, user.email, user.password, id])

        return response.status(200).json({message: "Dados atualizado com sucesso!"})
    }
}

module.exports = UsersController