const { Router} = require("express")
const MoviesNotesController = require("../controller/MovieNotesController")

const moviesNotesRoutes = Router()

const moviesNotesController = new MoviesNotesController()

moviesNotesRoutes.get("/", moviesNotesController.index)
moviesNotesRoutes.post("/:user_id", moviesNotesController.create)
moviesNotesRoutes.get("/:id", moviesNotesController.show)
moviesNotesRoutes.delete("/:id", moviesNotesController.delete)

module.exports = moviesNotesRoutes