import { Router } from 'express';
import { adminCheck, emptyObejctCheck } from '../middlewares';
import { productService } from '../services';

const router = Router();

router.post('/', adminCheck, emptyObejctCheck, async (req, res, next) => {
      try {
        const {
            name,
            price,
            stock,
            description,
            images,
            categoryId,
        } = req.body;
        const newProduct = await productService.addProduct({
            name,
            price,
            stock,
            description,
            images,
            category: categoryId,
        });
  
        res.status(201).json(newProduct);
      } catch (error) {
        next(error);
      }
    }
);

router.get('/', async function (req, res, next) {
    try {
      const categoryId = req.query.categoryId;
      const page = req.query.page;
      const perPage = req.query.perPage;
      let products;
  
      if (categoryId) {
        products = await productService.getProductsByCategoryId(categoryId);
      } else {
        products = await productService.getProducts(page, perPage);
      }
  
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
});

router.get('/:productId', async function (req, res, next) {
    try {
      const productId = req.params.productId;
      const product = await productService.getProduct(productId);
  
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
});

router.put('/:productId', adminCheck, emptyObejctCheck, async function (req, res, next) {
      try {
        const productId = req.params.productId;
        const {
            name,
            price,
            stock,
            description,
            images,
            categoryId,
        } = req.body;
        const productInfoRequired = { productId };
        const toUpdate = {
            ...(name && { name }),
            ...(price && { price }),
            ...(stock && { stock }),
            ...(description && { description }),
            ...(images && { images }),
            ...(categoryId && { category: categoryId }),
        };
        const updatedProductInfo = await productService.updateProduct(
            productInfoRequired,
            toUpdate
        );
  
        res.status(200).json(updatedProductInfo);
      } catch (error) {
        next(error);
      }
    }
);

router.delete('/:productId', adminCheck, async function (req, res, next) {
      try {
        const productId = req.params.productId;
        const product = await productService.removeProduct(productId);
  
        res.status(200).json(product);
      } catch (error) {
        next(error);
      }
    }
);

export { productRouter };