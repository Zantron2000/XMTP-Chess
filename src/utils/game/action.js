import { ACTION_TYPES } from "../../tools/enums";
import { CAPTURED_PIECE } from "../enum";
import { getPieceAtChessCoords } from "./board";
import { ownsPiece } from "./piece";

const findCapturedPiece = (diff, board) => {
    const chessCoords = diff.find(([lastPos, currentPos]) => {
        return lastPos !== CAPTURED_PIECE && currentPos === CAPTURED_PIECE;
    });

    if (!chessCoords) {
        return null;
    }

    return getPieceAtChessCoords(board, chessCoords);
}

const validateMove = (board, player, pieceHistory) => {
    const [lastPos, currPos] = pieceHistory;
    const piece = getPieceAtChessCoords(board, lastPos);

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

const validateCapture = (board, player, [lastCapPos, currCapPos], diff) => {
    const [lastAlivePos, currAlivePos] = diff.find(([lastPos, currPos]) => currPos !== CAPTURED_PIECE);

    const capturer = getPieceAtChessCoords(board, lastAlivePos);
    const captured = getPieceAtChessCoords(board, lastCapPos);

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

    if (isDead(lastAlivePos) || isDead(currAlivePos)) {
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

    if (currAlivePos !== lastCapPos) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CAPTURED_FAR_TARGET, player)
        };
    }

    const data = {
        action: `${currCapPos.substring(0, 2)}${ACTION_TYPES.CAPTURE}`,
        piecePos: lastAlivePos,
    }

    return { data }
}

const validateTransform = (board, player, [lastTrsPos, currTrsPos]) => {
    const transformer = getPieceAtChessCoords(board, lastTrsPos);

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
        action: `${currTrsPos.substring(0, 2)}${ACTION_TYPES.TRANSFORM}`,
        piecePos: lastTrsPos,
    }

    return { data }
}

// const validateCastle = (board, player, diff) => {
// }

export const validateAction = (board, { player, diff, castled }) => {
    if (diff.length === 1) {
        if (diff[0][1].length === 3) {
            return validateTransform(board, player, diff[0]);
        }

        return validateMove(board, player, diff[0]);
    }

    const capturedPiece = findCapturedPiece(diff, board);

    // if (castled) {
    //     return validateCastle(board, player, diff);
    // }
    if (capturedPiece) {
        return validateCapture(board, player, capturedPiece, diff);
    }

    return {
        error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.INVALID_ACTION, player)
    };
}

export const convertToAction = ([x, y], action) => {
    return `${y}${x}${action}`;
}