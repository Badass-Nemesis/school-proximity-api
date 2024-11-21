import { Router } from 'express';
import { addSchool, listSchools } from '../controllers/schoolController';
import { catchAsync } from '../utils/errorUtils';

const router = Router();

// adding School Route
router.post('/addSchool', catchAsync(addSchool));

// get schools Route
router.get('/listSchools', catchAsync(listSchools));

export default router