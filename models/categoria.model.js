import { DataTypes } from "sequelize";
import db from '../config/db.config.js'

const Categorias = db.define('categorias',{
    CAT_idCategoria:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    CAT_nombreCategoria:{
        type:DataTypes.STRING(32),
        allowNull: false
    }
})

export default Categorias