// @ts-nocheck
import { User } from '../db/dbConnection';
import bcrypt from 'bcryptjs';
import type express from 'express';
import type { NextFunction } from 'express';

declare module 'express-session' {
	export interface SessionData {
		userId: { [key: string]: any };
	}
}

export async function createUser(req: express.Request, res: express.Response, next: NextFunction) {
	try {
		const { email, password, role } = req.body;
		const re = /\S+@\S+\.\S+/;
		if (re.test(email) && password.length > 4) {
			const user = await User.findOne({ email: email });
			if (!user) {
				let createUser = new User({
					email: email,
					password: bcrypt.hashSync(password, 10),
					role: role
				});
				await User.create(createUser);
				//send to login
				res.status(201).send({ message: 'User created' });
			} else {
				res.status(403).send({ error: 'User already exists' });
				//send to login
			}
		} else {
			res.status(406).send({ error: 'Email or password not acceptable' });
		}
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

export async function loginUser(req: express.Request, res: express.Response, next: NextFunction) {
	try {
		const { email, password } = req.body;
		if (email && password) {
			const user = await User.findOne({ email: email });
			//const userId = ObjectId(user._id).valueOf();
			//console.log("user ", user);
			if (user) {
				const isPasswordvalid = await bcrypt.compare(password, user.password);
				if (isPasswordvalid) {
					req.session.regenerate(async function (err) {
						if (err) next(err);
						// store user information in session, typically a user id
						const sessionUser = {
							id: user._id.toString(),
							email: user.email,
							role: user.role
						};
						req.session!.user = sessionUser;
						console.log('AT LOGIN req.session.user', req.session.user);
						// save the session before redirection to ensure page
						// load does not happen before session is saved
						await req.session.save(function (err) {
							if (err) return next(err);
							console.log('User logged in, cookie sent'); //load FE in http://localhost:5173/, not http://127.0.0.1:5173/
							//res.redirect("/"); //redirects here after login
							res.status(200).send({ message: 'User logged in' });
						});
					});
				} else {
					res.status(401).send({ error: 'Wrong password' });
				}
			} else {
				res.status(404).send({ error: 'User does not exist' });
			}
		} else {
			res.status(411).send({ error: 'Email or password field empty' });
		}
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

//:TODO
//user patch self (user)
//user patch any (admin)

//delete self (user)
//delete any (admin)

//FIND TEST ENDPOINTS BELOW - > REMOVE LATER
export async function publicdataUser(
	req: express.Request,
	res: express.Response,
	next: NextFunction
) {
	try {
		console.log('PD req.session.cookie ', req.session.cookie);
		console.log('PD req.sessionID ', req.sessionID);
		console.log('PD req.session.user ', req.session.user);

		const message = {
			alert: 'Public data',
			data: 'This is PUBLIC data visible without logging in',
			userId: req.session.userId
		};
		console.log('public data accessed');
		res.status(200).send({ message: message });
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

export async function userdataUser(
	req: express.Request,
	res: express.Response,
	next: NextFunction
) {
	try {
		console.log('UD req.session.cookie ', req.session.cookie);
		console.log('UD req.sessionID ', req.sessionID);
		console.log('UD req.session.user ', req.session.user);

		const message = {
			alert: 'User data',
			data: 'This is USER data, available only to role: user',
			userId: req.session.userId
		};
		console.log('user data accessed');
		res.status(200).send({ message: message });
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

export async function admindataUser(
	req: express.Request,
	res: express.Response,
	next: NextFunction
) {
	try {
		console.log('AD req.session.cookie ', req.session.cookie);
		console.log('AD req.sessionID ', req.sessionID);
		console.log('AD req.session.user ', req.session.user);

		const message = {
			alert: 'Admin data',
			data: 'This is ADMIN data, available only to role: admin',
			userId: req.session.userId
		};
		console.log('admin data accessed');
		res.status(200).send({ message: message });
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

export async function logoutUser(req: express.Request, res: express.Response, next: NextFunction) {
	req.session.user = null;
	req.session.save(function (err) {
		if (err) next(err);

		// regenerate the session, which is good practice to help
		// guard against forms of session fixation
		req.session.regenerate(function (err) {
			if (err) next(err);
			//res.redirect("/");
		});
	});
	console.log({ message: 'User logged out' });
	return res.clearCookie('connect.sid').send({ message: 'User logged out' });
}
