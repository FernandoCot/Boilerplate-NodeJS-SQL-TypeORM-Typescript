// Importing Core
import cors from 'cors';
import morgan from 'morgan';
import express, { Request, urlencoded, json } from 'express';

// Settings
import { AppDataSource } from "./data-source";

// Controllers
import controllerUsers from './controllers/users';

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
    app.use((req, res, next) => {
      const message = "Rota não encontrada";
      const status = 404;
      next({ message, status });
    });

    // Generic error treatment (You can pass "status" and "message")
    app.use((erro, req, res, next) => {
      res.status(erro.status || 500);
      res.json({
        erro: {
          status: erro.status || 500,
          mensagem: erro.message,
        },
      });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${3000}`));
  })
  .catch(error => console.log(error));
