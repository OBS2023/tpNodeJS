import Joi from "joi";

export const productValidation = Joi.object<ProductRequest>({
    name: Joi.string()
        .min(3)
        .required(),
    price: Joi.number()
        .required(),
}).options({ abortEarly: false })

export interface ProductRequest {
    name: string,
    price: number
}

export const listProductValidation = Joi.object<ListProductRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    priceMax: Joi.number().min(1).optional()
})


export interface ListProductRequest {
    page?: number
    limit?: number
    priceMax?: number
}

export const updateProductValidation = Joi.object<UpdateProductRequest>({
    id: Joi.number().required(),
    price: Joi.number().min(1).optional()
})

export interface UpdateProductRequest {
    id: number
    price?: number
}

export const productIdValidation = Joi.object<ProductIdRequest>({
    id: Joi.number().required(),
})

export interface ProductIdRequest {
    id: number
}
