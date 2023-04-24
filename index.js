const express = require('express')
const connectToMongo = require('./database')
const app = express()
const port = process.env.PORT || 5000


connectToMongo();

app.use((req, res, next)=>{
  res.setHeader("Access-control-Allow-Origin", "https://favfood.onrender.com/");
  res.header(
    "Access-control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

app.use(express.json())

app.use('/api', require('./routes/CreateUser'))

app.use('/api', require('./routes/DisplayData'))

// app.use('/api', require('./routes/OrderData'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})