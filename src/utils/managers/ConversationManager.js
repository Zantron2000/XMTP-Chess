import { CONNECT_STATUS, PIECE_COLORS } from "../enum";
import { getEnemyColor } from "../game/piece";
import { createGameMessage, getHash, isHashContent } from "../message/message";

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
     *  firstMove?: String,
     *  secondMove?: String,
     * }} load The load option data for loading a game
     * @param {String} playerAddr The address of the player
     */
    constructor(invite, accept, load, playerAddr) {
        this.invite = invite;
        this.accept = accept;
        this.load = load;
        this.playerAddr = playerAddr;
    }

    getRandomColor() {
        return Math.random() < 0.5 ? PIECE_COLORS.WHITE : PIECE_COLORS.BLACK;
    }

    sendInvite(sets) {
        if (!this.invite.hash) {
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

        const regexString = `^[a-zA-Z0-9]{5}-${CONNECT_STATUS.INVITE},[${PIECE_COLORS.WHITE}${PIECE_COLORS.BLACK}]$`;
        const hashRegex = new RegExp(regexString);
        if (hashRegex.test(message.content)) {
            return true;
        }

        return false;
    }

    updateInviteStatus(message, sets) {
        const isOpponentMsg = message.senderAddress !== this.playerAddr;

        if (this.invite.hash && isOpponentMsg) {
            const [connectStatus, opponentColor] = message.content.split(MESSAGE.GAME_DELIMITER);

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
            const [connectStatus, opponentColor] = message.content.split(MESSAGE.GAME_DELIMITER);

            if (connectStatus === CONNECT_STATUS.INVITE) {
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
        if (!this.accept.accepted) {
            this.accept.accepted = true;
            sets.setAccept({ ...this.accept, accepted: true });
            sets.setSendData(createGameMessage(this.accept.hash, CONNECT_STATUS.ACCEPT));
        }
    }

    processMessage(message, sets) {
        if (this.isInviteMessage(message)) {
            this.updateInviteStatus(message, sets);
        } else if (this.isAcceptMessage(message)) {
            this.updateAcceptStatus(message, sets);
        }
    }
}

export default ConversationManager;
