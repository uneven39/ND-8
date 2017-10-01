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

  // 2.1 - В классе чата ChatApp добавить метод close
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
// 1.1 - доп. обработчик
function prepareToAnswer() {
	console.log('Готовлюсь к ответу');
}

// 2.2 - обработчик закрытия
function chatOnClose(chatName) {
  console.log(`Чат ${chatName} закрылся :(`);
}


// 1.1 - Добавить обработчик события message для Чата Вебинара (webinarChat)
webinarChat.on('message', prepareToAnswer);
webinarChat.on('message', chatOnMessage);

facebookChat.on('message', chatOnMessage);

// 1.2 - Для Вконтакте (vkChat) установить максимальное количество обработчиков событий, равное 2
vkChat.setMaxListeners(2);
// 1.3 - Добавить обработчик 'Готовлюсь к ответу' из пункта 1.1 к чату Вконтакте
vkChat.on('message', prepareToAnswer);
vkChat.on('message', chatOnMessage);
// 2.2 - Для чата вконтакте (vkChat) добавить обработчик close
vkChat.on('close', chatOnClose);


// Закрыть вконтакте
setTimeout( ()=> {
  console.log('Закрываю вконтакте...');
  // 2.3 - Вызывать у чата вконтакте метод close()
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