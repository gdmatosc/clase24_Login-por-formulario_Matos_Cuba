/* #region. 1.Parámetros y recursos generales*/

/* #region. Plantilla*/

/* #endregion */

const { Router }=require('express');


const modelProduct=require('../b3.models/product.model');
const modelChat=require('../b3.models/chat.model');

const ContenedorFile=require('../b2.contenedores/contenedorFile')
const contenedorFileProducts=new ContenedorFile('products.json')
const contenedorFileUsuarios=new ContenedorFile('usuarios.json')
const contenedorFileChat=new ContenedorFile('mensajesT1.json')

const ContenedorMongo=require('../b2.contenedores/contenedorMongo')
//const contenedorMongoProducts=new ContenedorMongo('mongodb://localhost:27017/productosM2',modelProduct)
const contenedorMongoChat=new ContenedorMongo('mongodb://localhost:27017/mensajesT1',modelChat)

const router=Router(); 

const messagesP=[
    {"id":1,"title":"Escuadra","thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/book-note-paper-school-512.png","price":45},
    {"id":2,"title":"Calculadora19","thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/book-note-paper-school-512.png","price":56},
    {"id":3,"title":"Globo t.","thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/book-note-paper-school-512.png","price":67}
]

/* #endregion */ 

/* #region. 2.Get.chat*/

router.get('/comentarios/file', async (req, res) => {
    await contenedorFileChatBasic.init();
    let contenedorVar=await contenedorFileChatBasic.getAll();
    console.log("contenedorVar.comentariosFile.RouterGet",contenedorVar)
    res.json(contenedorVar)
    console.log("Enviado.comentariosFile.RouterGet")
});

router.get('/comentarios/mongoDB', async (req, res) => {
    let contenedorVar=await contenedorMongoChatBasic.getAll();
    console.log("contenedorVar.comentariosMongoDB.routerGet",contenedorVar)
    res.json(contenedorVar)
    console.log("Enviado.comentariosMongoDB.routerGet")
});

/* #endregion */

/* #region. 3.Post.chat*/

router.post('/comentarios/file',async (req,res)=>{
    const {nombre,edad,correo,textoIngresado}=req.body;
    console.log("username-text.comentariosFile.routerPost",{nombre,edad,correo,textoIngresado})
    await contenedorFileChatBasic.save({nombre,edad,correo,textoIngresado});
    console.log("Guardado.comentariosFile.routerPost")
})
router.post('/comentarios/mongoDB',async (req,res)=>{
    const {username,text}=req.body;
    console.log("username-text.comentariosMongoDB.routerPost",{username,text})
    await contenedorMongoChatBasic.save({username,text});
    console.log("Guardado.comentariosMongoDB.routerPost")
})
/* #endregion */

/* #region. 3.Get.productos*/

router.get('/objetos/mongoDB', async (req, res) => {
    let contenedorMongoProductsNew=await contenedorMongoProducts.getAll();
    contenedorVar=contenedorMongoProductsNew;
    console.log("contenedorVar.objetosMongoDB.RouterGet",contenedorVar)
    res.json(contenedorMongoProductsNew)
    console.log("Enviado.objetosMongoDB.RouterGet")
});

router.get('/objetos/file', async (req, res) => {
    await contenedorFileProducts.init();
    let contenedorVar=await contenedorFileProducts.getAll();
    console.log("contenedorVar.objetosFile.RouterGet",contenedorVar)
    res.json(contenedorVar)
    console.log("Enviado.objetosFile.RouterGet")
});

//app.get('/products',async (req,res)=>res.send(await productDao.getAll()))

/* #endregion */

/* #region. 4.Post.productos*/
router.post('/objetos/mongoDB',async (req,res)=>{
    let {title,thumbnail,price}=req.body;
    console.log("req.bodyPost",req.body)
    price=Number(price);
    if(!title || !thumbnail || !price){
        return res.status(400).send({error: `Los datos están incompletos ahora: ${req.body}`});
    }
    await contenedorMongoProducts.save({title,thumbnail,price});
    console.log("Guardado.objetosMongoDB.routerPost")
    res.send("Guardado")
})

router.post('/objetos/file',async (req,res)=>{
    let {title,thumbnail,price}=req.body;
    console.log("req.bodyPost.objetosFile.RouterPost",req.body)
    price=Number(price);
    if(!title || !thumbnail || !price){
        return res.status(400).send({error: `Los datos están incompletos ahora: ${req.body}`});
    }
    await contenedorFileProducts.save({title,thumbnail,price});
    console.log("Guardado.objetosFile.routerPost")
    res.send("Guardado.routerObjetosPostFile")
})

//app.post('/products',async (req,res)=>res.send(await productoDao.save(req.body)))

/* #endregion */

/* #region. 5.Put-Delete.productos*/
router.put('/objetos/file/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        console.log(id)
        const {field,value}=req.body;
        await contenedorFileProducts.editById(Number(id),field,value);
        res.send({message:`El producto con id ${id} se modificó exitosamente`})
    }catch(error){
        throw error
    }
})

router.delete('/objetos/file/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        console.log("routerDeleteID",id)
        await contenedorFileProducts.deleteById(Number(id));
        res.send({message:`El producto con id ${id} de un file se borró exitosamente`})
    }catch(error){
        throw error
    }
})

router.delete('/objetos/mongoDB/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        console.log("routerDeleteMongoDBID",id)
        await contenedorMongoProducts.deleteById(id);
        res.send({message:`El producto con id ${id} de un mongoDB se borró exitosamente`})
    }catch(error){
        throw error
    }
})

router.delete('/objetos/file',async(req,res)=>{
    res.json(await contenedorFileProducts.deleteAll())
    console.log("borradoTotal.objetosFile.routerDelete")
})

router.delete('/objetos/mongoDB',async(req,res)=>{
    res.json(await contenedorMongoProducts.deleteAll())
    console.log("borradoTotal.objetosmongoDB.routerDelete")
})

router.delete('/comentarios/file',async(req,res)=>{
    res.json(await contenedorFileChatBasic.deleteAll())
    console.log("borradoTotal.comentariosFile.routerDelete")
})

router.delete('/comentarios/mongoDB',async(req,res)=>{
    res.json(await contenedorMongoChatBasic.deleteAll())
    console.log("borradoTotal.comentariosMongoDB.routerDelete")
})

/*
router.delete('/',async(req,res)=>{
    res.json(await contenedorFileProducts.deleteAll())
    console.log("borrador total")
})
*/

/* #endregion */


module.exports=router;
