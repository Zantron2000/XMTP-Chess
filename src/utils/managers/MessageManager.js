import { createGameMessage, filterMessages, generateHash, getContent, sendMessage } from "../message/message";

class MessageManager {
    constructor(conversation, messages, hash = generateHash()) {
        const { gameMessages, convoMessages } = filterMessages(messages, hash);

        this.conversation = conversation;
        this.gameMessages = gameMessages;
        this.convoMessages = convoMessages;
        this.hash = hash;
    }

    getMessages() {
        return this.convoMessages;
    }

    getGameMessages() {
        return this.gameMessages;
    }

    sendGameMessage(sendMessageFn, ...content) {
        const message = createGameMessage(this.hash, ...content);

        sendMessage(sendMessageFn, this.conversation, message);
    }

    sendMessage(sendMessageFn, content) {
        sendMessage(sendMessageFn, this.conversation, content);
    }

    extractContent() {
        return this.gameMessages.map((message) => {
            return getContent(message.content);
        })
    }
}