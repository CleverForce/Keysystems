// функция создает сообщения
function createMsg(ObjMsg, userId, withHeader = true) {
    let newMsg = document.createElement('div')
    newMsg.classList.add('msg')
    if (userId == ObjMsg['from_user']['id']) {
        newMsg.classList.add('msgFromMe')
    } else {
        newMsg.classList.add('msgFromHim')
    }

    if (withHeader == true) {
        let headerMsg = document.createElement('div')
        headerMsg.classList.add('header_msg')
        newMsg.appendChild(headerMsg)

        let fromMsg = document.createElement('p')
        fromMsg.classList.add('from_msg')
        fromMsg.innerHTML = ObjMsg['from_user']['full_name']
        headerMsg.appendChild(fromMsg)

        let timeMsg = document.createElement('p')
        timeMsg.classList.add('time_msg')
        timeMsg.innerHTML = ObjMsg['time']
        headerMsg.appendChild(timeMsg)
    }

    let contextMsg = document.createElement('div')
    contextMsg.classList.add('context_msg')
    contextMsg.innerHTML = ObjMsg['text']
    newMsg.appendChild(contextMsg)

    return newMsg
}

// функция создает чат
function createChat(selector, arr_message, userId) {
    let lastUser = 0
    let chat_message = document.createElement('div')
    chat_message.classList.add('chat_msg_item')
    if (arr_message[0]['chat'] == BASE.CLIENT) {
        chat_message.setAttribute('id', idOfChat.clientChat)
    } else {
        chat_message.setAttribute('id', idOfChat.curatorChat)
    }

    // chat_message.setAttribute('id', `area_chat_${arr_message[0]['chat']}`)
    for (let i = 0; i < arr_message.length; i++) {
        let withHeader = true
        if (i > 0 && arr_message[i]['from_user']['id'] == arr_message[i - 1]['from_user']['id']) {
            withHeader = false
        }
        let newMsg = createMsg(arr_message[i], userId, withHeader)
        chat_message.appendChild(newMsg)
        lastUser = arr_message[i]['from_user']['id']
    }

    document.querySelector(selector).appendChild(chat_message);

    return chat_message
    // chat_message.scrollTop = chat_message.scrollHeight;
}



function initOrderSocket(roomName, userId) {
    // const roomName = JSON.parse(document.getElementById('room-name').textContent);

        const chatSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/chat/'
            + roomName
            + '/'
        );

        chatSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);

            let withHeader = true
            // if (lastUser == data.message.from_user.id) {
            //     withHeader = false
            // }
            let newMsg = createMsg(data.message, userId, withHeader)
            let chat_message = document.querySelector('.chat_msg_item')
            chat_message.appendChild(newMsg)

            // Прокрутка вниз при получении нового сообщения
            chat_message.scrollTop = chat_message.scrollHeight;

            // lastUser = data.message.from_user.id
        };

        chatSocket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };

        document.querySelector('#client-msg-input').focus();
        document.querySelector('#client-msg-input').onkeyup = function (e) {
            if (e.key === 'Enter') {  // enter, return
                document.querySelector('#client-msg-submit').click();
            }
        };

        document.querySelector('#client-msg-submit').onclick = function (e) {
            const messageInputDom = document.querySelector('#client-msg-input');
            const message = messageInputDom.value;
            chatSocket.send(JSON.stringify({
                'message': message
            }));
            messageInputDom.value = '';
        };
}