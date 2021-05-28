import * as express from 'express';
import * as path from 'path';
import { router as boardRouter } from 'resources/boards/board.router';
import { router as taskRouter } from 'resources/tasks/task.router';
import { router as userRouter } from 'resources/users/user.router';
import * as swaggerUI from 'swagger-ui-express';
import * as YAML from 'yamljs';

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

app.use(express.json());

app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/users', userRouter);
app.use('/boards', boardRouter);
boardRouter.use('/:boardId/tasks', taskRouter);
app.use('/tasks', taskRouter);

app.use((err, _req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  next();
});

export { app };