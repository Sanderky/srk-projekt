import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import passportLocalMongoose from 'passport-local-mongoose';
const UserScheme = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	roles: {
		type: [],
		required: true
	}
});

UserScheme.plugin(passportLocalMongoose);
export default mongoose.model('User', UserScheme);
