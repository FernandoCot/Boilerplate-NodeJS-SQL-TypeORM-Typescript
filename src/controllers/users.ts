// Core
import { Router, Request, Response } from 'express';

// Entities
import { User } from '../entity/User';

// Other
import { AppDataSource } from '../data-source';
import { encrypt, decrypt } from '../helpers/encodeData';
import { generateJWT, verifyToken } from '../helpers/jwt';
import { param, body, validationResult } from 'express-validator';

// Instances
const router = Router();
const userRepository = AppDataSource.manager.getRepository(User);

// Requests
router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find({
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    });

    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
});

router.get('/:id',
  [
    verifyToken,
    param('id')
      .notEmpty().withMessage("O parâmetro 'id' é obrigatório!")
      .isInt().withMessage("O parâmetro 'id' deve ser um inteiro!"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
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
    }
  });

router.delete('/:id',
  [
    verifyToken,
    param('id')
      .notEmpty().withMessage("O parâmetro 'id' é obrigatório!")
      .isInt().withMessage("O parâmetro 'id' deve ser um inteiro!"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
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
    }
  });

router.patch('/:id',
  [
    verifyToken,
    param('id')
      .notEmpty().withMessage("O parâmetro 'id' é obrigatório!")
      .isInt().withMessage("O parâmetro 'id' deve ser um inteiro!"),
    body('name')
      .notEmpty().withMessage("O campo 'nome' é obrigatório!")
      .isString().withMessage("O campo 'nome' deve ser uma string!"),
    body('email')
      .notEmpty().withMessage("O campo 'email' é obrigatório!")
      .isEmail().withMessage('Email inválido!'),
    body('password')
      .notEmpty().withMessage("O campo 'senha' é obrigatório!")
      .isString().withMessage("O campo 'senha' deve ser uma string!")
      .isLength({ min: 8, max: 8 }).withMessage('A senha deve ter 8 dígitos!'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
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
    }
  });

router.post('/sign_up',
  [
    body('name')
      .notEmpty().withMessage("O campo 'nome' é obrigatório!")
      .isString().withMessage("O campo 'nome' deve ser uma string!"),
    body('email')
      .notEmpty().withMessage("O campo 'email' é obrigatório!")
      .isEmail().withMessage('Email inválido!'),
    body('password')
      .notEmpty().withMessage("O campo 'senha' é obrigatório!")
      .isString().withMessage("O campo 'senha' deve ser uma string!")
      .isLength({ min: 8, max: 8 }).withMessage('A senha deve ter 8 dígitos!'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
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
    }
  });

router.post('/login',
  [
    body('email')
      .notEmpty().withMessage("O campo 'email' é obrigatório!")
      .isEmail().withMessage('Email inválido!'),
    body('password')
      .notEmpty().withMessage("O campo 'senha' é obrigatório!")
      .isString().withMessage("O campo 'senha' deve ser uma string!")
      .isLength({ min: 8, max: 8 }).withMessage('A senha deve ter 8 dígitos!'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
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
    }
  });

export default router;