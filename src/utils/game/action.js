import { ACTION_TYPES } from "../../tools/enums";
import { CAPTURED_PIECE, GAME_STATUS, GAME_VALIDATION_MESSAGES, INDEX_TO_COL, INDEX_TO_ROW, PIECE_COLORS, PIECE_VALUES } from "../enum";
import { getPieceAtChessCoords, movePiece } from "./board";
import { areAllies, isPiece, ownsPiece } from "./piece";
import { extractCoords } from "./translate";

const findCapturedPiece = (diff) => {
    const entry = Object.entries(diff).find(([key, [lastPos, currentPos]]) => {
        return lastPos !== CAPTURED_PIECE && currentPos === CAPTURED_PIECE;
    });

    if (!entry) {
        return null;
    }

    return entry[0];
}

const isCastle = (diff) => {
    const keys = Object.keys(diff);

    return keys.length === 2 && areAllies(keys[0], keys[1]);
}

const validateMove = (player, diff) => {
    const piece = Object.keys(diff)[0];
    const [lastPos, currPos] = diff[piece];

    if (!piece) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.MOVE_NO_PIECE, player)
        };
    }

    if (!ownsPiece(player, piece)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.MOVE_OPPONENT_PIECE, player)
        };
    }

    const data = {
        action: `${currPos.substring(0, 2)}${ACTION_TYPES.MOVE}`,
        piecePos: lastPos,
    }

    return { data }
}

const isDead = (chessPos) => chessPos === CAPTURED_PIECE;

const validateCapture = (player, captured, diff) => {
    const capturer = Object.keys(diff).find((key) => key !== captured);

    if (!captured) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.NO_CAPTURED_PIECE, player)
        };
    }

    if (!capturer) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.NO_CAPTURER_PIECE, player)
        };
    }

    const [lastCapPos, currCapPos] = diff[captured];
    const [lastAlivePos, currAlivePos] = diff[capturer];

    if (!ownsPiece(player, capturer)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CAPTURE_WITH_OPPONENT_PIECE, player)
        };
    }

    if (ownsPiece(player, captured)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CAPTURE_FRIENDLY_PIECE, player)
        };
    }

    if (isDead(lastAlivePos)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CAPTURE_WITH_DEAD_PIECE, player)
        };
    }

    if (isDead(currAlivePos)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CAPTURER_DIED, player)
        };
    }

    if (isDead(lastCapPos)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CAPTURED_ALREADY_DEAD, player)
        };
    }

    if (!isDead(lastCapPos) && !isDead(currCapPos)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CAPTURED_SURVIVED, player)
        };
    }

    if (currAlivePos.slice(-2) !== lastCapPos.slice(-2)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CAPTURED_FAR_TARGET, player)
        };
    }

    const data = {
        action: `${currAlivePos.slice(-2)}${ACTION_TYPES.CAPTURE}`,
        piecePos: lastAlivePos,
    }

    return { data }
}

const validateTransform = (player, diff) => {
    const transformer = Object.keys(diff).find((piece) => isPiece(piece, PIECE_VALUES.PAWN));
    const [lastTrsPos, currTrsPos] = diff[transformer];

    if (!transformer) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.NO_REVIVED_PIECE, player)
        };
    }

    if (!ownsPiece(player, transformer)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.OPPONENT_TRANSFORM, player)
        };
    }

    const data = {
        action: `${currTrsPos.slice(-2)}${ACTION_TYPES.TRANSFORM}`,
        piecePos: lastTrsPos,
    }

    return { data }
}

const validateCastle = (player, diff) => {
    const king = Object.keys(diff).find((piece) => isPiece(piece, PIECE_VALUES.KING));
    const rook = Object.keys(diff).find((piece) => isPiece(piece, PIECE_VALUES.ROOK));

    if (!king) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CASTLED_NON_KING, player)
        };
    }

    if (!rook) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CASTLED_NON_ROOK, player)
        };
    }

    if (!ownsPiece(player, king) || !ownsPiece(player, rook)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CASTLED_ENEMY_PIECE, player)
        };
    }

    const [lastKingPos, currKingPos] = diff[king];
    const [lastRookPos, currRookPos] = diff[rook];

    if (isDead(lastKingPos) || isDead(lastRookPos)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CASTLED_DEAD_PIECE, player)
        };
    }

    if (isDead(currKingPos) || isDead(currRookPos)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CASTLED_PIECE_DIED, player)
        };
    }

    return {
        data: {
            action: `${currKingPos.slice(-2)}${ACTION_TYPES.CASTLE}`,
            piecePos: lastKingPos,
        }
    }
}

export const validateAction = ({ player, differences: diff, transformed }) => {
    if (transformed) {
        return validateTransform(player, diff);
    }

    const diffValues = Object.values(diff);

    if (diffValues.length === 1) {
        return validateMove(player, diff);
    }

    const capturedPiece = findCapturedPiece(diff);
    if (capturedPiece) {
        return validateCapture(player, capturedPiece, diff);
    }

    const isCastled = isCastle(diff);
    if (isCastled) {
        return validateCastle(player, diff);
    }

    return {
        error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.INVALID_ACTION, player)
    };
}

export const convertToAction = ([rowIdx, colIdx], action) => {
    const row = INDEX_TO_ROW[rowIdx];
    const col = INDEX_TO_COL[colIdx];

    return `${col}${row}${action}`;
}

export const executeAction = (board, originalChessPos, action, positions) => {
    const actionChessPos = action.slice(0, 2);
    const actionType = action.slice(2);

    if (actionType === ACTION_TYPES.CASTLE) {
        const rookCol = actionChessPos[0] === 'C' ? 'A' : 'H';
        const rookEndCol = actionChessPos[0] === 'C' ? 'D' : 'F';
        const rookRow = actionChessPos[1];
        const rookChessPos = `${rookCol}${rookRow}`;
        const rookChessEndPos = `${rookEndCol}${rookRow}`;

        const king = getPieceAtChessCoords(board, originalChessPos);
        const rook = getPieceAtChessCoords(board, rookChessPos);

        positions[king] = actionChessPos;
        positions[rook] = rookChessEndPos;

        movePiece(board, originalChessPos, actionChessPos);
        movePiece(board, rookChessPos, rookChessEndPos);
    } else {
        const actionPiece = getPieceAtChessCoords(board, originalChessPos);
        const capturedPiece = getPieceAtChessCoords(board, actionChessPos);

        positions[actionPiece] = actionChessPos;
        if (capturedPiece) {
            positions[capturedPiece] = 'XX';
        }

        movePiece(board, originalChessPos, actionChessPos);
    }

    return board;
}

export const noMoreActions = (actionsList) => {
    return Object.values(actionsList).every((actions) => actions.length === 0);
}

export const isTurn = (player, status) => {
    const turn = player === PIECE_COLORS.WHITE ? GAME_STATUS.WHITE_TURN : GAME_STATUS.BLACK_TURN;

    return status === turn;
}

export const isAction = (action, actionType) => {
    return action[2] === actionType;
}
