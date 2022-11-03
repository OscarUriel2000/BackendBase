const {request, response } = require ("express");
const pool = require ("../db/connection")
const bcryptjs = require("bcryptjs")
const getUsers = async (req = request, res = response) => {
    let conn;
    try {
        conn = await pool.getConnection()
        const users = await conn.query("SELECT * FROM Usuarios", (error) => {throw new Error(error)})
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
        const [user] = await conn.query(`SELECT * FROM Usuarios WHERE ID = ${id}`, (error) => {throw new Error(error)})
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
    const {affectedRows} = await conn.query(`UPDATE Usuarios SET Activo = 'N' WHERE ID = ${id}`, (error) => {throw new Error(error)})
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
        res.status(400).json({msg: "Falta información del usuario"})
        return
    }
    let conn;
    try {
        conn = await pool.getConnection()
        const [user] = await conn.query(`SELECT Usuario FROM Usuarios WHERE Usuario = '${Usuario}'`)
        if (user) {
            res.status(403).json({msg: `El usuario ${Usuario} ya se encuentra registrado`})
            return
        }
        const salt = bcryptjs.genSaltSync()
        const ContrasenaCifrada = bcryptjs.hashSync(Contrasena,salt)
    const {affectedRows} = await conn.query(`INSERT INTO Usuarios(
            Nombre,
            Apellidos,
            Edad,
            Genero,
            Usuario,
            Contrasena,
            Fecha_Nacimiento,
            Activo
        ) VALUES (
            '${Nombre}',
            '${Apellidos}',
            ${Edad},
            '${Genero || ''}',
            '${Usuario}',
            '${ContrasenaCifrada}',
            '${Fecha_Nacimiento}',
            '${Activo}'
        )`, (error) => {throw new Error(error)})
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
        res.status(400).json({msg: "Falta información del usuario"})
        return
    }
    let conn;
    try {
        conn = await pool.getConnection()
        const [user] = await conn.query(`
        SELECT Usuario, Nombre, Apellidos, Edad, Genero, Fecha_Nacimiento
        FROM Usuarios 
        WHERE Usuario = '${Usuario}'
        `)
        if (!user) {
            res.status(403).json({msg: `El usuario ${Usuario} no se encuentra registrado`})
            return
        }
    const {affectedRows} = await conn.query(`
        UPDATE Usuarios SET
            Nombre = '${Nombre || user.Nombre}',
            Apellidos = '${Apellidos || user.Apellidos}',
            Edad = ${Edad || user.Edad},
            Genero = '${Genero || user.Genero}',
            Fecha_Nacimiento = '${Fecha_Nacimiento}'
        WHERE Usuario = '${Usuario}'
            `, (error) => {throw new Error(error)})
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
        res.status(400).json({msg: "Falta información del usuario"})
        return
    }
    let conn;
    try {
        conn = await pool.getConnection()
        const [user] = await conn.query(`SELECT Usuario, Contrasena, Activo FROM Usuarios WHERE Usuario = '${Usuario}'`)
        if (!user || user.Activo === 'N') {
            let code = !user ? 1 : 2;
            res.status(403).json({msg: `El Usuario o la Contraseña son incorrectos`, errorCode: code})
            return
        }
        const accesoValido = bcryptjs.compareSync(Contrasena, user.Contrasena)
        if (!accesoValido) {
            res.status(403).json({msg: `El Usuario o la Contraseña son incorrectos`, errorCode: 3})
            return
        }
        res.json({msg: `El usuario ${Usuario} a inciado sesión correctamente.`}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    } finally{
        if (conn){
            conn.end()
        }
    }
}
module.exports = {getUsers, getUserByID, deleteUserByID, addUser, updateUserByUsuario, singIn}