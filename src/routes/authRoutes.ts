import express from 'express';
import { csrfProtect } from '../middleware/csrfMiddleware';
import { loginUser, refreshToken, logoutUser } from '../controllers/authController';
import { asyncHandler } from '../utils/routeUtils';
import { loginValidation } from '../middleware/validators/userValidators';
import { refreshTokenValidation, logoutValidation } from '../middleware/validators/authValidators';
import { validate } from '../middleware/validators/validatorUtils';
import { authLimiter } from '../middleware/rateLimitMiddleware';

const router = express.Router();

router.post('/login',authLimiter, validate(loginValidation), asyncHandler(loginUser));
router.post('/refresh',authLimiter, validate(refreshTokenValidation), asyncHandler(refreshToken));
router.post('/logout', validate(logoutValidation), asyncHandler(logoutUser));

export default router;