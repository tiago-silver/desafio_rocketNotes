const AppError = require("../utils/AppError")
const knex = require("../database/knex");


class MovieNotesController{
    async create(request, response){
        const {title, description, rating, movieTags} = request.body 
        const {user_id} = request.params

        if(rating < 0 || rating > 10){
            throw new AppError("Insira uma nota entre 0 e 10!")
        }
        const [note_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
         })

         const movieTagsInsert = movieTags.map(name => {
            return {
                user_id,
                note_id,
                name

            }
         })

         await knex("movie_tags").insert(movieTagsInsert)

        return response.json({message:"Nota cadastrada com sucesso!"})

    }

    async show(request, response){
        const {id} = request.params

    
        const notes = await knex("movie_notes").where({id}).first()
        const movieTags = await knex("movie_tags").where({note_id: id}).orderBy("name")



        return response.json({
            ...notes,
            movieTags
        })
    }  
    
    async index(request, response){
        const {title, user_id, movieTags} = request.query

        const notes = await knex("movie_notes").where({user_id}).orderBy("title")

        return response.json(notes)
    }
}
module.exports = MovieNotesController