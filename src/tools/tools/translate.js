import { PIECE_ORDER, PIECE_POSITIONS, PIECE_VALUES } from "../enums";
import { createEmptyBoard, createInitialBoard } from "./board";

const extractMessageContent = (message) => {
    const [hash, ...content] = message.split('-');
    return content[0];
}

const extractCoords = (stringCoords) => {
    const row = parseInt(stringCoords[0]);
    const col = parseInt(stringCoords[1]);

    return [row, col];
};

/**
 * Creates a string representation of a board.
 * A board is represented as the following format:
 * 
 * Hash-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * 
 * Where:
 * - Hash: The hash of the board, this should be 5 characters long
 * - XX: The piece in the position XX, where the first X is the row and the second X is the column,
 *     the row and column should be between 0 and 7. The row and column should be numbers or the letter X,
 *     which represents a dead piece, and in that case both the row and column should be X. There should be
 *     64 XX pairs, one for each piece in the board
 * 
 * @param {String} hash The hash of the board
 * @param {String[][]} board The board in array format
 * @returns {String} The board in string format
 */
export const createMessageBoard = (hash, board) => {
    const flatBoard = Array(32);

    board.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            if (piece !== PIECE_VALUES.EMPTY) {
                flatBoard[PIECE_ORDER[piece]] = `${rowIndex}${colIndex}`;
            }
        });
    });

    const filledBoard = [];
    for (let i = 0; i < 32; i += 1) {
        filledBoard.push(flatBoard[i] || 'XX');
    }

    return `${hash}-${filledBoard.join('')}`;
};

const START_BOARD_MESSAGE = createMessageBoard('12345', createInitialBoard());

/**
 * Translate a board in string format to an array of pieces.
 * A board is represented as the following format:
 * 
 * Hash-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * 
 * Where:
 * - Hash: The hash of the board, this should be ignored
 * - XX: The piece in the position XX, where the first X is the row and the second X is the column.  The row and column should be numbers or the letter X,
 *    which represents a dead piece, and in that case don't add the piece to the board. The row and column should be between 0 and 7.
 * There are 64 XX pairs, one for each piece in the board
 * The pairs appear in the order of the pieces_order object, so the first pair is the first piece in the pieces_order object
 * 
 * The function should return a 2D array of pieces, where the first index is the row and the second index is the column
 * and the value at that index is the piece representation of the piece in that position.
 * 
 * @param {String} stringBoard The board in string format
 * @returns {String[][]} The board in array format
 */
export const translateMessageBoard = (stringBoard) => {
    const board = createEmptyBoard();
    const boardString = extractMessageContent(stringBoard);

    Object.entries(PIECE_ORDER).forEach(([piece, index]) => {
        const pos = index * 2;
        const piecePos = boardString.substring(pos, pos + 2);

        if (piecePos[0] !== 'X' && piecePos[1] !== 'X') {
            const row = parseInt(piecePos[0]);
            const col = parseInt(piecePos[1]);
            board[row][col] = piece;
        }
    });

    return board;
};

/**
 * Validates that a board is in the correct format. The board
 * should be in the following format:
 * 
 * Hash-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * 
 * Where:
 * - Hash: The hash of the board, this should be 5 characters long
 * - XX: The piece in the position XX, where the first X is the row and the second X is the column,
 *     the row and column should be between 0 and 7. The row and column should be numbers or the letter X,
 *     which represents a dead piece, and in that case both the row and column should be X. There should be
 *     64 XX pairs, one for each piece in the board
 * 
 * @param {String} stringBoard The board in string format
 * @returns {Boolean} True if the board is in the correct format, false otherwise
 */
export const validateBoardMessage = (stringBoard) => {
    const [hash, boardString] = stringBoard.split('-');

    if (!hash || !boardString) {
        return false;
    }

    if (stringBoard.length !== 70) {
        return false;
    }

    if (!hash.match(/^[a-zA-Z0-9]*$/)) {
        return false;
    }

    if (!boardString.match(/^[0-7X]{64}$/)) {
        return false;
    }

    return true;
};

export const validateLastMoveMessage = (lastEnemyMove, lastUserMove = START_BOARD_MESSAGE, userColor) => {
    const enemyContent = extractMessageContent(lastEnemyMove);
    const userContent = extractMessageContent(lastUserMove);
    const moves = [];
    let numChanges = 0;

    for (let i = 0; i < enemyContent.length; i += 2) {
        const enemyPiece = enemyContent.substring(i, i + 2);
        const userPiece = userContent.substring(i, i + 2);

        if (enemyPiece !== userPiece) {
            numChanges += 1;
            moves.push({ oldMove: userPiece, newMove: enemyPiece, piece: i / 2 });
        }
    }

    if (numChanges !== 1) {
        return undefined;
    } else if (PIECE_POSITIONS[moves[0].piece][0] === userColor) {
        return undefined;
    }

    return moves[0];
};