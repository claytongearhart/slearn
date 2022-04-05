const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.use('/data', express.static("data"))

app.listen(3000, ()=> {
    console.log("k"
    )
})