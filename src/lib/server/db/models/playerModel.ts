import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
	gameId: { type: String, required: true },
	name: { type: String, required: true },
	pointsTotal: { type: Number, required: true },
	markersFound: { type: Number, required: true }
	//gameId?
	//isApproved?
	//more?
});

const Player = mongoose.model('Player', PlayerSchema);

export default Player;
