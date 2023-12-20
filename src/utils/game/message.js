import { GAME_STATUS, GAME_VALIDATION_MESSAGES, MESSAGE, PIECE_COLORS, PIECE_MESSAGE_ORDER, PIECE_VALUES } from "../enum";
import { isPiece } from "./piece";

/**
 * Extracts individual details from a move
 * 
 * @param {GameMessage} move The move to extract details from
 * @returns {{ 
 *  board: String, 
 *  player: PIECE_COLORS[keyof PIECE_COLORS],
 *  canCastle: [Boolean, Boolean],
 * }}
 */
export const extractMoveDetails = (move) => {
    const details = move.split(MESSAGE.GAME_DELIMITER);
    const whiteCanCastle = details[2][0] === MESSAGE.TRUE ? true : details[2][0] === MESSAGE.FALSE ? false : undefined;
    const blackCanCastle = details[2][1] === MESSAGE.TRUE ? true : details[2][1] === MESSAGE.FALSE ? false : undefined;

    return {
        board: details[0],
        player: details[1],
        canCastle: [
            whiteCanCastle,
            blackCanCastle,
        ],
    };
}

/**
 * Checks to see if a move was made by the player
 * 
 * @param {GameMessage} move The move to check
 * @param {PIECE_COLORS[keyof PIECE_COLORS]} player
 * @returns {Boolean} Whether or not the move was made by the player
 */
export const isPlayerMove = (move, player) => {
    const { player: movePlayer } = extractMoveDetails(move);

    return PIECE_COLORS.isAlly(movePlayer, player);
};

/**
 * Checks to see if a move was made by the opponent
 * 
 * @param {GameMessage} move The move to check
 * @param {PIECE_COLORS[keyof PIECE_COLORS]} opponent 
 * @returns {Boolean} Whether or not the move was made by the opponent
 */
export const isOpponentMove = (move, opponent) => {
    const { player: movePlayer } = extractMoveDetails(move);

    return PIECE_COLORS.isEnemy(movePlayer, opponent);
}

/**
 * Checks to see which color's turn is next in the game
 * 
 * @param {GameMessage} move The move to check
 * @returns {GAME_STATUS['WHITE_TURN'] | GAME_STATUS['BLACK_TURN']} The next turn
 */
export const getNextTurn = (move) => {
    const { player } = extractMoveDetails(move);

    return PIECE_COLORS.isWhite(player) ? GAME_STATUS.BLACK_TURN : GAME_STATUS.WHITE_TURN;
}

/**
 * Gets all the differences in the board between the last move and the current move
 * 
 * @param {GameMessage} lastMove The last move made
 * @param {GameMessage} currentMove The current move made
 * @returns {[number, string, string][]} The differences between the last move and the current move. 
 */
const getGameDifferences = (lastMove, currentMove) => {
    const { board: lastBoard } = extractMoveDetails(lastMove);
    const { board: currentBoard } = extractMoveDetails(currentMove);
    const differences = [];

    for (let i = 0; i < lastBoard.length && i < currentBoard.length; i += 2) {
        const lastPos = lastBoard.substring(i, i + 2);
        const currentPos = currentBoard.substring(i, i + 2);

        if (lastPos !== currentPos) {
            differences.push([
                lastPos,
                currentPos,
            ])
        }
    }

    return differences;
}

const hasSameColor = ({ player: lastPlayer }, { player: currentPlayer }) => PIECE_COLORS.isAlly(lastPlayer, currentPlayer);

const hasReverseCastleEnable = ({ canCastle: lastCanCastle }, { canCastle: currentCanCastle }) => {
    return (!lastCanCastle[0] && currentCanCastle[0]) || (!lastCanCastle[1] && currentCanCastle[1]);
};

const validBoardPattern = (board) => {
    const pieceOrder = Object.keys(PIECE_MESSAGE_ORDER).sort((a, b) => {
        return PIECE_MESSAGE_ORDER[a] - PIECE_MESSAGE_ORDER[b];
    });
    const pawnTypes = PIECE_VALUES.QUEEN + PIECE_VALUES.ROOK + PIECE_VALUES.BISHOP + PIECE_VALUES.KNIGHT;
    const validRows = "ABCDEFGHX";
    const validCols = "12345678X";

    if (64 <= board.length && board.length <= 80) {
        let order = 0;
        for (let i = 0; i < board.length; i += 2) {
            if (isPiece(pieceOrder[0], PIECE_VALUES.PAWN)) {
                const pawnSubstr = board.substring(i, i + 3);
                const hasPawnType = pawnTypes.includes(pawnSubstr[0]);
                const hasValidRow = validRows.includes(pawnSubstr[1]);
                const hasValidCol = validCols.includes(pawnSubstr[2]);

                if (hasPawnType && hasValidRow && hasValidCol) {
                    order++;
                    i += 1;
                    continue;
                }
            }
            const pieceSubstr = board.substring(i, i + 2);
            const hasValidRow = validRows.includes(pieceSubstr[0]);
            const hasValidCol = validCols.includes(pieceSubstr[1]);

            if (!hasValidRow || !hasValidCol) {

            }

            order++;
        }

        return true;
    }

    return false;
};

export const validateTurnContinuity = (lastMove, currentMove) => {
    const lastMoveDetails = extractMoveDetails(lastMove);
    const currentMoveDetails = extractMoveDetails(currentMove);

    if (!lastMoveDetails.player || !currentMoveDetails.player) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.INVALID_MESSAGE, currentMoveDetails.player)
        };
    }

    if (lastMoveDetails.canCastle.includes(undefined) || currentMoveDetails.canCastle.includes(undefined)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.INVALID_MESSAGE, currentMoveDetails.player)
        };
    }

    if (!lastMoveDetails.board || !currentMoveDetails.board) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.INVALID_MESSAGE, currentMoveDetails.player)
        };
    }

    if (!validBoardPattern(lastMoveDetails.board) || !validBoardPattern(currentMoveDetails.board)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.INVALID_BOARD, currentMoveDetails.player)
        };
    }

    if (hasSameColor(lastMoveDetails, currentMoveDetails)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.DOUBLE_MOVE, currentMoveDetails.player)
        };
    }

    if (hasReverseCastleEnable(lastMoveDetails, currentMoveDetails)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.REENABLE_CASTLING, currentMoveDetails.player)
        };
    }

    const diff = getGameDifferences(lastMove, currentMove);

    if (diff.length === 0) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.NO_MOVE, currentMoveDetails.player)
        };
    }

    if (diff.length > 1) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.MULTI_ACTION, currentMoveDetails.player)
        };
    }

    return {
        data: {
            diff,
            player: currentMoveDetails.player,
            castled: canCastle(lastMove, currentMoveDetails.player) && !canCastle(currentMove, currentMoveDetails.player)
        }
    };
};

export const canCastle = (move, player) => {
    const { canCastle } = extractMoveDetails(move);

    return canCastle[MESSAGE.CAN_CASTLE_POSITIONS[player]];
}