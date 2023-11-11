import { Router } from 'express';
import { adminCheck } from '../middlewares/adminCheck.js';
import { emptyObejctCheck } from '../middlewares/emptyObjectCheck.js';
import { productService } from '../services/product-service.js';
import multer from 'multer';

const productRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'views/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Math.floor(Math.random() * 1000000) + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

productRouter.post('/upload', upload.array('productImages', 10), async (req, res) => {
    let images = [];

    for (let i = 0; i < req.files.length; i++) {
      images.push(`/images/${req.files[i].filename}`);
    }

    res.json({ images });
  }
);


productRouter.post('/', adminCheck, emptyObejctCheck, async (req, res, next) => {
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

productRouter.get('/', async function (req, res, next) {
    try {
      const categoryId = req.query.categoryId;
      const page = req.query.page;
      const perPage = req.query.perPage;
      let products;
  
      if (categoryId) {
        products = await productService.getProductsByCategoryId(categoryId);
      } else {
        //products = await productService.getProducts(page, perPage);
	products = await productService.getProducts();
      }
  
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
});

productRouter.get('/:productId', async function (req, res, next) {
    try {
      const productId = req.params.productId;
      const product = await productService.getProduct(productId);
  
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
});

productRouter.put('/:productId', adminCheck, emptyObejctCheck, async function (req, res, next) {
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

productRouter.delete('/:productId', adminCheck, async function (req, res, next) {
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
