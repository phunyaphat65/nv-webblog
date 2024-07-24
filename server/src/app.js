let express= require('express')
const app = express()
app.get('/status',function(reg, res ){
  res.send('hello')
})

let port = 8080

app.listen(port, function (){
  console.log('Hello nodejs ja'+port)
})