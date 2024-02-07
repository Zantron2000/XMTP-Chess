import { CONNECT_STATUS, MESSAGE } from "../enum";
import { getContent, isGameContent, isConnectStatus, createGameMessage } from "../message/message";
import BoardManager from "./BoardManager";

class GameManager {
    constructor(lastMove, currMove, status, playerAddr, playerColor, hash) {
        this.lastMove = lastMove;
        this.currMove = currMove;
        this.status = status;
        this.playerAddr = playerAddr;
        this.playerColor = playerColor;
        this.hash = hash;
    }

    determineStatus(sets, content, nextMessage) {
        if (this.isGameOver() || nextMessage.senderAddress === this.playerAddr) {
            return;
        }

        const [connectStatus,] = content.split(MESSAGE.GAME_DELIMITER);

        if (connectStatus === CONNECT_STATUS.GAME_OVER) {
            let determinedGameStatus = this.determineGameStatus();

            sets.setSendData(createGameMessage(this.hash, CONNECT_STATUS.GAME_OVER, determinedGameStatus));
        }
    }

    determineGameStatus() {
        const manager = new BoardManager(this.lastMove, this.currMove, undefined, this.status, this.playerColor);
        let gameStatus = undefined;

        manager.getStatus((status) => gameStatus = status, () => { }, () => { }, () => { });

        return gameStatus;
    }

    updateStatus(sets, nextMessage) {
        if (isGameContent(nextMessage.content)) {
            if (getContent(nextMessage.content) !== this.currMove) {
                sets.setLastMove(this.currMove);
                sets.setCurrMove(getContent(nextMessage.content));
                this.lastMove = this.currMove;
                this.currMove = getContent(nextMessage.content);
            }
        } else if (isConnectStatus(nextMessage.content)) {
            const content = getContent(nextMessage.content);

            this.determineStatus(sets, content, nextMessage);
        } else {
            sets.setStatus(CONNECT_STATUS.END);
        }
    }

    endGame(sets, gameStatus) {
        if (!this.isGameOver()) {
            this.status = CONNECT_STATUS.GAME_OVER;
            sets.setStatus(CONNECT_STATUS.GAME_OVER);

            sets.setSendData(createGameMessage(this.hash, this.status, gameStatus));
        }
    }

    isGameOver() {
        return [CONNECT_STATUS.GAME_OVER, CONNECT_STATUS.END].includes(this.status);
    }
}

export default GameManager;
