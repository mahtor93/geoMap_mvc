import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.model.js';
import ValidarClave from '../utilities/validaciones.js';
import { generarId, makeJWT } from '../utilities/tokens.js';
import { emailRegistro, emailRecuperacion } from '../utilities/emails.js';




const formularioLogin = (req, res) => {
  res.render('auth/login', {
    tituloPagina: 'Iniciar Sesion',
    csrfToken: req.csrfToken(),
  });
};

const autenticarLogin = async (req, res) => {
  await check('email').notEmpty().withMessage('Email obligatorio').run(req);
  await check('password').notEmpty().withMessage('Password obligatorio').run(req);
  const resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    return res.render('auth/login', {
      tituloPagina: 'Iniciar Sesion',
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.render('auth/login', {
      tituloPagina: 'Iniciar Sesion',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El usuario no existe' }],
    });
  }

  if (!usuario.confirmado) {
    return res.render('auth/login', {
      tituloPagina: 'Iniciar Sesion',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'No has confirmado tu cuenta' }],
      usuario: {
        email: req.body.email,
      },
    });
  }

  if (!usuario.verificarPassword(password)) {
    return res.render('auth/login', {
      tituloPagina: 'Iniciar Sesion',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'Password Incorrecto' }],
      usuario: {
        email: req.body.email,
      },
    });
  }

  const token = makeJWT({
    idUsuario: usuario.idUsuario,
    mail: usuario.email,
    nombre: usuario.nombre,
  });

  return res.cookie('UserToken', token, {
    httpOnly: true,
    //secure:true
  }).redirect('/mis-propiedades');

};

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    tituloPagina: 'Crear Cuenta',
    csrfToken: req.csrfToken(),
  });
};

const registrar = async (req, res) => {
  try {
    await check('nombre').notEmpty().withMessage('Nombre obligatorio').run(req);
    await check('email').notEmpty().withMessage('Email obligatorio').run(req);
    await check('email').isEmail().withMessage('Email invalido').run(req);
    await check('password').notEmpty().withMessage('Password obligatorio').run(req);
    await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req);
    if (!ValidarClave(req.body.password, req.body.repetir_password)) {
      await check(req.body.repetir_password).equals(req.body.password).withMessage('Los passwords no son iguales').run(req);
    }

    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      return res.render('auth/registro', {
        tituloPagina: 'Crear Cuenta',
        csrfToken: req.csrfToken(),
        errores: resultado.array(),
        usuario: {
          nombre: req.body.nombre,
          email: req.body.email,
        },
      });
    }

    const usuarioDuplicado = await Usuario.findOne({ where: { email: req.body.email } });
    if (usuarioDuplicado) {
      return res.render('auth/registro', {
        tituloPagina: 'Crear Cuenta',
        csrfToken: req.csrfToken(),
        errores: [{ msg: 'El correo ya está registrado' }],
        usuario: {
          nombre: req.body.nombre,
          email: req.body.email,
        },
      });
    }

    req.body.token = generarId();
    const usuario = await Usuario.create(req.body);

    res.render('Templates/mensaje', {
      tituloPagina: 'Cuenta Creada',
      mensajes: [{ msg: 'Enviamos un correo de verificación a: ' + req.body.email }],
    });

    emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });
  } catch (error) {
    throw error;
  }
};

const confirmar = async (req, res, next) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render('auth/cuenta-confirmada', {
      tituloPagina: 'Error de Autenticación',
      mensaje: 'Hubo un error al confirmar tu cuenta',
      error: true,
    });
  } else {
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();
    res.render('auth/cuenta-confirmada', {
      tituloPagina: 'Autenticación Completa',
      mensaje: 'Tu cuenta ha sido confirmada',
    });
  }
};

const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    tituloPagina: 'Recuperar contraseña',
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  try {
    await check('email').notEmpty().withMessage('Email obligatorio').run(req);
    await check('email').isEmail().withMessage('Email invalido').run(req);

    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
      return res.render('auth/olvide-password', {
        tituloPagina: 'Recuperar contraseña',
        csrfToken: req.csrfToken(),
        errores: resultado.array(),
      });
    }

    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.render('auth/olvide-password', {
        tituloPagina: 'Recuperar contraseña',
        csrfToken: req.csrfToken(),
        errores: [{ msg: 'El email ingresado no está registrado' }],
        usuario: {
          email,
        },
      });
    }

    usuario.token = generarId();
    await usuario.save();
    emailRecuperacion({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    res.render('Templates/mensaje', {
      tituloPagina: 'Recuperar contraseña',
      mensajes: [{ msg: 'Enviamos un correo de recuperación a: ' + req.body.email }],
    });
  } catch (error) {
    throw error;
  }
};

const comprobarToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
      return res.render('Templates/mensaje', {
        tituloPagina: 'Recuperar contraseña',
        mensajes: [{ msg: 'Hubo un error al validar tu información. Intenta de nuevo' }],
        error: true,
      });
    }

    res.render('auth/reset-password', {
      tituloPagina: 'Reestablece tu password',
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    throw error;
  }
};

const nuevoPassword = async (req, res) => {
  await check('password').notEmpty().withMessage('Password obligatorio').run(req);
  await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req);
  if (!ValidarClave(req.body.password, req.body.repetir_password)) {
    await check(req.body.repetir_password).equals(req.body.password).withMessage('Los passwords no son iguales').run(req);
  }

  const resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    return res.render('auth/reset-password', {
      tituloPagina: 'Reestablece tu password',
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;
  const usuario = await Usuario.findOne({ where: { token } });

  const salt = await bcrypt.genSalt(16);
  usuario.password = await bcrypt.hash(password, salt);

  usuario.token = null;
  await usuario.save();
  res.render('auth/cuenta-confirmada', {
    tituloPagina: 'Password Reestablecido',
    mensaje: 'El password ha sido reestablecido. ',
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
  confirmar,
  resetPassword,
  nuevoPassword,
  comprobarToken,
  autenticarLogin,
};
