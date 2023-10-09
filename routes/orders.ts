import {Router} from "express"
import { createOrder, getOrders } from "../controladores/orders";
import validarJWT from "../middlewares/validarJWT";
import { searchError } from "../middlewares/searchError";
import { isVerified } from "../middlewares/verificados";
import { check } from "express-validator";

const router = Router();

router.get("/",
    [
        validarJWT,
        searchError
    ]
,getOrders)

router.post("/",
    [
        validarJWT,
        isVerified,
        check("price", "El precio es obligatorio").not().isEmpty(),
        check("shippingCost", "El costo es obligatorio").not().isEmpty(),
        check("total", "El total es obligatorio").not().isEmpty(),
        check("shippingDetails", "Los detalles de envio son obligatorios").not().isEmpty(),
        check("items", "El array de productos es obligatorio").not().isEmpty(),
        searchError
    ],
createOrder)

export default router