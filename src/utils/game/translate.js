import { COL_TO_INDEX, INDEX_TO_ROW, PIECE_MESSAGE_ORDER, PIECE_VALUES, ROW_TO_INDEX, INITIAL_BOARD_POSITIONS } from "../enum";
import { extractMoveDetails } from "./message";
import { isPiece } from "./piece";

const initializeBoard = () => {
    const board = [];

    for (let i = 0; i < 8; i++) {
        const row = [];

        for (let j = 0; j < 8; i++) {
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
    Object.entries(PIECE_MESSAGE_ORDER).forEach(([piece, order]) => {
        if (isPiece(piece, PIECE_VALUES.PAWN)) {
            const isNum = parseInt(gameDetails.board[order * 2 + pawnCharacters + 2]) ? true : false;
            if (isNum) {
                const type = gameDetails.board[order * 2 + pawnCharacters]
                pawnCharacters += 1;
                const piecePos = gameDetails.board.substring(order * 2 + pawnCharacters, order * 2 + 2 + pawnCharacters);
                const [row, col] = extractCoords(piecePos);

                board[row][col] = piece[0] + type;
            } else {
                const piecePos = gameDetails.board.substring(order * 2 + pawnCharacters, order * 2 + 2 + pawnCharacters);
                const [row, col] = extractCoords(piecePos);

                board[row][col] = piece;
            }
        } else {
            const piecePos = gameDetails.board.substring(order * 2 + pawnCharacters, order * 2 + 2 + pawnCharacters);
            const [row, col] = extractCoords(piecePos);

            board[row][col] = piece;
        }
    });

    return board;
}