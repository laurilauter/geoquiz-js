import mongoose from 'mongoose';
import User from './models/userModel.js';
import GamePlan from './models/gamePlanModel.js';
import Game from './models/gameModel.js';
import Player from './models/playerModel.js';
import Marker from './models/markerModel.js';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI2).then(() => {
	console.log('Connected to MongoDB');
});

export { User, GamePlan, Game, Player, Marker };
