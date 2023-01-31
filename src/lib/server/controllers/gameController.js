// @ts-nocheck
import { GamePlan } from '../db/dbConnection.js';
import { Game } from '../db/dbConnection.js';
import ActiveGame from '../classes/ActiveGame.js';
const baseUrl = process.env.VITE_AXIOS_BASE_URL_DEV;

let currentGame;
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

export async function activateGame(req, res) {
	try {
		const { gamePlanId } = req.body;
		let foundGamePlan = await GamePlan.findOne({ _id: gamePlanId });
		if (foundGamePlan) {
			let foundGame = await Game.findOne({ gameOwnerId: foundGamePlan.ownerId });
			if (!foundGame) {
				currentGame = new ActiveGame(foundGamePlan);
				//make this link a QR code for the game master in the client
				res.status(200).send({
					joinUrl: baseUrl + '/join/' + currentGame.gameId
					//this could be a separate endpoint in case the owner needs
					//to get the link again without relaunching the game
				});
			} else {
				res.status(400).send({ error: 'The user is already hosting this game' });
			}
		} else {
			res.status(404).send({ error: 'Game Plan not found' });
		}
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

export async function shareJoinLink(req, res) {
	try {
		const { gameId } = req.body;
		let foundGame = await Game.findOne({ gameId: gameId });
		if (foundGame) {
			res.status(200).send({
				joinUrl: baseUrl + '/join/' + foundGame.gameId
				//this could be a separate endpoint in case the owner needs
				//to get the link again without relaunching the game
			});
		} else {
			res.status(404).send({ error: 'Game not found' });
		}
	} catch (error) {
		res.status(500).send({ error: error });
	}
}

//Fix this
export async function setName(req, res) {
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
