import mongoose from 'mongoose';
import User from './models/userModel';
import GamePlan from './models/gamePlanModel';
import Game from './models/gameModel';
import Player from './models/playerModel';
import Marker from './models/markerModel';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', false);

//original
mongoose.connect(process.env.MONGO_URI2!).then(() => {
	console.log('Connected to MongoDB');
});

//works too
// const mongoPromise = mongoose.connect(process.env.MONGO_URI2!).then((m): any => {
// 	m.connection.getClient();
// 	console.log('Connected to MongoDB');
// });

// const mongoPromise = await mongoose.createConnection(process.env.MONGO_URI2!).asPromise();
// mongoPromise?.readyState; // 1, means Mongoose is connected

//export { User, GamePlan, ActiveGame, Player, Marker, mongoPromise };

export { User, GamePlan, Game, Player, Marker };
