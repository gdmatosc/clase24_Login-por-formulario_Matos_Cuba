/* #region. 1.Parámetros y recursos generales*/

/* #region. Plantilla*/

/* #endregion */

const fs=require('fs')
/* #endregion */

/* #region. 2.Key.class:Contenedor*/

class Contenedor {
    constructor(nombreArchivo){
        this.archivo=nombreArchivo
        this.data=[]
        try{
            console.log('Initializing File connection...')
            this.init()
        }
        catch(error){
            console.log(`Error initializing File connection ${error}`)

        }
    } 

    async init(){
        console.log("thisdata-inicio.init.contenedorFile: ",this.data)
        this.data=await this.getAll()
        console.log("thisdata-fin.init.contenedorFile: ",this.data)
    }

    async save(objeto){
        try{
            await this.init()
            objeto={...objeto,id:this.data.length+1}
            this.data.push(objeto)
            console.log("thisData.save.contenedorFile: ",this.data)
            console.log("objeto.save.contenedorFile: ",objeto)
            await fs.promises.writeFile(`./b4.files_storage/${this.archivo}`,JSON.stringify(this.data)+'\n')
            return objeto
        }
        catch (error){
            console.log(error)
        }
    }

    async getAll(){
        try{
            let objetosJSON=await fs.promises.readFile(`./b4.files_storage/${this.archivo}`,'utf-8');
            let objetosParse = JSON.parse(objetosJSON);
            return objetosParse
        }
        catch (error){
            console.log(error)
        }
    }

    async getById(id){
        try{
            let productos=await this.getAll()
            let coincidencia=null
            productos.forEach(product =>{
                if(product.id===id){
                    coincidencia=product
                }
            })
            return coincidencia
        }
        catch(error){
            console.log(error)
        }
    }

    async deleteAll(){
        try{
            console.log("deleteAll-inicio.contenedorFile")
            await fs.promises.writeFile(`./b4.files_storage/${this.archivo}`,'[]')
            console.log("deleteAll-final.contenedorFile")
            return "Borrado completado de contenido del File"
        }
        catch(error){
            console.log(error)
        }
    }

    async editById(id,campo,valor){
        try{
            let productos=await this.getAll();
            let producto=productos.filter(producto=>producto.id===id)[0];
            producto[campo]=valor;
            const index=productos.findIndex(producto=>producto.id===id);
            productos.splice(index,1,producto);
            const productosParsed=JSON.stringify(productos);
            await fs.promises.writeFile(`./b4.files_storage/${this.archivo}`,productosParsed)
        }
        catch(error){
            console.log(error)
        }
    }

    async editByBody(obj){
        try{
            let productos=await this.getAll(); 
            //let producto=productos.filter(producto=>producto.id===obj.id)[0];
            const index=productos.findIndex(producto=>producto.id===obj.id);
            productos.splice(index,1,obj);
            const productosParsed=JSON.stringify(productos);
            await fs.promises.writeFile(`./b4.files_storage/${this.archivo}`,productosParsed)
            return obj
        }
        catch(error){
            console.log(error)
        }
    }

    async deleteById(id){
        try{
            let productos=await this.getAll()
            let productosCargar=productos.filter(obj=>obj.id !==id)
            let i=0;
            let productosCargarNew = productosCargar.map(function(obj){
                let rObj = {};
                i=i+1
                rObj.id = i;
                rObj.title=obj.title;
                rObj.thumbnail=obj.thumbnail;
                rObj.price=obj.price;
                return rObj;
                });
            console.log("productosCargarNew.deleteByID.contenedorFile",productosCargarNew)
            await this.deleteAll()
            let productosTemp=await this.getAll()
            console.log("productosTemp.deleteByID.contenedorFile",productosTemp)
            await fs.promises.writeFile(`./b4.files_storage/${this.archivo}`,JSON.stringify(productosCargarNew)+'\n')
        }
        catch(error){
            console.log(error)
        }
    }

}
/* #endregion */

/* #region. 3.Object.functions...show.values.variables*/

/* #endregion */


module.exports=Contenedor