import { CAPTURED_PIECE, COL_TO_INDEX, INDEX_TO_ROW, MESSAGE, PIECE_COLORS, PIECE_MESSAGE_ORDER, PIECE_VALUES, ROW_TO_INDEX } from "../enum";
import { placePiece } from "./board";
import { extractMoveDetails } from "./message";
import { isPiece } from "./piece";

const initializeBoard = () => {
    const board = [];

    for (let i = 0; i < 8; i++) {
        const row = [];

        for (let j = 0; j < 8; j++) {
            row.push(PIECE_VALUES.EMPTY);
        }

        board.push(row);
    }

    return board;
}

export const extractCoords = (piecePos) => {
    const col = COL_TO_INDEX[piecePos[0]];
    const row = ROW_TO_INDEX[piecePos[1]];

    return [row, col];
};

export const extractNotation = (piecePos) => {
    const row = INDEX_TO_ROW[piecePos[0]];
    const col = INDEX_TO_COL[piecePos[1]];

    return `${col}${row}`;
};

export const translateMessageToBoard = (message) => {
    const gameDetails = extractMoveDetails(message);
    const board = initializeBoard();

    let pawnCharacters = 0;
    PIECE_MESSAGE_ORDER.forEach((piece, order) => {
        if (isPiece(piece, PIECE_VALUES.PAWN)) {
            const isNum = parseInt(gameDetails.board[order * 2 + pawnCharacters + 2]) ? true : false;
            if (isNum) {
                pawnCharacters += 1;
                const piecePos = gameDetails.board.substring(order * 2 + pawnCharacters, order * 2 + 2 + pawnCharacters);

                placePiece(board, piecePos, piece)
            } else {
                const piecePos = gameDetails.board.substring(order * 2 + pawnCharacters, order * 2 + 2 + pawnCharacters);

                placePiece(board, piecePos, piece)
            }
        } else {
            const piecePos = gameDetails.board.substring(order * 2 + pawnCharacters, order * 2 + 2 + pawnCharacters);
            
            placePiece(board, piecePos, piece)
        }
    });

    return board;
}

export const translateTurnToMessage = (positions, registry, player, canCastleDetails) => {
    let board = '';

    PIECE_MESSAGE_ORDER.forEach((piece) => {
        const pos = positions[piece];
        const registryPiece = pos !== CAPTURED_PIECE ? registry[piece] || '' : '';

        board += registryPiece + pos;
    });

    const w1 = canCastleDetails[PIECE_COLORS.WHITE][1] === true ? MESSAGE.TRUE : MESSAGE.FALSE;
    const w2 = canCastleDetails[PIECE_COLORS.WHITE][2] === true ? MESSAGE.TRUE : MESSAGE.FALSE;
    const b1 = canCastleDetails[PIECE_COLORS.BLACK][1] === true ? MESSAGE.TRUE : MESSAGE.FALSE;
    const b2 = canCastleDetails[PIECE_COLORS.BLACK][2] === true ? MESSAGE.TRUE : MESSAGE.FALSE;
    const canCastleString = w1 + w2 + b1 + b2;

    return [board, player, canCastleString].join(MESSAGE.GAME_DELIMITER);
}
