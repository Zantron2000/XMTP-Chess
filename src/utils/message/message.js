import { CONNECT_STATUS, DEV_MODE, MESSAGE } from "../enum";

export const isHashContent = (content, hash) => {
    return content.startsWith(hash + MESSAGE.HASH_DELIMITER);
}

export const hasHash = (content) => {
    const hash = content.split(MESSAGE.HASH_DELIMITER)[0];

    return hash?.length === MESSAGE.HASH_LENGTH && hash.match(/^[a-zA-Z0-9]{5}/) !== null;
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

            if (DEV_MODE) {
                convoMessages.push(message);
            }
        } else if (!hasHash(message.content)) {
            convoMessages.push(message);
        }
    });

    return { gameMessages, convoMessages };
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

export const isGameContent = (content) => {
    const data = getContent(content);

    if (!data) return false;

    const components = data.split(MESSAGE.GAME_DELIMITER);

    // Should be 64-80 characters long, made up of characters A-H, 1-8, or KQRBNPX
    const boardPattern = /^([A-H1-8KQRBNPX]{64,80})$/;

    // Should be 1 character long, made up of characters W or B
    const playerPattern = /^[WB]$/;

    // Should be 1 character long, made up of characters T or F
    const canCastlePattern = /^[TF]{4}$/;

    return components.length === 3 &&
        components[0].match(boardPattern) !== null &&
        components[1].match(playerPattern) !== null &&
        components[2].match(canCastlePattern) !== null;
}

export const isConnectStatus = (content) => {
    const data = getContent(content);
    const [connectStatus] = data?.split(MESSAGE.GAME_DELIMITER);

    return connectStatus && Object.values(CONNECT_STATUS).includes(connectStatus);
}

export const findMostRecentGameMessages = (messages, hash) => {
    const gameMessages = [];

    for (let i = messages.length - 1; i >= 0; i--) {
        if (gameMessages.length === 2) {
            break;
        } else if (isHashContent(messages[i].content, hash) && isGameContent(messages[i].content)) {
            const gameContent = getContent(messages[i].content);
            gameMessages.unshift(gameContent);
        }
    }

    return gameMessages;
}