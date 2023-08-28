import Categorias from "./categoria.model.js";
import Precios from "./precio.model.js";
import Propiedad from './propiedad.model.js'
import Usuario from './Usuario.model.js'


//Este archivo sirve para relacionar las distintas tablas de la base de datos.

Propiedad.belongsTo(Precios, {foreignKey:'FK_PRE_idPrecio'})
Propiedad.belongsTo(Categorias, {foreignKey:'FK_CAT_idCategoria'})
Propiedad.belongsTo(Usuario, {foreignKey:'FK_idUsuario'})

export { Categorias, Precios,Propiedad,Usuario }