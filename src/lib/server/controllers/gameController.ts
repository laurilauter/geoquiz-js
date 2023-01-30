// @ts-nocheck
import { GamePlan } from '../db/dbConnection';
import { Game } from '../db/dbConnection';
import ActiveGame from '../classes/ActiveGame';
import type express from 'express';
const baseUrl = process.env.VITE_AXIOS_BASE_URL_DEV;

let currentGame: any;
//import moment from "moment";

//ENDPOINTS

//activate game
//join game
//accept player
//start game
//end game

//check game time //or should this be streamed to client via WS?
//check answer
//check ranking

//req -> gamePlan id, res -> joining link

export async function activateGame(req: express.Request, res: express.Response): Promise<void> {
	try {
		const { gamePlanId } = req.body;
		let foundGamePlan = await GamePlan.findOne({ _id: gamePlanId });
		if (foundGamePlan) {
			//check if any games are running with this id and owner
			let foundGame = await Game.findOne({ _id: foundGamePlan!._id.toString() });
			console.log('foundGamePlan.ownerId ', foundGamePlan.ownerId);
			//console.log('foundGame!.ownerId ', foundGame.gamePlan.ownerId);
			//if (foundGamePlan.ownerId !== foundGame!.gamePlan!.ownerId) {
			if (foundGamePlan) {
				currentGame = new ActiveGame(foundGamePlan);
				console.log(' currentGame', currentGame);
				//make this link a QR code for the game master in the client
				res.status(200).send({
					joinUrl: baseUrl + '/join/' + currentGame.getActiveGameId
					//this could be a separate endpoint in case th eowner needs
					//to get the link again without relaunching the game
				});
			} else {
				res.status(403).send({ error: 'The user is already hosting this game' });
			}
		} else {
			res.status(404).send({ error: 'Game Plan not found' });
		}
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

//Fix this
export async function setName(req: express.Request, res: express.Response): Promise<void> {
	const { name } = req.body;
	try {
		if (name) {
			//try to get an active game with the id and register a name on it
			console.log(`${name} received`); //add player instance with given name to ActiveGame
			//res.status(200).send({ message: "all good" });
			res.redirect('/'); //  "/gamestart" or something
		} else {
			res.status(404).send({ error: 'No active game with this Id' });
		}
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

//JOIN LINK shoul be handled in FE
// export async function joinGame(req: express.Request, res: express.Response) {
// 	console.log('currentGame ', currentGame.activeGameId);
// 	console.log('req.params.id  ', req.params.id);
// 	console.log('req.body.name ', req.body.name);
// 	try {
// 		if (req.params.id === currentGame.activeGameId) {
// 			console.log('Redirected to enter your name');
// 			res.status(200).send({ message: 'all good' });
// 			//res.redirect("/join"); //redirects here after login
// 		} else {
// 			res.status(404).send({ error: 'No active game with this Id' });
// 		}
// 	} catch (error) {
// 		res.status(500).send({ error: error });
// 	}
// }
