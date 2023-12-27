import { PIECE_ORDER } from "../../tools/enums";
import { GAME_STATUS, GAME_VALIDATION_MESSAGES, MESSAGE, PIECE_COLORS, PIECE_MESSAGE_ORDER, PIECE_VALUES } from "../enum";
import { isPiece } from "./piece";

const pieceOrder = Object.keys(PIECE_MESSAGE_ORDER).sort((a, b) => {
    return PIECE_MESSAGE_ORDER[a] - PIECE_MESSAGE_ORDER[b];
});
const pawnTypes = PIECE_VALUES.QUEEN + PIECE_VALUES.ROOK + PIECE_VALUES.BISHOP + PIECE_VALUES.KNIGHT;
const validRows = "ABCDEFGH";
const validCols = "12345678";

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

const validBoardLength = (board) => {
    return 64 <= board.length && board.length <= 80;
};

const hasSameColor = ({ player: lastPlayer }, { player: currentPlayer }) => PIECE_COLORS.isAlly(lastPlayer, currentPlayer);

const hasReverseCastleEnable = ({ canCastle: lastCanCastle }, { canCastle: currentCanCastle }) => {
    return (!lastCanCastle[0] && currentCanCastle[0]) || (!lastCanCastle[1] && currentCanCastle[1]);
};

const isTransformedPawnPos = (pawn) => {
    const hasPawnType = pawnTypes.includes(pawn[0]);
    const hasValidRow = validRows.includes(pawn[1]);
    const hasValidCol = validCols.includes(pawn[2]);

    return hasPawnType && hasValidRow && hasValidCol;
}

const isPiecePos = (piece) => {
    const hasValidRow = validRows.includes(piece[0]);
    const hasValidCol = validCols.includes(piece[1]);
    const isDead = piece === 'XX'

    return (hasValidRow && hasValidCol) || isDead;
}

const extractBoardInfo = (board, blame = '') => {
    const piecePositions = {};
    let pieceCount = 0;
    let transformCount = 0;

    if (!validBoardLength(board)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.INVALID_BOARD_SIZE, blame)
        };
    }

    for (let i = 0; i < board.length; i += 2) {
        const piece = pieceOrder[pieceCount];

        if (isPiece(piece, PIECE_VALUES.PAWN) && isTransformedPawnPos(board.substring(i, i + 3))) {
            piecePositions[piece] = board.substring(i, i + 3);
            pieceCount++;
            transformCount++;
            i += 1;
        } else if (isPiecePos(board.substring(i, i + 2))) {
            piecePositions[piece] = board.substring(i, i + 2);
            pieceCount++;
        } else {
            return {
                error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.INVALID_PIECE_POS, blame)
            };
        }
    }

    if (pieceCount !== 32) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.INVALID_PIECE_COUNT, blame)
        };
    }
    if (transformCount > 16) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.INVALID_TRANSFORM_COUNT, blame)
        };
    }

    return { piecePositions };
}

const getGameDifferences = (lastBoard, currBoard) => {
    const { piecePositions: lastPositions, error: lastError } = extractBoardInfo(lastBoard);
    const { piecePositions: currPositions, error: currError } = extractBoardInfo(currBoard);
    const differences = {};

    if (lastError || currError) {
        return {
            error: lastError || currError
        };
    }

    pieceOrder.forEach((piece) => {
        const lastPos = lastPositions[piece];
        const currentPos = currPositions[piece];

        if (lastPos !== currentPos) {
            differences[piece] = [
                lastPos,
                currentPos,
            ];
        }
    })

    return { differences, currPositions, lastPositions };
}

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

    if (hasSameColor(lastMoveDetails, currentMoveDetails)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.SAME_MESSAGE_COLOR, currentMoveDetails.player)
        };
    }

    if (hasReverseCastleEnable(lastMoveDetails, currentMoveDetails)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.REENABLE_CASTLING, currentMoveDetails.player)
        };
    }

    const { error, currPositions, differences, lastPositions } = getGameDifferences(lastMoveDetails.board, currentMoveDetails.board);

    if (error) {
        return { error };
    }

    const diffLength = Object.keys(differences).length;

    if (diffLength === 0) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.NO_MOVE, currentMoveDetails.player)
        };
    }

    if (diffLength > 2) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.MULTI_ACTION, currentMoveDetails.player)
        };
    }

    return {
        data: {
            differences,
            player: currentMoveDetails.player,
            castled: canCastle(lastMove, currentMoveDetails.player) && !canCastle(currentMove, currentMoveDetails.player),
            lastPositions,
            currPositions,
        }
    };
};

export const canCastle = (move, player) => {
    const { canCastle } = extractMoveDetails(move);

    return canCastle[MESSAGE.CAN_CASTLE_POSITIONS[player]];
}
