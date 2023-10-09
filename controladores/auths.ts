import { Request, Response } from "express"
import Usuario, { IUser } from "../models/usuarios"
import  bcryptjs from "bcryptjs"
import { ROLES } from "../helpers/constantes"
import randomstring from "randomstring"
import { sendEmail } from "../mailer/mailer"
import { crearJWT } from "../helpers/jwt"


export const register = async (req: Request, res: Response) => {
    const {nombre, email, password, rol}: IUser = req.body

    const usuario = new Usuario({nombre, email, password, rol});

    const salt = bcryptjs.genSaltSync();

    usuario.password = bcryptjs.hashSync(password, salt);
    
    const adminKey = req.headers["admin-key"];

    if (adminKey === process.env.KEYFORADMIN) {
        usuario.rol = ROLES.admin
    }

    const newCode = randomstring.generate(6);

    usuario.code = newCode

    await usuario.save();

    await sendEmail(email, newCode);

    res.status(201).json({
        usuario
    })

}

export const login = async (req: Request, res: Response): Promise<void> => {

    const {email, password}: IUser = req.body;

    try  {
        const usuario = await Usuario.findOne({email});

        if(!usuario) {
            res.status(400).json({
                msg: "No se encontró el mail en la DB"
            });
            return
        }

        const validatePassword = bcryptjs.compareSync(password, usuario.password);

        if(!validatePassword) {
            res.status(401).json({
                msg: "La contraseña es incorrecta"
            });
            return;
        };

        const token = await crearJWT(usuario.id);

        res.status(202).json({
            usuario,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: "Error en el servidor"
        })

    }
}

export const verifyUser = async (req: Request, res: Response) => {

    const {email, code} = req.body;

    try {
        const usuario = await Usuario.findOne({email});

        if(!usuario) {
            res.status(404).json({
                msg: "No se encontró el mail en la DB"
            });
            return
        }
        if(usuario.verified) {
            res.status(400).json({
                msg: "El usuario está correctamente verificado"
            });
            return;
        }

        if(code !== usuario.code) {

            res.status(401).json({
                msg: "El código que ingresaste no es correcto"
            })
            return;

        };

        await Usuario.findOneAndUpdate(
            {email},
            {verified: true}
        );

        res.status(200).json({
            msg: "Usuario verificado con éxito"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error en el servidor"
        })
    }
}