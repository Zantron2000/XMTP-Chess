import { MESSAGE } from "../enum";

export const isHashContent = (content, hash) => {
    return content.startsWith(hash + MESSAGE.HASH_DELIMITER);
}

export const hasHash = (content) => {
    const hash = content.split(MESSAGE.HASH_DELIMITER)[0];

    return hash.length === MESSAGE.HASH_LENGTH && hash.match(/^[a-zA-Z0-9]{5}/) !== null;
}

export const getHash = (content) => {
    return content.split(MESSAGE.HASH_DELIMITER)[0];
}

export const getContent = (content) => {
    return content.split(MESSAGE.HASH_DELIMITER)[1];
}

export const filterMessages = (messages, hash) => {
    // TODO: Sort game messages by sentAt, only use most recent 2
    const gameMessages = [];
    const convoMessages = [];

    messages.forEach(message => {
        if (isHashContent(message.content, hash)) {
            gameMessages.push(message);
        } else {
            convoMessages.push(message);
        }
    });

    return { gameMessages, convoMessages };
}

export const sendMessage = async (sendMessageFn, conversation, content) => {
    return sendMessageFn(conversation, content)
}

export const createGameMessage = (hash, ...content) => {
    return hash + MESSAGE.HASH_DELIMITER + content.join(MESSAGE.GAME_DELIMITER);
}

export const generateHash = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let hash = '';
    for (let i = 0; i < MESSAGE.HASH_LENGTH; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}