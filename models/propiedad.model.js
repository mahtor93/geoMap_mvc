import { DataTypes } from "sequelize";
import db from '../config/db.config.js'

const Propiedad = db.define('propiedades',{
    PRP_idPropiedad:{
        type: DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
    PRP_tituloAnuncio:{
        type: DataTypes.STRING(128),
        allowNull:false
    },
    PRP_Descripcion:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    PRP_habitaciones:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    PRP_estacionamiento:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    PRP_wc:{
        type:DataTypes.INTEGER,
        allownull:false
    },
    PRP_direccion:{
        type:DataTypes.STRING(64),
        allowNull:false
    },
    PRP_latitud:{
        type:DataTypes.STRING,
        allowNull:false
    },
    PRP_longitud:{
        type:DataTypes.STRING,
        allowNull:false
    },
    PRP_imagen:{
        type:DataTypes.STRING,
        allowNull:false
    },
    PRP_publicado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
})

export default Propiedad;