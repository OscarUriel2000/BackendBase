//http://localhost:4000/api/v1/messages
const {Router} = require('express')
const router = Router()
const {rootMessages, hiMessages, byeMessages, postMessages, putMessages, deleteMessages} = require ('../controllers/messages')
    router.get('/' , rootMessages) //end point
    router.get('/hi/:name', hiMessages) //end point
    router.get('/bye' , byeMessages) //end point
    router.post('/' , postMessages) //end point
    router.put('/' , putMessages) //end point
    router.delete('/' , deleteMessages) //end point
    module.exports = router