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

        let movieNotes ;
        
        if(movieTags){
            const filterMovieTags = movieTags.split(',').map( tag => tag.trim())
            
            movieNotes = await knex("movie_tags")
            .select([
                "movie_notes.id",
                "movie_notes.title",
                "movie_notes.description",
                "movie_notes.user_id",
                
               
            ])
            .where("movie_notes.user_id", user_id)
            .whereLike("movie_notes.title", `%${title}%`)
            // O whereIn compara a array de tags com os nomes correspondentes das tags salvas no banco de dados
            .where(function(){
                filterMovieTags.map(tag => {
                    this.orWhereLike("movie_tags.name", `%${tag}%`)
                });
            })
            .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
            .orderBy("movie_notes.title")

        }else{
            movieNotes = await knex("movie_notes")
            .where({user_id})
            .whereLike("title", `%${title}%`)
            .orderBy("title")

        }
        const userMovieTags = await knex("movie_tags").where({user_id})

        const movieNotesWithTags = movieNotes.map(note => {
            const movieNoteTags = userMovieTags.filter(tag => tag.note_id === note.id)
            return{
                ...note,
                tags: movieNoteTags
            }
        })

        return response.json(movieNotesWithTags)
    }

    async delete(request, response){
        const {id} = request.params
        await knex("movie_notes").where({id}).delete()

        return response.json({message:"Nota excluída com sucesso!"})
    }
}
module.exports = MovieNotesController