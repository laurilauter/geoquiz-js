import express from 'express';
const userRouter = express.Router();
import * as userController from '../controllers/userController.js';
import bodyParser from 'body-parser';
userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({ extended: false }));

// middleware to test if authenticated and if role is user or admin
function isUser(req, res, next) {
	if (req.session.user) {
		if (req.session.user.role === 'user' || req.session.user.role === 'admin') {
			console.log('MW USER req.session.cookie', req.session.cookie);
			console.log('MW USER req.session.user', req.session.user);
			//for admin routes check req.session.userRole
			console.log('User in session');
			next();
		}
	} else {
		console.log('MW USER req.session.cookie', req.session.cookie);
		console.log('MW USER req.session.user', req.session.user);
		console.log('No user or admin in session');
		res.status(401).send({ error: 'Credentials missing' });
		//res.redirect("/"); //redirects to root after failed cookie check
	}
}

// middleware to test if authenticated and if role is admin
function isAdmin(req, res, next) {
	if (req.session.user) {
		if (req.session.user.role === 'admin') {
			console.log('MW ADMIN req.session.cookie', req.session.cookie);
			console.log('MW ADMIN req.session.user', req.session.user);
			//for admin routes check req.session.userRole
			console.log('Admin in session');
			next();
		}
	} else {
		console.log('MW ADMIN req.session.cookie', req.session.cookie);
		console.log('MW ADMIN req.session.user', req.session.user);
		console.log('No admin in session');
		res.status(401).send({ error: 'Credentials missing' });
		//res.redirect("/"); //redirects to root after failed cookie check
	}
}

userRouter.post('/register', userController.createUser);
//parhaps add endpoints to edit user details and to delete a user

//TODO: move these to /sessions/login /sesssions/logout
userRouter.post('/login', userController.loginUser);

userRouter.get('/logout', userController.logoutUser);

//TODO: remove these, they are just a proof of concept
userRouter.get('/publicdata', userController.publicdataUser);

userRouter.get('/userdata', isUser, userController.userdataUser);

userRouter.get('/admindata', isAdmin, userController.admindataUser);

export default userRouter;
