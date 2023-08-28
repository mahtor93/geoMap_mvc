import { validationResult } from 'express-validator'
import { unlink } from 'node:fs/promises'
import { Propiedad, Precios,Categorias } from '../models/index.model.js';


const admin = async (req,res) =>{
    const { idUsuario } = req.usuario
    console.log(req.usuario);
    const propiedades = await Propiedad.findAll({
        where: { FK_idUsuario: idUsuario
        },
        include:[
            {model: Categorias, as:'categoria'},
            {model: Precios, as:'precio'}
        ]
    })
    res.render('propiedades/admin',{
        tituloPagina:'Mis propiedades',
        csrfToken: req.csrfToken(),
        propiedades,
    })
}   

const crearPropiedad = async (req,res) =>{
    const[categorias,precios] = await Promise.all([
        Categorias.findAll(),
        Precios.findAll()
    ])
    res.render('propiedades/crear',{
        tituloPagina:'Crear Propiedad',
        csrfToken: req.csrfToken(),
        categorias, 
        precios,
        propiedad:{}
    })
}

const guardarPropiedad = async(req,res) =>{

    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        const[categorias,precios] = await Promise.all([
            Categorias.findAll(),
            Precios.findAll()
        ])
        return res.render('propiedades/crear',{
            tituloPagina:'Crear Propiedad',
            csrfToken: req.csrfToken(),
            categorias, 
            precios,
            errores: resultado.array(),
            propiedad: req.body
            
        })
    }
    const { PRP_tituloAnuncio,PRP_Descripcion,PRP_categoriaPropiedad,PRP_precio,PRP_habitaciones,PRP_estacionamiento,PRP_wc,PRP_direccion,PRP_latitud,PRP_longitud, PRP_imagen=''} = req.body
    const { idUsuario:FK_idUsuario } = req.usuario
    try{   
        const propiedadGuardada = await Propiedad.create({
            FK_idUsuario,
            PRP_tituloAnuncio,
            PRP_Descripcion,
            PRP_categoriaPropiedad,
            FK_PRE_idPrecio: PRP_precio,
            FK_CAT_idCategoria: PRP_categoriaPropiedad,
            PRP_habitaciones,
            PRP_estacionamiento,
            PRP_wc,
            PRP_direccion,
            PRP_latitud,
            PRP_longitud,
            PRP_imagen,
        });
        const { PRP_idPropiedad } = propiedadGuardada;
        res.redirect(`/propiedades/agregar-imagen/${PRP_idPropiedad}`);
    }catch(error){
        console.log(error);
    }
    
}

const agregarImagen = async(req,res)=>{
    console.log(req.params)
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades');
    }
    if(propiedad.PRP_publicado){
        return res.redirect('/mis-propiedades')
    }
    if(req.usuario.idUsuario.toString() !== propiedad.FK_idUsuario.toString()){
        return res.redirect('/mis-propiedades');
    }    
    res.render(`propiedades/agregar-imagen`,{
        tituloPagina: `Agregar Imagen de ${propiedad.PRP_tituloAnuncio}`,
        csrfToken: req.csrfToken(),
        propiedad
    })
}

const almacenarImagen = async (req,res, next) =>{
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades');
    }
    if(propiedad.PRP_publicado){
        return res.redirect('/mis-propiedades')
    }
    if(req.usuario.idUsuario.toString() !== propiedad.FK_idUsuario.toString()){ 
        return res.redirect('/mis-propiedades');
    }
    try{
        propiedad.PRP_imagen = req.file.filename
        propiedad.PRP_publicado = true;
        await propiedad.save();
        next();
    }catch(error){
        console.error(error)
    }   
}

const editarPropiedad = async(req,res)=>{

    const { id } = req.params; //extraigo la ID de la propiedad desde la URL

    const propiedad = await Propiedad.findByPk(id) //busco la propiedad a editar en la base de datos

    if(!propiedad){ //si no existe la propiedad
        return res.redirect('/mis-propiedades'); //redirecciono a mis propiedades
    }
    if(req.usuario.idUsuario.toString() !== propiedad.FK_idUsuario.toString()){ //si el usuario no es el dueño de la propiedad
        return res.redirect('/mis-propiedades'); //redirecciono a mis propiedades
    }


    const[categorias,precios] = await Promise.all([
        Categorias.findAll(),
        Precios.findAll()
    ])
    res.render('propiedades/editarPropiedad',{
        tituloPagina:` Editar Propiedad: "${propiedad.PRP_tituloAnuncio}"`,
        csrfToken: req.csrfToken(),
        categorias, 
        precios,
        propiedad
    })
}

const guardarCambios = async(req,res) =>{

    //verificar validacion
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        const[categorias,precios] = await Promise.all([
            Categorias.findAll(),
            Precios.findAll()
        ])
        res.render('propiedades/editarPropiedad',{
            tituloPagina:` Editar Propiedad ${propiedad.PRP_tituloAnuncio}`,
            csrfToken: req.csrfToken(),
            categorias, 
            precios,
            errores: resultado.array(),
            propiedad: req.body
            
        })
    }
    const { id } = req.params; //extraigo la ID de la propiedad desde la URL

    const propiedad = await Propiedad.findByPk(id) //busco la propiedad a editar en la base de datos

    if(!propiedad){ //si no existe la propiedad
        return res.redirect('/mis-propiedades'); //redirecciono a mis propiedades
    }
    if(req.usuario.idUsuario.toString() !== propiedad.FK_idUsuario.toString()){ //si el usuario no es el dueño de la propiedad
        return res.redirect('/mis-propiedades'); //redirecciono a mis propiedades
    }


    //escribir y actualizar el registro en la base de datos
    try{
        const { PRP_tituloAnuncio,PRP_Descripcion,PRP_categoriaPropiedad,PRP_precio,PRP_habitaciones,PRP_estacionamiento,PRP_wc,PRP_direccion,PRP_latitud,PRP_longitud, PRP_imagen=''} = req.body

        propiedad.set({
            PRP_tituloAnuncio,
            PRP_Descripcion,
            PRP_categoriaPropiedad,
            PRP_precio,
            PRP_habitaciones,
            PRP_estacionamiento,
            PRP_wc,PRP_direccion,
            PRP_latitud,
            PRP_longitud,
        })

        await propiedad.save();
        res.redirect('/mis-propiedades');
    }catch(error){
        console.log(error);
    }
}

const eliminarPropiedad = async(req,res) =>{
    const { id } = req.params; //extraigo la ID de la propiedad desde la URL

    const propiedad = await Propiedad.findByPk(id) //busco la propiedad a editar en la base de datos

    if(!propiedad){ //si no existe la propiedad
        return res.redirect('/mis-propiedades'); //redirecciono a mis propiedades
    }
    if(req.usuario.idUsuario.toString() !== propiedad.FK_idUsuario.toString()){ //si el usuario no es el dueño de la propiedad
        return res.redirect('/mis-propiedades'); //redirecciono a mis propiedades
    }

    //eliminar la imagen
    await unlink(`./public/uploads/${propiedad.PRP_imagen}`);
    console.log('imagen eliminada')

    //eliminar el registro de la base de datos
    await propiedad.destroy();
    res.redirect('/mis-propiedades');
}


//Area pública

const mostrarPropiedad = async(req,res) =>{

    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id, 
        {include:
            [
                {model: Categorias, as:'categoria'}, //traigo los datos correspondientes a las otras tablas
                {model: Precios, as:'precio'}
            ]
        }
    );

    if(!propiedad){
        //muestra un mensaje de que la propiedad no existe
        return res.redirect('/');
    }
    res.render('propiedades/propiedad',{
        tituloPagina: `${propiedad.PRP_tituloAnuncio}`,
        propiedad,
    });
    

}

export {
    admin, crearPropiedad,guardarPropiedad,agregarImagen, almacenarImagen,editarPropiedad, guardarCambios, eliminarPropiedad, mostrarPropiedad
}