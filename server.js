const express = require('express');
const menssagesRouter = require('./routes/messages')
const cors = require ("cors")
class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT
        this.paths = {
            messages: "/api/v1/messages",
        }
        this.middlewares()
        this.routes()
    }
    routes(){
      this.app.use(this.paths.messages, menssagesRouter) 
    }
    middlewares(){
        this.app.use(cors())
        this.app.use(express.json())
   }
    listen(){
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en el puerto ', this.port);
        })
    }
}
module.exports = Server
