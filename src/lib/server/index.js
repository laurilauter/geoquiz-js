import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
//import { mongoPromise } from './db/dbConnection';

import userRouter from './routes/userRoutes.js';
import gamePlanRouter from './routes/gamePlanRoutes.js';
import gameRouter from './routes/gameRoutes.js';

import MongoStore from 'connect-mongo';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import * as dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT;
const secret = process.env.SESSION_SECRET;

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cookieParser());

//adjust client url for cors
let client_url = 'http://localhost:5173';
if (process.env.NODE_ENV === 'production') {
	client_url = 'http://geoquiz.eu-4.evennode.com/';
}

const corsOptions = {
	origin: client_url,
	credentials: true
};
app.use(cors(corsOptions));

app.use(
	session({
		secret: secret,
		resave: false,
		saveUninitialized: false,
		cookie: {
			sameSite: false,
			secure: false,
			maxAge: 10 * 60000,
			httpOnly: true
		}, //store session for 10 minutes
		store: MongoStore.create({
			client: mongoose.connection.getClient()
		})
	})
);

app.set('trust proxy', 1); // trust first proxy in production

app.use('/users', userRouter);
app.use('/game-plan', gamePlanRouter);
app.use('/game', gameRouter);

//serving public files, img and such
app.use('/', express.static(path.join(__dirname, '../public')));
//app.use('/', express.static(path.join(__dirname, '../dist')));

//serv static FE for all visitors
// app.get('/', (req, res) => {
// 	res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

// //serv static FE to JOIN the game //this FE page posts the users name to BE activeGame class
// app.get("/join", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/join.html"));
// });

app.listen(port, () => {
	console.log(`Server running at: http://localhost:${port}`);
});
