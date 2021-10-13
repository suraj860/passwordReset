
const route = require("express").Router()
const service = require("./user_services")

route.post("/register" , service.register)
route.post("/login" , service.login)

module.exports = route;