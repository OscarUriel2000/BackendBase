const { request, response } = require("express");
const rootMessages = (req=request, res=response) => {
    const {texto1, texto2} = req.query
    // if (!texto1 || !texto2) {
    //     res.status(400).json({
    //         msg: "No se han enviado los parametros necessarios, este EndPoint ocupa los parametros 'texto1' y 'texto2'"
    //     })
    // }
    if (!texto1){
        res.status(400).json({msg: "Falta el parametro 'texto1'"})
    }
    if (!texto2){
        res.status(400).json({msg: "Falta el parametro 'texto2'"})
    }
    res.status(200).json ({msg: texto1 + ' ' + texto2});
}
const hiMessages =  (req=request, res=response) => {
    const {name} = req.params
    res.json({msg: 'Hola' + ' ' + name});
} 
const byeMessages = (req=request, res=response) => {
    res.json ({msg:'Adios mundo'});
}
const postMessages = (req=request, res=response) => {
    const {no_control, nombre} = req.body
    // console.log({no_control, nombre})
    res.json ({msg: `numero de control = ${no_control}, nombre = ${nombre}`});
}
const putMessages = (req=request, res=response) => {
    res.json ({msg:'Mensaje Put'});
}
const deleteMessages = (req=request, res=response) => {
    res.json ({msg:'Mensaje Delete'});
}
module.exports = {rootMessages, hiMessages, byeMessages, postMessages, putMessages, deleteMessages};