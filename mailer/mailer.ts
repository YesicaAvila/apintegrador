import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'curiositylibros@gmail.com',
        pass: 'ksbikihxmrbmhkqu'
    },
    from: 'curiositylibros@gmail.com',
    tls: {
        rejectUnauthorized: false // Aceptar certificados autofirmados
    }
});

export const sendEmail = async (to: string, code: string): Promise<void> => {

    const mailOptions = {
        from: '"Curiosity" curiositylibros@gmail.com',
        to,
        subject: 'Código de verificación para Curiosity',
        text: `
            Llegó tu código para Curiosity.
            El código es ${code}
        `
    }

    try {

        await transporter.sendMail(mailOptions);
        console.log("Correo electrónico enviado");

    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error)

    }
}