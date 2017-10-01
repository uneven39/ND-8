const ChatApp = require('./ChatApp');
const handlers = require('./handlers');

let webinarChat =  new ChatApp('webinar');
let facebookChat = new ChatApp('=========facebook');
let vkChat =       new ChatApp('---------vk');

webinarChat.on('message', handlers.prepareToAnswer);
webinarChat.on('message', handlers.chatOnMessage);

facebookChat.on('message', handlers.chatOnMessage);

vkChat.setMaxListeners(2);
vkChat.on('message', handlers.prepareToAnswer);
vkChat.on('message', handlers.chatOnMessage);
vkChat.on('close', handlers.chatOnClose);


// Закрыть вконтакте
setTimeout( ()=> {
	console.log('Закрываю вконтакте...');
	vkChat.close();
	vkChat.removeListener('message', handlers.chatOnMessage);
	vkChat.removeListener('message', handlers.prepareToAnswer);
}, 10000 );


// Закрыть фейсбук
setTimeout( ()=> {
	console.log('Закрываю фейсбук, все внимание — вебинару!');
	facebookChat.removeListener('message', handlers.chatOnMessage);
}, 15000 );


// Закрываем вебинар
setTimeout( () => {
	console.log('Закрываю вебинар...');
	webinarChat.removeListener('message', handlers.chatOnMessage);
	// webinarChat.removeListener('message', prepareToAnswer);
}, 30000 );