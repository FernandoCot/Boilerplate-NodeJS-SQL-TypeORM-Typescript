// Core
import { Request, Response } from 'express';

// Entities
import { User } from '../entity/User';

// Other
import { generateJWT } from '../helpers/jwt';
import { AppDataSource } from '../data-source';
import { encrypt, decrypt } from '../helpers/encodeData';

// Instances
const userRepository = AppDataSource.manager.getRepository(User);

// Actions
export const getAllUsers = async (res: Response) => {
  try {
    const users = await userRepository.find({
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    });

    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const singleUser = await userRepository.findOne({
      where: { id: parseInt(req.params.id, 10) },
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    });

    if (singleUser) {
      return res.status(200).json(singleUser);
    } else {
      return res.status(404).json('Usuário inexistente!');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const existentUser = await userRepository.findOne({
      where: { id: parseInt(req.params.id, 10) },
    });

    if (existentUser) {
      const hashedPassword = await encrypt(req.body.password);

      existentUser.name = req.body.name;
      existentUser.email = req.body.email;
      existentUser.password = hashedPassword;

      const updateSingleUser = await userRepository.save(existentUser);

      if (updateSingleUser) {
        return res.status(200).json('Usuário atualizado com sucesso!');
      } else {
        return res.status(404).json('Usuário inexistente!');
      }
    } else {
      return res.status(404).json('Usuário inexistente!');
    }
  } catch (err) {
    return res.status(500).end();
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleteSingleUser = await userRepository.delete(req.params.id);

    if (deleteSingleUser) {
      return res.status(200).json('Usuário deletado com sucesso!');
    } else {
      return res.status(404).json('Usuário inexistente!');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await userRepository.findOne({
      where: { email: req.body.email },
    });

    if (user) {
      const decryptedPass = await decrypt(req.body.password, user.password);

      if (decryptedPass) {
        return res.status(200).json({
          name: user.name,
          email: user.email,
          token: generateJWT(user),
        });
      } else {
        return res.status(404).json('Informações incorretas!');
      }
    } else {
      return res.status(404).json('Credenciais incorretas!');
    }
  } catch (err) {
    return res.status(404).json(err.errors);
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const existUser = await userRepository.findOne({
      where: { email: req.body.email },
    });

    if (existUser) {
      return res.status(409).json('Esse email já está sendo usado!');
    } else {
      const hashedPassword = await encrypt(req.body.password);

      const user = userRepository.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      await userRepository.save(user);

      return res.status(201).json({
        name: user.name,
        email: user.email,
        token: generateJWT(user),
      });
    }
  } catch (err) {
    return res.status(422).json(err.errors);
  }
};
