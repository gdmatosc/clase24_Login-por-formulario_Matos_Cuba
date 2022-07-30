/* #region. 1.Parámetros y recursos generales*/

/* #region. Plantilla*/

/* #endregion */ 

const express=require('express');
const http=require('http');
const apiRouter=require('./b1.routes/apiRouter');
const { Server }=require("socket.io");

const MongoStore=require('connect-mongo')
const session=require('express-session')

const app=express();
const server=http.createServer(app)
const io=new Server(server);
const PORT=8081;
/* #endregion */

/* #region. 2.Recursos de web socket*/
const mensajesDBTest=[
    {id:1,nombre:"User 1",correo:"u1@company.com",edad:20,textoIngresado:"Iniciamos!"},
    {id:2,nombre:"User 2",correo:"u2@company.com",edad:21,textoIngresado:"Primero!"},
    {id:3,nombre:"User 3",correo:"u3@company.com",edad:22,textoIngresado:"Que empiece!"}
]

let messages=[]

let GetComentarios=()=>{
    const options = {
        host : 'localhost',
        port : 8081,
        path: '/api/comentarios/file',
        method: 'GET'
    };
    // Sending the request
    const req = http.request(options, (res) => {
    let data = ''
    res.on('data', (chunk) => {
        data += chunk;
    });
    // Ending the response 
    res.on('end', () => {
        messages = JSON.parse(data);
        console.log("mensajes",data)
        console.log('mensajesJson:', JSON.parse(data))
    });
       
    }).on("error", (err) => {
    console.log("Error: ", err)
    }).end()
            
} 

io.on('connection',(socket)=>{
    GetComentarios()
    socket.emit('messages',messages)
    console.log('User conectado Get, id:'+socket.id);
    let mensajesDBTemporal=messages
    console.log('Usuario conectado socket inicial')
    socket.on('new-message',data=>{
        GetComentarios()
        console.log("Recibido new-message")
        dataJson=JSON.parse(data)
        console.log("DataSinId: ", dataJson)
        dataJson["id"]="1";
        console.log("DataConId: ", dataJson)
        mensajesDBTemporal.push(dataJson)
        //messagesTemp.push(data)
        io.sockets.emit('messages',mensajesDBTemporal);
        console.log('mensajesDBTemporal.new-message-fin.socketOn.inOn.Server',mensajesDBTemporal)
    });
    socket.on('new-message-delete',data=>{
        GetComentarios()
        mensajesDBTemporal=[]
        //messagesTemp.push(data)
        io.sockets.emit('messages',mensajesDBTemporal);
        console.log('mensajesDBTemporal.new-message-delete-fin.socketOn.inOn.Server',mensajesDBTemporal)
    });
    
})
/* #endregion */ 

/* #region. 3.Uso de objetos de librería express*/

//3.1.Uso de objetos en otros JS
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname+'/public'))

app.use(session({
    store:new MongoStore({
        mongoUrl: 'mongodb://localhost:27017/sessions'
    }),
    secret:'conrat',
    resave:false,
    saveUninitialized:false
}))

app.use('/api',apiRouter);

//3.3.Envío de datos a URLs
/*
app.get('/',(req,res)=>{
    res.sendFile('index.html',{root: __dirname})
})
*/
/*
app.get('/productos',(req,res)=>{
    res.sendFile('productos.html',{root: __dirname+'/public'})
})
*/

app.get('/login',(req,res)=>{
    if(req.session.username) return res.redirect('/')
    res.sendFile('login.html',{root: __dirname+'/public'})
})

app.post('/login',(req,res)=>{
    req.session.username=req.body.username
    return res.redirect('/')
})

app.get('/',(req,res)=>{
    console.log(req.session);
    console.log("reqSessionUsername.appGet",req.session.username)
    if(!req.session.username) return res.redirect('/login')
    res.sendFile('index.html',{root: __dirname})
    //return res.render('index',{username:req.session.username}) index.name: index.ejs 
})

app.get('/logout',(req,res)=>{
    //username=req.session.username
    req.session.destroy()
    res.sendFile('logout.html',{root: __dirname+'/public'})
    //return res.render('logout',{username}) logout.name: logout.ejs 

})

/* #endregion */ 

/* #region. 4.Iniciando servidor general*/
server.listen(PORT,()=>{
    console.log('Listening on port: '+PORT);
})
/* #endregion */ 

/*
const MongoStore=require('connect-mongo')
const express=require('express')
const session=require('express-session')

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//app.set('views','./views')
//app.set('view engine', 'ejs')

app.use(session({
    store:new MongoStore({
        mongoUrl: 'mongodb://localhost/sessions'
    }),
    secret:'conrat',
    resave:false,
    saveUninitialized:false
}))

app.get('/login',(req,res)=>{
    if(req.session.username) return res.redirect('/')
    res.sendFile(__dirname+'/views/login.html')
})

app.post('/login',(req,res)=>{
    req.session.username=req.body.username
    return res.redirect('/')
})

app.get('/',(req,res)=>{
    console.log(req.session);
    if(!req.session.username) return res.redirect('/login')
    res.sendFile(__dirname+'/views/index.html')
    //return res.render('index',{username:req.session.username}) index.name: index.ejs 
})

app.get('/logout',(req,res)=>{
    //username=req.session.username
    req.session.destroy()
    res.sendFile(__dirname+'/views/logout.html')
    //return res.render('logout',{username}) logout.name: logout.ejs 

})

app.listen(8080,()=>console.log('Server running...'))
*/