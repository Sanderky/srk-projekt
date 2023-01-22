import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true, lowercase: true },
	password: { type: String, required: true },
	roles: { type: [], required: true },
	details: {},
	refreshToken: String
});

export default mongoose.model('User', UserSchema);
