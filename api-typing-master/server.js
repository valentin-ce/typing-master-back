const express = require('express')
const cors = require('cors')
const port = 4000;

const app = express();

const Auth = require('./middleware/Auth')
const usersController = require('./controller/usersController')


app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/* Authentication */
app.post('/api/v1/auth/signup', usersController.signupUser)
app.post('/api/v1/auth/signin', usersController.signinUser)

/* Users */
app.get('/api/v1/user', Auth.verifyToken, usersController.getUserById)

app.listen(port).on('listening', ()=> {
    console.log(`listening on port ${port}`)
})