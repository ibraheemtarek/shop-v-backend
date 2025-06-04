import express from 'express';
import { loginUser, refreshToken, logoutUser } from '../controllers/authController';
import { asyncHandler } from '../utils/routeUtils';
import { loginValidation } from '../middleware/validators/userValidators';
import { refreshTokenValidation, logoutValidation } from '../middleware/validators/authValidators';
import { validate } from '../middleware/validators/validatorUtils';

const router = express.Router();

router.post('/login', validate(loginValidation), asyncHandler(loginUser));
router.post('/refresh', validate(refreshTokenValidation), asyncHandler(refreshToken));
router.post('/logout', validate(logoutValidation), asyncHandler(logoutUser));

export default router;