import { CONNECT_STATUS, MESSAGE, PIECE_COLORS } from "../enum";
import { getEnemyColor } from "../game/piece";
import { createGameMessage, generateHash, getContent, getHash, isGameInvite, isGameMove, isHashContent } from "../message/message";

class ConversationManager {
    /**
     * 
     * @param {{
     *  hash?: String,
     *  accepted: Boolean,
     *  color?: String,
     * }} invite The invite option data for starting a game
     * @param {{
     *  hash?: String,
     *  accepted: Boolean,
     *  color?: String,
     * }} accept The accept option data for starting a game
     * @param {{
     *  hash: String,
     *  color: String,
     *  lastMove: String,
     *  currMove: String,
     * }?} load The load option data for starting a game
     * @param {String} playerAddr The address of the player
     */
    constructor(invite, accept, load, playerAddr) {
        this.invite = invite;
        this.accept = accept;
        this.load = load;
        this.playerAddr = playerAddr;
    }

    getRandomColor() {
        const number = Math.random();

        return number < 0.5 ? PIECE_COLORS.WHITE : PIECE_COLORS.BLACK;
    }

    sendInvite(sets) {
        if (this.invite.hash == null) {
            const hash = generateHash();
            const color = this.getRandomColor();

            this.invite.hash = hash;
            this.invite.color = color;
            sets.setInvite({ accepted: false, hash, color });
            sets.setSendData(createGameMessage(hash, CONNECT_STATUS.INVITE, color));
        }
    }

    isInviteMessage(message) {
        if (this.invite.hash) {
            return isHashContent(message.content, this.invite.hash);
        }

        return false;
    }

    isAcceptMessage(message) {
        if (this.accept.hash) {
            return isHashContent(message.content, this.accept.hash);
        }

        return isGameInvite(message.content);
    }

    updateInviteStatus(message, sets) {
        const isOpponentMsg = message.senderAddress !== this.playerAddr;

        if (this.invite.hash && isOpponentMsg) {
            const content = getContent(message.content);
            const [connectStatus, opponentColor] = content.split(MESSAGE.GAME_DELIMITER);

            if (connectStatus === CONNECT_STATUS.ACCEPT && opponentColor !== this.invite.color) {
                this.invite.accepted = true;
                sets.setInvite({ ...this.invite, accepted: true });
            } else {
                this.invite.color = undefined;
                this.invite.hash = undefined;
                this.invite.accepted = false;
                sets.setInvite({ accepted: false, hash: undefined, color: undefined });
            }
        }
    }

    updateAcceptStatus(message, sets) {
        const isOpponentMsg = message.senderAddress !== this.playerAddr;

        if (!this.accept.hash && isOpponentMsg) {
            if (isGameInvite(message.content)) {
                const content = getContent(message.content);
                const [connectStatus, opponentColor] = content.split(MESSAGE.GAME_DELIMITER);
                const hash = getHash(message.content);
                const color = getEnemyColor(opponentColor);

                this.accept.hash = hash;
                this.accept.color = color;
                sets.setAccept({ accepted: false, hash, color });
            } else {
                this.accept.color = undefined;
                this.accept.hash = undefined;
                this.accept.accepted = false;
                sets.setAccept({ accepted: false, hash: undefined, color: undefined });
            }
        }
    }

    sendAccept(sets) {
        if (!this.accept.accepted || !this.accept.hash) {
            this.accept.accepted = true;
            sets.setAccept({ ...this.accept, accepted: true });
            sets.setSendData(createGameMessage(this.accept.hash, CONNECT_STATUS.ACCEPT, this.accept.color));
        }
    }

    sendDecline(sets) {
        if (this.accept.hash) {
            sets.setSendData(createGameMessage(this.accept.hash, CONNECT_STATUS.DECLINE));
            this.accept.color = undefined;
            this.accept.hash = undefined;
            this.accept.accepted = false;
            sets.setAccept({ accepted: false, hash: undefined, color: undefined });
        }
    }

    isGameMessage(messages) {
        return this.load && isGameMove(messages.content, this.load.hash);
    }

    updateLoadStatus(message, sets) {
        const contents = getContent(message.content);
        const [board, messageColor, castling] = contents.split(MESSAGE.GAME_DELIMITER);

        if (this.load.color === getEnemyColor(messageColor) && this.load.currMove !== contents) {
            this.load.lastMove = this.load.currMove;
            this.load.currMove = contents;

            sets.setLoad({ ...this.load });
        } else if (this.load.color === messageColor) {
            this.load = null

            sets.setLoad(null);
        }
    }

    processMessage(message, sets) {
        if (this.isInviteMessage(message)) {
            this.updateInviteStatus(message, sets);
        } else if (this.isAcceptMessage(message)) {
            this.updateAcceptStatus(message, sets);
        } else if (this.isGameMessage(message)) {
            this.updateLoadStatus(message, sets);
        }
    }
}

export default ConversationManager;
