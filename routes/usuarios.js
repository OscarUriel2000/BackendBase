const {Router} = require("express")
const {getUsers, getUserByID, deleteUserByID, addUser, updateUserByUsuario, singIn, updatePassword} = require("../controllers/usuarios")
const router = Router()

// http://localhost:4000/api/v1/usuarios
//GET
router.get("/", getUsers)
router.get("/id/:id", getUserByID)
//POST
router.post("/", addUser)
router.post("/singin", singIn)
router.post("/signin/updatePassword", updatePassword)
//PUT
router.put("/", updateUserByUsuario)
//DELETE
router.delete("/", deleteUserByID)
module.exports = router