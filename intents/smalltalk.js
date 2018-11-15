/*globals require, module*/

const builder = require('botbuilder');
const log4js = require('log4js');
const logger = log4js.getLogger('INTENT:Smalltalk');
logger.level = 'debug';

// Libs
const Utils = require('../lib/utilities');

module.exports = {
	greetingController: session => {
		// Utils.writeWithDelay(session, 'Hola! En qué puedo ayudarte?');
		const msg = new builder.Message(session)
			.text('Hola! En qué puedo ayudarte?')
			.suggestedActions(builder.SuggestedActions.create(session, [
				builder.CardAction.imBack(session, 'Qué tiempo hace hoy?', 'Qué tiempo hace hoy?'),
				builder.CardAction.imBack(session, 'Previsión para mañana', 'Qué previsión hay para mañana?')
			]));

		session.userData.lastDialog = null;
		session.send(msg);
		session.endDialog();
	},
	helpController: session => {
		const msg = new builder.Message(session)
			.text('Puedes pedir información sobre el tiempo. Prueba a preguntarme algo!')
			.suggestedActions(builder.SuggestedActions.create(session, [
				builder.CardAction.imBack(session, 'Qué tiempo hace hoy?', 'Qué tiempo hace hoy?'),
				builder.CardAction.imBack(session, 'Previsión para mañana', 'Qué previsión hay para mañana?')
			]));

		session.userData.lastDialog = null;
		session.send(msg);
		session.endDialog();
	},
	thanksController: session => {
		Utils.writeWithDelay(session, 'De nada :)');
		session.endDialog();
	},
	cancelController: session => {
		Utils.writeWithDelay(session, 'Vale, mejor no.');
		session.endDialog();
	}
};
