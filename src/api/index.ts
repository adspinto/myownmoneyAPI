import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import agendash from './routes/agendash';
import income from './routes/income';
import expense from './routes/expense';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	agendash(app);
	income(app);
	expense(app);

	return app
}