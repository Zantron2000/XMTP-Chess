import { PIECE_COLORS, PIECE_VALUES } from "../enum";
import { validateAction } from "../game/action";
import { isSafeMove, validateMove } from "../game/board";
import { getNextTurn, isPlayerMove, validateTurnContinuity } from "../game/message";
import { translateMessageToBoard } from "../game/translate";

class BoardManager {
    constructor(lastMove, currentMove, selectedPiece, status, player) {
        this.lastMove = lastMove;
        this.currentMove = currentMove;
        this.selectedPiece = selectedPiece;
        this.status = status;
        this.player = player;
        this.moves = {};
    }

    validatePlayerMove() {
        const { error: cError, data: cData } = validateTurnContinuity(this.lastMove, this.currentMove);
        if (cError) {
            return cError;
        }

        const { error: pError, data: pData } = validateAction(cData);
        if (pError) {
            return pError;
        }

        const lastBoard = translateMessageToBoard(this.lastMove);
        const { error: mError } = validateMove(lastBoard, pData, cData.castled[this.player], cData.lastPawnRegistry);

        if (mError) {
            return mError;
        }

        this.board = translateMessageToBoard(this.currentMove);
        this.positions = cData.currPositions;
        this.pawnRegistry = cData.currPawnRegistry;
    }

    validateOpponentMove() {
        const { error: cError, data: cData } = validateTurnContinuity(this.lastMove, this.currentMove);
        if (cError) {
            return cError;
        }

        const { error: pError, data: pData } = validateAction(cData);
        if (pError) {
            return pError;
        }

        const lastBoard = translateMessageToBoard(this.lastMove);
        const { error: mError } = validateMove(lastBoard, pData, cData.castled[this.player], cData.lastPawnRegistry);

        if (mError) {
            return mError;
        }

        this.board = translateMessageToBoard(this.currentMove);
        this.positions = cData.currPositions;
        this.pawnRegistry = cData.currPawnRegistry;

        if (!isSafeMove(this.board, this.positions[PIECE_COLORS.BLACK + PIECE_VALUES.KING])) {
            return GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CHECKMATE, this.player);
        }
    }

    getStatus(setStatus) {
        // 1. Get who made the current move
        // 2. If it was the player
        // 2a. Check the validity of the move, if it's not valid, the status is CHEAT
        // 2b. If it is valid, the status is the opponent's turn
        // 3. If it was the opponent
        // 3a. Check the validity of the move, if it's not valid, the status is CHEAT
        // 3b. Generate all possible moves for the player
        // 3c. If the player has no moves, and the king is in danger, the status is CHECKMATE
        // 3d. If the player has no moves, and the king is not in danger, the status is STALEMATE
        // 3e. If the player has moves, the status is the player's turn
        const currentMoveMaker = isPlayerMove(this.currentMove, this.player);
        const nextTurn = getNextTurn(this.currentMove);

        if (currentMoveMaker === this.player) {
            const isValid = validatePlayerMove(this.lastMove, this.currentMove);

            if (!isValid) {
                setStatus(GAME_STATUS.CHEAT);
            } else {
                setStatus(nextTurn);
            }
        } else {
            const isValid = validateOpponentMove(this.lastMove, this.currentMove);
            if (!isValid) {
                setStatus(GAME_STATUS.CHEAT);
            }

            const { moves, kingInDanger } = getTurnInfo(this.currentMove, this.player);
            this.moves = moves;

            if (noMoreMoves(moves) && kingInDanger) {
                setStatus(GAME_STATUS.CHECKMATE);
            } else if (noMoreMoves(moves) && !kingInDanger) {
                setStatus(GAME_STATUS.STALEMATE);
            } else {
                setStatus(nextTurn);
            }
        }
    }
}

export default BoardManager;
