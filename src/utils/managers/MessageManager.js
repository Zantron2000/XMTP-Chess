import { createGameMessage, filterMessages, generateHash, getContent } from "../message/message";

class MessageManager {
    constructor(conversation, messages, playerAddr, hash = generateHash()) {
        const { gameMessages, convoMessages } = filterMessages(messages, hash);

        this.conversation = conversation;
        this.gameMessages = gameMessages;
        this.convoMessages = convoMessages;
        this.playerAddr = playerAddr;
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
        if (!content.startsWith(this.hash)) {
            sendMessageFn(this.conversation, content);
        }
    }

    extractContent() {
        return this.gameMessages.map((message) => {
            return getContent(message.content);
        })
    }

    includeImage(message, prevMessage) {
        if (!prevMessage || prevMessage.senderAddress !== message.senderAddress) {
            return true;
        }
    }

    getDisplayDetails() {
        const details = [];

        this.convoMessages.forEach((message, index) => {
            const prevMessage = this.convoMessages[index - 1];
            const includeImage = this.includeImage(message, prevMessage);

            details.push({
                content: message.content,
                includeImage,
                isPlayer: message.senderAddress === this.playerAddr,
            });
        });

        return details;
    }
}

export default MessageManager;
