const EventEmitter = require('events');

class ChatApp extends EventEmitter {
  /**
   * @param {String} title
   */
  constructor(title) {
    super();

    this.title = title;

    // Посылать каждую секунду сообщение
    setInterval(() => {
      this.emit('message', `${this.title}: ping-pong`);
  }, 1000);
  }

  close() {
    this.emit('close', this.title);
  }
}

let webinarChat =  new ChatApp('webinar');
let facebookChat = new ChatApp('=========facebook');
let vkChat =       new ChatApp('---------vk');

let chatOnMessage = (message) => {
  console.log(message);
  console.log('');
};

function prepareToAnswer() {
	console.log('Готовлюсь к ответу');
}

function chatOnClose(chatName) {
  console.log(`Чат ${chatName} закрылся :(`);
}

webinarChat.on('message', prepareToAnswer);
webinarChat.on('message', chatOnMessage);

facebookChat.on('message', chatOnMessage);

vkChat.setMaxListeners(2);
vkChat.on('message', prepareToAnswer);
vkChat.on('message', chatOnMessage);
vkChat.on('close', chatOnClose);


// Закрыть вконтакте
setTimeout( ()=> {
  console.log('Закрываю вконтакте...');
  vkChat.close();
  vkChat.removeListener('message', chatOnMessage);
  vkChat.removeListener('message', prepareToAnswer);
}, 10000 );


// Закрыть фейсбук
setTimeout( ()=> {
  console.log('Закрываю фейсбук, все внимание — вебинару!');
  facebookChat.removeListener('message', chatOnMessage);
}, 15000 );


// Закрываем вебинар
setTimeout( () => {
	console.log('Закрываю вебинар...');
	webinarChat.removeListener('message', chatOnMessage);
	// webinarChat.removeListener('message', prepareToAnswer);
}, 30000 );