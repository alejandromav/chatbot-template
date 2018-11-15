/*globals module*/

module.exports = {
	writeWithDelay: (session, text, time=2000) => {
		return new Promise(resolve => {
			session.sendTyping();
			setTimeout(() => resolve(session.send(text)), time);
		});
	}
};
