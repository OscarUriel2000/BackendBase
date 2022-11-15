const modeloUsuarios = {
    queryGetUsers: "SELECT * FROM Usuarios",
    queryGetUserByID: `SELECT * FROM Usuarios WHERE ID = ?`,
    queryDeleteUserByID: `UPDATE Usuarios SET Activo = 'N' WHERE ID = ?`,
    queryUserExists: `SELECT Usuario FROM Usuarios WHERE Usuario = '?'`,
    queryAddUser: `INSERT INTO Usuarios(
            Nombre,
            Apellidos,
            Edad,
            Genero,
            Usuario,
            Contrasena,
            Fecha_Nacimiento,
            Activo
        ) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )`,
    queryGetUserInfo: `
        SELECT Usuario, Nombre, Apellidos, Edad, Genero, Fecha_Nacimiento
        FROM Usuarios 
        WHERE Usuario = '?'
    `,
    queryUpdateByUsuario: `
        UPDATE Usuarios SET
            Nombre = '?',
            Apellidos = '?',
            Edad = ?,
            Genero = '?',
            Fecha_Nacimiento = '?'
        WHERE Usuario = '?'
    `,
    querySingin: `SELECT Usuario, Contrasena, Activo FROM Usuarios WHERE Usuario = '?'`,
    queryUpdatePassword: `SELECT Contrasena FROM Usuarios WHERE Usuario = '?'`
}
module.exports = modeloUsuarios