const express = require("express")
const verifyAuth = require("../middlewares/verifyAuth")
const { getUserData } = require("../controllers/userController")
const router = express.Router()

router.get("/data" , verifyAuth , getUserData)

module.exports = router