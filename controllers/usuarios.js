const {request, response } = require ("express");
const pool = require ("../db/connection")
const bcryptjs = require("bcryptjs");
const modeloUsuarios = require("../models/usuarios");
const getUsers = async (req = request, res = response) => {
    let conn;
    try {
        conn = await pool.getConnection()
        const users = await conn.query(modeloUsuarios.queryGetUsers, (error) => {throw new Error(error)})
        if (!users){
            res.status(404).json({msg: "No se encontraron registros"})
            return
        }         
        res.json({users}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    } finally{
        if (conn){
            conn.end()
        }
    }
}
const getUserByID = async (req = request, res = response) => {
    const {id} = req.params
    let conn;
    try {
        conn = await pool.getConnection()
        const [user] = await conn.query(modeloUsuarios.queryGetUserByID, [id], (error) => {throw new Error(error)})
        if (!user){
            res.status(404).json({msg: `No se encontro registro con el ID ${id}`})
            return
        }         
        res.json({user}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    } finally{
        if (conn){
            conn.end()
        }
    }
}
const deleteUserByID = async (req = request, res = response) => {
    const {id} = req.query
    let conn;
    try {
        conn = await pool.getConnection()
    const {affectedRows} = await conn.query(modeloUsuarios.queryDeleteUserByID, [id], (error) => {throw new Error(error)})
    if (affectedRows === 0){
            res.status(404).json({msg: `No se pudo eliminar el registro con el ID ${id}`})
            return
        }         
        res.json({msg: `El usuario con ID ${id} se elimino correctamente.`}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    } finally{
        if (conn){
            conn.end()
        }
    }
}
const addUser = async (req = request, res = response) => {
    const {
        Nombre,
        Apellidos,
        Edad,
        Genero,
        Usuario,
        Contrasena,
        Fecha_Nacimiento = '1900-01-01',
        Activo
    } = req.body
    if (
        !Nombre || 
        !Apellidos ||
        !Edad ||
        !Usuario ||
        !Contrasena ||
        !Activo
    ) {
        res.status(400).json({msg: "Falta informaci??n del usuario"})
        return
    }
    let conn;
    try {
        conn = await pool.getConnection()
        const [user] = await conn.query(modeloUsuarios.queryUserExists, [Usuario])
        if (user) {
            res.status(403).json({msg: `El usuario ${Usuario} ya se encuentra registrado`})
            return
        }
        const salt = bcryptjs.genSaltSync()
        const ContrasenaCifrada = bcryptjs.hashSync(Contrasena,salt)
        const {affectedRows} = await conn.query(modeloUsuarios.queryAddUser, [
            Nombre,
            Apellidos,
            Edad,
            Genero || '',
            Usuario,
            ContrasenaCifrada,
            Fecha_Nacimiento,
            Activo
        ], (error) => {throw new Error(error)})
    if (affectedRows === 0){
            res.status(404).json({msg: `No se pudo agregar el registro del usuario ${Usuario}`})
            return
        }         
        res.json({msg: `El usuario ${Usuario} se agrego correctamente.`}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    } finally{
        if (conn){
            conn.end()
        }
    }
}
const updateUserByUsuario = async (req = request, res = response) => {
    const {
        Nombre,
        Apellidos,
        Edad,
        Genero,
        Usuario,
        Contrasena,
        Fecha_Nacimiento = "1900-01-01"
    } = req.body
    if (
        !Nombre || 
        !Apellidos ||
        !Edad ||
        !Usuario ||
        !Contrasena
    ) {
        res.status(400).json({msg: "Falta informaci??n del usuario"})
        return
    }
    let conn;
    try {
        conn = await pool.getConnection()
        const [user] = await conn.query(modeloUsuarios.queryGetUserInfo, [Usuario])
        if (!user) {
            res.status(403).json({msg: `El usuario ${Usuario} no se encuentra registrado`})
            return
        }
    const {affectedRows} = await conn.query(modeloUsuarios.queryUpdateByUsuario, [
        Nombre || user.Nombre,
        Apellidos || user.Apellidos,
        Edad || user.Edad,
        Genero || user.Genero,
        Fecha_Nacimiento,
        Usuario], (error) => {throw new Error(error)})
    if (affectedRows === 0){
            res.status(404).json({msg: `No se pudo actualizar el registro del usuario ${Usuario}`})
            return
        }         
        res.json({msg: `El usuario ${Usuario} se actualizo correctamente.`}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    } finally{
        if (conn){
            conn.end()
        }
    }
}
const singIn = async (req = request, res = response) => {
    const {
        Usuario,
        Contrasena
    } = req.body
    if (
        !Usuario ||
        !Contrasena
    ) {
        res.status(400).json({msg: "Falta informaci??n del usuario"})
        return
    }
    let conn;
    try {
        conn = await pool.getConnection()
        const [user] = await conn.query(modeloUsuarios.querySingin,[Usuario])
        if (!user || user.Activo === 'N') {
            let code = !user ? 1 : 2;
            res.status(403).json({msg: `El Usuario o la Contrase??a son incorrectos`, errorCode: code})
            return
        }
        const accesoValido = bcryptjs.compareSync(Contrasena, user.Contrasena)
        if (!accesoValido) {
            res.status(403).json({msg: `El Usuario o la Contrase??a son incorrectos`, errorCode: 3})
            return
        }
        res.json({msg: `El usuario ${Usuario} a inciado sesi??n correctamente.`}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    } finally{
        if (conn){
            conn.end()
        }
    }
}
const updatePassword = async (req = request, res = response) =>{
    const {Usuario, Contrasena, nuevaContrasena} = req.body
    if(!Usuario || !Contrasena || !nuevaContrasena){
        res.status(400).json({msg: "Faltan datos."})
        return
    }
    let conn
    try{
        conn = await pool.getConnection()
        const [getPass] = await conn.query(modeloUsuarios.queryUpdatePassword, [Usuario],
        (error) => {if (error) throw error})
        if(!getPass){
            res.status(403).json({msg: "Usuario o Contrase??a mal escritos"})
            return
        }
         const passvalid = bcryptjs.compareSync(Contrasena, getPass.Contrasena)
         const salt = bcryptjs.genSaltSync()
         const cc = bcryptjs.hashSync(nuevaContrasena, salt)
         if(!passvalid){
            res.status(403).json({msg: "El usuario o contrase??a son incorrectos"})
            return
         }
         const updatepass = await conn.query(`UPDATE Usuarios SET Contrasena = '${cc}'
         WHERE Usuario = '${Usuario}'`,(error) => {if (error) throw error})
        res.json({msg:`La contrase??a se ha modificado correctamente.`})
    }catch (error){
        console.log(error)
        res.status(500).json({msg: error})
    } finally{
        if (conn) conn.end()
    }
}
module.exports = {getUsers, getUserByID, deleteUserByID, addUser, updateUserByUsuario, singIn, updatePassword}