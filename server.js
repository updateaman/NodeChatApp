var express = require('express')
var bodyParser = require('body-parser')

var mongoose = require('mongoose')
mongoose.Promise = Promise

var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dbUrl = 'mongodb://user:user@ds155424.mlab.com:55424/learning-node'

var Message = mongoose.model('Message',{
    name: String,
    message: String
})

app.get('/messages', (req,res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages)
    })
})

app.get('/messages/:user', (req, res)=> {
    var user = req.param.user
    Message.find({name: user}, (err, messages)=>{
        res.send(messages)
    })
})

app.post('/messages', async (req, res)=>{
    try{
        var message = new Message(req.body)
        var savedMessage = await message.save()

        console.log('saved')

        res.sendStatus(200)
    }
    catch(error) {
        res.sendStatus(500)
    }
})

io.on('connection', (socket)=> {
        console.log('a user connected')
})

mongoose.connect(dbUrl, { useMongoClient: true}, err =>{
    console.log('mongo db connection', err)
})

var server = http.listen(3000, ()=> {
    console.log('server is listening on port', server.address().port)
})