function chatOnMessage(message) {
	console.log(message);
	console.log('');
}

function prepareToAnswer() {
	console.log('Готовлюсь к ответу');
}

function chatOnClose(chatName) {
	console.log(`Чат ${chatName} закрылся :(`);
}

module.exports = {
	chatOnMessage,
	chatOnClose,
	prepareToAnswer
};
