import jwt from 'jsonwebtoken'


const makeJWT = data => {
    return jwt.sign({ id: data.idUsuario,        
        mail: data.email,
        nombre: data.nombre, 
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generarId, makeJWT
}