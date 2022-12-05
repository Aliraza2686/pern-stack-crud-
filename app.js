const express = require('express')
const pool = require('./db/connect')
//routers
const postRoutes = require('./routes/postRoutes')
const userRoutes = require('./routes/userRoutes')
const app = express()

app.use(express.json())

app.use(postRoutes)
app.use(userRoutes)

const port = 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})