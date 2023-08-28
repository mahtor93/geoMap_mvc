import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db.config.js'


const Usuario = db.define('usuarios',{
    idUsuario:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    token:{
        type: DataTypes.STRING
    },
    confirmado:{
        type:DataTypes.BOOLEAN
    }

},{
    hooks:{ //hasheando un password
        beforeCreate: async function(usuario) {
            const salt = await bcrypt.genSalt(16)
            usuario.password = await bcrypt.hash(usuario.password,salt);
        }
    },
    scopes:{
        eliminarDatos:{
            attributes:{
                exclude:['password','token','confirmado','createdAt','updatedAt']
            }
        }
    }
})

Usuario.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}
export default Usuario;