// @ts-nocheck
import { Game, GamePlan } from '../db/dbConnection';
import crypto from 'crypto';
import moment from 'moment';

class ActiveGame {
	gameId: string;
	gamePlan: typeof GamePlan;
	isGameActive: boolean; //if true game can be started/ended if false its paused/archived
	duaration: number;
	isGameArchived: boolean = false; //cant be unpaused, will only show in archived games
	isStarted: boolean = false; //current state of game
	players = [];

	constructor(gamePlan: typeof GamePlan) {
		//perhaps instead of passing an object, pass the id and do a query to fill fields
		console.log('gamePlan gameDuration ', gamePlan);
		console.log('gamePlan gameDuration ', gamePlan.gameDuration);
		this.gameId = crypto.randomUUID();
		this.gamePlan = gamePlan;
		this.duaration = 60; //gamePlan.gameDuration;
		this.isGameActive = true;
		this.saveActiveGame(gamePlan);
	}

	get getIsGameActivated() {
		return this.isGameActive;
	}

	get getActiveGameId() {
		return this.gameId;
	}

	// get getActiveGameOwnerId() {
	// 	return this.gameId.ownerId;
	// }

	async startGame(): Promise<void> {
		const filter = { _id: this.gameId };
		const now = moment();
		const update = {
			gameStartTime: now,
			gameEndTime: now.add(this.duaration, 'minutes')
		};
		const options = { sort: { _id: 1 }, new: true, overwrite: true };

		try {
			await Game.findOneAndUpdate(filter, update, options);
			this.isStarted = true;
		} catch (error) {
			console.log(error);
		}
	}

	async saveActiveGame(gamePlan: typeof GamePlan): Promise<void> {
		const newGameData = {
			gamePlan: gamePlan,
			gameId: this.gameId,
			gameStartTime: null,
			gameEndTime: null,
			players: []
		};
		try {
			await Game.create(newGameData);
		} catch (error) {
			console.log(error);
		}
	}
}

export default ActiveGame;
