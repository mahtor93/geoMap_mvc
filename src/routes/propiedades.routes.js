import expres from 'express'
import { body } from 'express-validator'
import { admin, crearPropiedad,guardarPropiedad,agregarImagen, almacenarImagen, editarPropiedad, guardarCambios, eliminarPropiedad, mostrarPropiedad} from '../../Controllers/propiedades.controller.js';
import protegerRuta from '../../middleware/token.middleware.js';
import upload from '../../middleware/subirImagen.middleware.js';


const router = expres.Router();

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear',protegerRuta, crearPropiedad)
router.post('/propiedades/crear', protegerRuta,
        body('PRP_tituloAnuncio').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
        body('PRP_Descripcion')
                .notEmpty().withMessage('La descripción del anuncio es obligatoria')
                .isLength({max:255}).withMessage('La descripción es demasiado larga'),
        body('PRP_categoriaPropiedad').isNumeric().withMessage('Debes seleccionar una categoría'),
        body('PRP_precio').isNumeric().withMessage('Debes seleccionar un rango de precios'),
        body('PRP_habitaciones').isNumeric().withMessage('Debes seleccionar una cantidad de habitaciones'),
        body('PRP_estacionamiento').isNumeric().withMessage('Debes seleccionar una cantidad de estacionamientos'),
        body('PRP_wc').isNumeric().withMessage('Debes seleccionar una cantidad de baños'),
        body('PRP_latitud').notEmpty().withMessage('Ubica la propiedad en el mapa'),
        guardarPropiedad
        )

router.get('/propiedades/agregar-imagen/:id',protegerRuta, agregarImagen)
router.post('/propiedades/agregar-imagen/:id', 
        protegerRuta,
        upload.single('imagen'),
        almacenarImagen,
        )

router.get('/propiedades/editarPropiedad/:id', protegerRuta, editarPropiedad)

router.post('/propiedades/editarPropiedad/:id', protegerRuta,
        body('PRP_tituloAnuncio').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
        body('PRP_Descripcion')
                .notEmpty().withMessage('La descripción del anuncio es obligatoria')
                .isLength({max:255}).withMessage('La descripción es demasiado larga'),
        body('PRP_categoriaPropiedad').isNumeric().withMessage('Debes seleccionar una categoría'),
        body('PRP_precio').isNumeric().withMessage('Debes seleccionar un rango de precios'),
        body('PRP_habitaciones').isNumeric().withMessage('Debes seleccionar una cantidad de habitaciones'),
        body('PRP_estacionamiento').isNumeric().withMessage('Debes seleccionar una cantidad de estacionamientos'),
        body('PRP_wc').isNumeric().withMessage('Debes seleccionar una cantidad de baños'),
        body('PRP_latitud').notEmpty().withMessage('Ubica la propiedad en el mapa'),
        guardarCambios
        )


router.post('/propiedades/eliminarPropiedad/:id',protegerRuta,
        eliminarPropiedad,
        )


//Área pública

router.get('/propiedad/:id', mostrarPropiedad)


export default router