import express, { Request, Response } from "express";
import { listProductValidation as listProductsValidation, productIdValidation, ProductRequest, productValidation, updateProductValidation } from "./validators/product-validator";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";
import { AppDataSource } from "../database/database";
import { Product } from "../database/entities/collection";
import { ProductUsecase } from "../domain/product-usecase";

export const initRoutes = (app: express.Express) => {
    app.get("/health", (req: Request, res: Response) => {
        res.send({ "message": "hello world" })
    })

    app.post("/products", async (req: Request, res: Response) => {
        const validation = productValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const productRequest = validation.value
        const productRepo = AppDataSource.getRepository(Product)
        try {

            const productCreated = await productRepo.save(
                productRequest
            )
            res.status(201).send(productCreated)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/products", async (req: Request, res: Response) => {
        const validation = listProductsValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listProductRequest = validation.value
        let limit = 20
        if (listProductRequest.limit) {
            limit = listProductRequest.limit
        }
        const page = listProductRequest.page ?? 1

        try {
            const productUsecase = new ProductUsecase(AppDataSource);
            const listProducts = await productUsecase.listProduct({ ...listProductRequest, page, limit })
            res.status(200).send(listProducts)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.patch("/products/:id", async (req: Request, res: Response) => {

        const validation = updateProductValidation.validate({ ...req.params, ...req.body })

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateProductRequest = validation.value

        try {
            const productUsecase = new ProductUsecase(AppDataSource);
            const updatedProduct = await productUsecase.updateProduct(updateProductRequest.id, { ...updateProductRequest })
            if (updatedProduct === null) {
                res.status(404).send({ "error": `product ${updateProductRequest.id} not found` })
                return
            }
            res.status(200).send(updatedProduct)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/products/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = productIdValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const productId = validationResult.value

            const productRepository = AppDataSource.getRepository(Product)
            const product = await productRepository.findOneBy({ id: productId.id })
            if (product === null) {
                res.status(404).send({ "error": `product ${productId.id} not found` })
                return
            }
            res.status(200).send(product)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/products/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = productIdValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const productId = validationResult.value

            const productRepository = AppDataSource.getRepository(Product)
            const product = await productRepository.findOneBy({ id: productId.id })
            if (product === null) {
                res.status(404).send({ "error": `product ${productId.id} not found` })
                return
            }

            const productDeleted = await productRepository.remove(product)
            res.status(200).send(productDeleted)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
}