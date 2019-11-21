"use strict"

const ChatModel = {
    ws: null,
    newMsg: '',
    chatMessages: [],
    username: "",
    joined: false,
}
const sendMessage = () => {
    if (!!ChatModel.newMsg) {
        ChatModel.ws.send(
            JSON.stringify({
                username: ChatModel.username,
                message: ChatModel.newMsg,
            })
        )
        ChatModel.newMsg = '';
        const el = document.getElementById("chat");
        el.scrollTop = el.scrollHeight;
    }
}
const changeHandler = (e) => {
    switch (e.target.name) {
        case "message":
            ChatModel.newMsg = e.target.value;
            break;
        case "username":
            ChatModel.username = e.target.value;
            break;
        default:
            throw new Error();
    }
}
const joinChat = (e) => {
    e.preventDefault();
    if (!ChatModel.username) {
        return;
    }
    ChatModel.joined = true;
}
const Chat = {
    oninit: function () {
        ChatModel.ws = new WebSocket('ws://' + window.location.host + '/ws');
        ChatModel.ws.addEventListener('message', (e) => {
            const msg = JSON.parse(e.data);
            ChatModel.chatMessages.push({ content: `${msg.username} : ${msg.message}` });
            m.redraw();
        })
    },
    view: function () {
        return m("main", [
            m("h1.heading", "Go Chat"),
            m("ul.chat-messages", { id: "chat" }, ChatModel.chatMessages.map((msg) => {
                return m("span", msg.content);
            })),
            !ChatModel.joined && m(".input-box", [
                m("input", { name: "username", onchange: changeHandler, value: ChatModel.username }),
                m("button.button[type=button]", { onclick: joinChat }, "Join")
            ]),
            m(".input-box", [
                m("input", { name: "message", oninput: changeHandler, value: ChatModel.newMsg, disabled: !ChatModel.joined }),
                m("button.button[type=button]", { onclick: sendMessage }, "Submit")
            ])
        ])
    }
}
m.mount(document.body, Chat);