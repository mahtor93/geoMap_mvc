import multer from "multer";
import path from "path";
import { generarId } from '../utilities/tokens.js'

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, generarId() + path.extname(file.originalname)) //generamos un ID para el nombre y obtenemos la extension del archivo
    },
});

const upload = multer({ storage })

export default upload