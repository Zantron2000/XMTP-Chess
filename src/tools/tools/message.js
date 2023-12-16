import { validateBoardMessage } from './translate.js';

const VALID_HASH_LENGTH = 5;

const VALID_HASH_CHARACTERS = /^[a-zA-Z0-9]*$/;

const VALID_GAME_MESSAGES = ['INVITE', 'CONNECT'];

export const isChessMessage = (message, hash) => message.startsWith(hash + '-');

/**
 * Checks to see if a message in a conversation is related to
 * an XMTP Chess game. It does this by checking to see if the
 * message has a hash at the beginning of it, and if the rest of the message
 * is either CONNECT, INVITE, or a board state.
 * 
 * @param {String} message The message to check
 */
export const isGameMessage = (message) => {
    console.log(message)
    const [hash, boardString] = message.split('-');

    if (!hash || !boardString) {
        return false;
    }

    if (hash.length !== VALID_HASH_LENGTH) {
        return false;
    }

    if (!hash.match(VALID_HASH_CHARACTERS)) {
        return false;
    }

    if (!VALID_GAME_MESSAGES.includes(boardString)) {
        return validateBoardMessage(message);
    }

    return true;
}