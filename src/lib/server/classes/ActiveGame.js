// @ts-nocheck
import { Game, GamePlan } from '../db/dbConnection.js';
import crypto from 'crypto';
import moment from 'moment';

class ActiveGame {
	gameId;
	gameOwnerId;
	gamePlan;
	isGameActive;
	isGameArchived = false; //cant be unpaused, will only show in archived games
	isStarted = false;
	duaration;
	players = [];

	constructor(gamePlan) {
		this.gameId = crypto.randomUUID();
		this.gamePlan = gamePlan;
		this.gameOwnerId = gamePlan.ownerId;
		this.duaration = gamePlan.gameDuration;
		this.isGameActive = true;
		this.saveActiveGame(gamePlan);
	}

	get getIsGameActivated() {
		return this.isGameActive;
	}

	get getActiveGameId() {
		return this.gameId;
	}

	get getActiveGameOwnerId() {
		return this.gameId.ownerId;
	}

	async startGame() {
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

	async saveActiveGame(gamePlan) {
		const newGameData = {
			gamePlan: gamePlan,
			gameId: this.gameId,
			gameOwnerId: this.gameOwnerId,
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
