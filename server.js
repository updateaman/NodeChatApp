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

console.log(process.env.dbUrl)

var dbUrl = process.env.dbUrl || 'mongodb://user:user@ds155424.mlab.com:55424/learning-node' //Test mongodb database

var Message = mongoose.model('Message',{
    name: String,
    message: String,
    messageTime: { type: Date, default: Date.now }
})

app.get('/messages', (req,res) => {
    Message.find({ $query: {}, $orderby: { messageTime : -1 } }, (err, messages) =>{
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
        io.emit('message', req.body)

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

var PORT = process.env.PORT || 3000
var server = http.listen(PORT, ()=> {
    console.log('server is listening on port', server.address().port)
})