// Core
import express, { Request, Response, NextFunction, urlencoded, json } from 'express';

// DB - Settings
import { AppDataSource } from "./data-source";

// Controllers
import controllerUsers from './controllers/users';

// Other
import cors from 'cors';
import morgan from 'morgan';

AppDataSource.initialize()
  .then(async () => {
    // Starting Configs
    const app = express();
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use(cors<Request>());
    app.use(morgan('dev'));

    // Calling Routes
    app.use('/users', controllerUsers);

    // Handling unmatched endpoints
    app.use((req: Request, res: Response, next: NextFunction) => {
      const message = "Rota não encontrada";
      const status = 404;
      next({ message, status });
    });

    // Generic error treatment (You can pass a "status" and a "message")
    app.use((erro, req: Request, res: Response, next: NextFunction) => {
      res.status(erro.status || 500);
      res.json({
        erro: {
          status: erro.status || 500,
          mensagem: erro.message,
        },
      });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => console.log(error));
