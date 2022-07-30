/* #region. 1.Parámetros y recursos generales*/

/* #region. Plantilla*/

/* #endregion */

const mongoose=require('mongoose');
const ObjectId=require('mongoose').Types.ObjectId;
/* #endregion */

/* #region. 2.Key.function:ContenedorMongo*/
class ContenedorMongo {
    //argumentos del constructor: uri,model
    constructor(uri,model){
        this.uri=uri
        this.model=model
        this.mongo=mongoose.connect(uri,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
        })
            .then(db=>console.log(`DB is connected`))
            .catch(err=>console.log(err));
    }

    async save(obj){
        const newProduct=new model(obj);
        console.log("saveContenedorMongoDB")
        await newProduct.save()
        return newProduct
    }
 
    async getById(id){
        return model.find({_id: new ObjectId(id)})
    }

    async getAll(){
        return model.find({})
    }

    async editById(obj,id){
        console.log('UPDATE');
        const objUpdated=await model.updateOne(
            {_id: new ObjectId(id)},
            {$set:obj}
        )
        return objUpdated
    }

    async deleteById(id){
        console.log("MongoDBdeleteByID",id)
        const userDelete=await model.deleteOne({_id: new ObjectId(id)})
        return true
    }

    async deleteAll(){
        console.log("deleteAllContenedorMongoDB")
        const userDeleteAll=await model.deleteMany()
        return true
    }

}
/* #endregion */


module.exports=ContenedorMongo;