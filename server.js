const express = require('express');
const menssagesRouter = require('./routes/messages')
class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT
        this.paths = {
            messages: "/api/v1/messages",
        }
        this.routes()
    }
    routes() {
       /* this.app.get('/' , (req, res) => {
            res.send ('Hello word');
        }) //end point
    */
    this.app.use(this.paths.messages, menssagesRouter)
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en el puerto ', this.port);
        })
    }
}
module.exports = Server
