import { Router } from "express";
import { login, register, verifyUser } from "../controladores/auths";
import { check } from "express-validator";
import { searchError } from "../middlewares/searchError";
import { checkEmail } from "../helpers/validacionesDB";
import { verify } from "crypto";

const router = Router()

router.post(
    "/register",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("email", "El email es obligatorio").isEmail(),
        check("password", "El password debe tener 6 caracteres minimo").isLength({
            min: 6
        }),
        check("email").custom(checkEmail),
        searchError
    ],
    register
);

router.post(
    "/login",
    [
        check("email", "El mail es obligatorio").not().isEmpty(),
        check("email", "El mail no es válido").isEmail(),
        check("password", "El password debe tener 6 caracteres como mínimo").isLength({
            min: 6
        }),
        searchError
    ],
    login
)

router.patch(
    "/verify",
    [
        check("email", "El mail es obligatorio").not().isEmpty(),
        check("email", "El mail no es válido").isEmail(),
        check("code").not().isEmpty(),
        searchError
    ],
    verifyUser
)

export default router