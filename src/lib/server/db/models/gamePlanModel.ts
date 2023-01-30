import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const GamePlanSchema = new Schema({
	gameTitle: { type: String, required: true },
	gameMap: { type: String },
	ownerId: { type: String, required: true },
	gameDuration: { type: Number, required: true }, //minutes
	markers: [{ type: String }]
});

const GamePlan = mongoose.model('GamePlan', GamePlanSchema);

export default GamePlan;
