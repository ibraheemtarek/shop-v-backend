import express from 'express';
import { csrfProtect } from '../middleware/csrfMiddleware';
import { loginUser, refreshToken, logoutUser } from '../controllers/authController';
import { asyncHandler } from '../utils/routeUtils';
import { loginValidation } from '../middleware/validators/userValidators';
import { refreshTokenValidation, logoutValidation } from '../middleware/validators/authValidators';
import { validate } from '../middleware/validators/validatorUtils';

const router = express.Router();

router.post('/login', csrfProtect, validate(loginValidation), asyncHandler(loginUser));
router.post('/refresh', csrfProtect, validate(refreshTokenValidation), asyncHandler(refreshToken));
router.post('/logout', csrfProtect, validate(logoutValidation), asyncHandler(logoutUser));

export default router;