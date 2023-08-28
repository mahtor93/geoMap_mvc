import  express  from 'express'
import { Configuration, OpenAIApi  } from 'openai';
import cookieParser from 'cookie-parser'
import db from './config/db.config.js'
import usuarioRoutes from './src/routes/usuario.routes.js'
import propiedadesRoutes from './src/routes/propiedades.routes.js'
import csurf from 'csurf';

const app = express();

//habiltiar lectura de datos de formulario
app.use( express.urlencoded({extended:true}));
app.use( cookieParser() )
app.use( csurf({cookie:true}) )

//conexión a la base de datos
try{
    await db.authenticate();
    db.sync();
    console.log('Conexión correcta a la base de datos');
}catch(error){
    console.log(error);
}

//definir puerto
const port = process.env.PORT || 3333;

app.listen(port,()=>{
    console.log('Server corriendo en el puerto: '+port)
});

//Rutas de archivos de vistas
app.set('view engine', 'pug')
app.set('views','./views')
app.use(express.static('public'));


//Routing
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)