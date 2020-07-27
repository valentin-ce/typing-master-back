const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

/* import queries */
const users = require('./queries/users');

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
app.post('/auth/signup', users.createUser);
app.post('/auth/signin', users.loginUser);