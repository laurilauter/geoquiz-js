import GamePlan from './gamePlanModel';
import Player from './playerModel';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const gameSchema = new Schema({
	gamePlan: { type: GamePlan.schema },
	gameId: { type: String, required: true },
	gameStartTime: { type: Date },
	gameEndTime: { type: Date },
	players: { type: [Player.schema] } //array  of player ids?
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
