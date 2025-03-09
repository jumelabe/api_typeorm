import { Request, Response } from "express";
import { AppDataSource } from "../config/db.config";
import { User } from "../entity/user.entity";
import * as bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

// Example controller methods (you'll need to implement the actual business logic)
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userRepository.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const user = await userRepository.findOneBy({ id: id });
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request
    if (req.body.password !== req.body.confirmPassword) {
      res.status(400).json({ message: "Passwords don't match" });
      return;
    }

    // Create a new user object
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.role = req.body.role;
    
    // Hash password
    user.passwordHash = await bcrypt.hash(req.body.password, 10);
    
    // Save user
    const result = await userRepository.save(user);
    
    // Remove passwordHash from response
    const { passwordHash, ...userWithoutPassword } = result;
    res.status(201).json(userWithoutPassword);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const user = await userRepository.findOneBy({ id: id });
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    // If password is being updated
    if (req.body.password) {
      if (req.body.password !== req.body.confirmPassword) {
        res.status(400).json({ message: "Passwords don't match" });
        return;
      }
      req.body.passwordHash = await bcrypt.hash(req.body.password, 10);
      
      // Remove password and confirmPassword from body
      delete req.body.password;
      delete req.body.confirmPassword;
    }
    
    userRepository.merge(user, req.body);
    const result = await userRepository.save(user);
    
    // Remove passwordHash from response
    const { passwordHash, ...userWithoutPassword } = result;
    res.json(userWithoutPassword);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const result = await userRepository.delete(id);
    
    if (result.affected === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 