import { Request, Response } from 'express';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import { sendPasswordResetEmail } from '../utils/emailService';
import { generateAccessToken } from '../utils/tokenUtils';

// Interface for requests with user data
export interface AuthRequest extends Request {
  user?: IUser;
}

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' }); return;
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateAccessToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



// Get user profile
export const getUserProfile = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' }); return;
    }

    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' }); return;
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      
      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address,
        };
      }
      
      if (req.body.phone) {
        user.phone = req.body.phone;
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        phone: updatedUser.phone,
        token: generateAccessToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Add product to wishlist
export const addToWishlist = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' }); return;
    }

    const { productId } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' }); return;
    }
    
    // Check if product already in wishlist
    const alreadyInWishlist = user.wishlist.find(
      (item) => item.toString() === productId
    );
    
    if (alreadyInWishlist) {
      res.status(400).json({ message: 'Product already in wishlist' }); return;
    }
    
    user.wishlist.push(productId);
    await user.save();
    
    res.status(200).json({ message: 'Product added to wishlist' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' }); return;
    }

    const { productId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' }); return;
    }
    
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );
    
    await user.save();
    
    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get user wishlist
export const getWishlist = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).populate('wishlist');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user.wishlist);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found with this email' });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token expire time (1 hour)
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);

    // Save user with reset token info
    await user.save();

    // Send email with reset token
    try {
      await sendPasswordResetEmail(
        user.email,
        resetToken,
        `${user.firstName} ${user.lastName}`
      );

      res.status(200).json({
        message: 'Password reset email sent successfully',
      });
    } catch (emailError) {
      // If email sending fails, remove reset token from user
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500).json({ message: 'Failed to send reset email' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    if (!token || typeof token !== 'string') {
      res.status(400).json({ message: 'Token is required as a query parameter' });
      return;
    }

    // Hash the token from params to compare with stored token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with the hashed token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    // Set new password
    user.password = password;
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save user with new password
    await user.save();

    // Return success message and login token
    res.status(200).json({
      message: 'Password reset successful',
      token: generateAccessToken(user._id),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
