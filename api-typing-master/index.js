const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
const cors = require("cors");

/* import queries */
const users = require('./queries/users');
const Auth = require('./middleware/Auth.js');


app.use(cors());
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (req, res) => {
    res.json({info: 'Node.js, Express, and Postgres API'})
})

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})


/* USERS */
app.get('/users', Auth.verifyToken, users.getUser);
app.post('/auth/signup', users.createUser);
app.post('/auth/signin', users.loginUser);
app.delete('/users', Auth.verifyToken, users.deleteUser);