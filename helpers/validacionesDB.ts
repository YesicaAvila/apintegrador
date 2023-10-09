import { sendEmail } from "../mailer/mailer";
import Usuario, { IUser } from "../models/usuarios"

export const checkEmail = async (email:string): Promise<void> => {

    const checkEmail: IUser | null = await Usuario.findOne({email});

    if(checkEmail && checkEmail.verified) {
        throw new Error(`El correo ${email} ya fue registrado`)
    }

    if(checkEmail && !checkEmail.verified ) {
        await sendEmail(email, checkEmail.code as string)
        throw new Error(`El usuario ya está registrado. Se envio nuevamente el código de verificación a ${email}`)
    }

}