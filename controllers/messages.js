const { request, response } = require("express");
const rootMessages = (req=request, res=response) => {
    res.status(404).json ({msg:'Mensajes'});
}
const hiMessages =  (req=request, res=response) => {
    res.status(406).json ({msg:'Hola mundo'});
}
const byeMessages = (req=request, res=response) => {
    res.status(406).json ({msg:'Adios mundo'});
}
const postMessages = (req=request, res=response) => {
    res.status(407).json ({msg:'Mensaje Post'});
}
const putMessages = (req=request, res=response) => {
    res.status(408).json ({msg:'Mensaje Put'});
}
const deleteMessages = (req=request, res=response) => {
    res.status(409).json ({msg:'Mensaje Delete'});
}
module.exports = {rootMessages, hiMessages, byeMessages, postMessages, putMessages, deleteMessages};