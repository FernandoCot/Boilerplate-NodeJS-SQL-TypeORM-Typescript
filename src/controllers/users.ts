// Core
import { Router, Request, Response } from 'express';

// Services
import { login, signUp, deleteUser, getAllUsers, getUserInfo, updateUser } from '../services/usersService';

// Other
import { verifyToken } from '../helpers/jwt';
import { param, body, validationResult } from 'express-validator';
import { validatorHandler } from '../helpers/expressValidatorHandler';

// Instances
const router = Router();

// Requests
router.get('/', verifyToken, async (req: Request, res: Response) => {
  return getAllUsers(res);
});

router.get('/:id',
  [
    verifyToken,
    param('id')
      .notEmpty().withMessage("O parâmetro 'id' é obrigatório!")
      .isInt().withMessage("O parâmetro 'id' deve ser um inteiro!"),
  ],
  async (req: Request, res: Response) => {
    return validatorHandler(validationResult(req), res, () => getUserInfo(req, res));
  });

router.delete('/:id',
  [
    verifyToken,
    param('id')
      .notEmpty().withMessage("O parâmetro 'id' é obrigatório!")
      .isInt().withMessage("O parâmetro 'id' deve ser um inteiro!"),
  ],
  async (req: Request, res: Response) => {
    return validatorHandler(validationResult(req), res, () => deleteUser(req, res));
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
    return validatorHandler(validationResult(req), res, () => updateUser(req, res));
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
    return validatorHandler(validationResult(req), res, () => signUp(req, res));
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
    return validatorHandler(validationResult(req), res, () => login(req, res));
  });

export default router;