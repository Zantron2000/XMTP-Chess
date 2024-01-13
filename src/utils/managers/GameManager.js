import { CONNECT_STATUS } from "../enum";
import { getContent, isGameContent, isConnectStatus } from "../message/message";

class GameManager {
    constructor(lastMove, currMove, status, playerAddr) {
        this.lastMove = lastMove;
        this.currMove = currMove;
        this.status = status;
        this.playerAddr = playerAddr;
    }

    determineStatus(setStatus, nextMessage, content) {
        const connectStatus = content[0];


    }

    updateStatus(setStatus, setLastMove, setCurrMove, nextMessage) {
        if (isGameContent(nextMessage.content)) {
            setLastMove(this.currMove);
            setCurrMove(nextMessage);

            if (!this.status) {
                setStatus(CONNECT_STATUS.ACCEPT);
            }
        } else if (isConnectStatus(nextMessage.content)) {
            const content = getContent(nextMessage.content);

            this.determineStatus(setStatus, nextMessage, content);
        } else {
            setStatus(CONNECT_STATUS.END);
        }
    }
}

export default GameManager;
