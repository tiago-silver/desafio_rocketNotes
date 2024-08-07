const sqliteConnection = require("../../sqlite")
const createUsersMigration = require("./createUsersMigration")

async function migrationsRun(){
    const schemas = [
        createUsersMigration
    ].join('')

    sqliteConnection()
    .then(db => db.exec(schemas))
    .catch(error => console.error(error))
}
module.exports = migrationsRun