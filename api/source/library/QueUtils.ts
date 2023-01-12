import 'module-alias/register';
import Que from '@/models/Que';
import Ticket from '@/models/Ticket';
import Log from '@/library/Logging';

export { casadeDeleteQue };

const casadeDeleteQue = async (queId: string) => {
	const que = await Que.findById(queId);
	if (!que) {
		throw new Error('Que with given ID does not exist.');
	} else {
		await Ticket.deleteMany({ queId: queId });
		Log.info(`Successfully deleted tickets linked to que: ${queId}.`);
	}
};
