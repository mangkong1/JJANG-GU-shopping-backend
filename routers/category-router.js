import { Router } from 'express';
import { adminCheck } from '../middlewares/adminCheck.js';
import { emptyObejctCheck } from '../middlewares/emptyObjectCheck.js';
import { categoryService } from '../services/category-service.js';

const router = Router();

router.post('/', adminCheck, emptyObejctCheck, async (req, res, next) => {
      try {
        const { name } = req.body;
        const newCategory = await categoryService.addCategory({ 
          name,
        });
  
        res.status(201).json(newCategory);
      } catch (error) {
        next(error);
      }
    }
);

router.get('/', async function (req, res, next) {
    try {
      const categories = await categoryService.getCategories();
  
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
});

router.get('/:categoryId', async function (req, res, next) {
    try {
      const categoryId = req.params.categoryId;
      const category = await categoryService.getCategory(categoryId);
  
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
});

router.put('/:categoryId', adminCheck, emptyObejctCheck, async function (req, res, next) {
      try {
        const categoryId = req.params.categoryId;
        const { name } = req.body;
        const categoryInfoRequired = { categoryId };
        const toUpdate = {
          ...(name && { name }),
        };
        const updatedCategoryInfo = await categoryService.updateCategory(
          categoryInfoRequired,
          toUpdate
        );
  
        res.status(200).json(updatedCategoryInfo);
      } catch (error) {
        next(error);
      }
    }
);

router.delete('/:categoryId', adminCheck, async function (req, res, next) {
      try {
        const categoryId = req.params.categoryId;
        const category = await categoryService.remove(categoryId);
  
        res.status(200).json(category);
      } catch (error) {
        next(error);
      }
    }
);

export { router };