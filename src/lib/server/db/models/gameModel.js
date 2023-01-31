import GamePlan from './gamePlanModel.js';
import Player from './playerModel.js';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const gameSchema = new Schema({
	gamePlan: { type: GamePlan.schema },
	gameId: { type: String, required: true },
	gameOwnerId: { type: String, required: true },
	gameStartTime: { type: Date },
	gameEndTime: { type: Date },
	players: { type: [Player.schema] } //array  of player ids?
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
