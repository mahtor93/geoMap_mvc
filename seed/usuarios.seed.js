import bcrypt from 'bcrypt'
const seedUsuarios = [
    {
        nombre:'master',
        email: 'master@master.com',
        confirmado: 1,
        password: bcrypt.hashSync('password',16)
    }
]

export default seedUsuarios