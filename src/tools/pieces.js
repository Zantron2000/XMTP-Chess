import { PIECE_VALUES, PIECE_REPRESENTATION, PIECE_ORDER } from "./enums";

const BOARD_SIZE = 8;

/**
 * Creates an empty board with no pieces.
 * 
 * @returns {String[][]} The empty board
 */
const createInitialBoard = () => {
    const board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        board.push([]);
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i].push('');
        }
    }
    return board;
};

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
const translateMessageBoard = (stringBoard) => {
    const board = createInitialBoard();
    const boardString = stringBoard.substring(5);

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
const validateBoardMessage = (stringBoard) => {
    const boardString = stringBoard.substring(5);
    if (stringBoard.length !== 134) {
        return false;
    }

    const hash = stringBoard.substring(0, 5);
    if (!hash.match(/^[a-zA-Z0-9]*$/)) {
        return false;
    }

    if (!boardString.match(/^[0-7X]{128}$/)) {
        return false;
    }

    return true;
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
const createMessageBoard = (hash, board) => {
    const flatBoard = Array(32);

    board.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            if (piece !== '') {
                flatBoard[PIECE_ORDER[pieceRep]] = `${rowIndex}${colIndex}`;
            }
        });
    });

    return `${hash}-${flatBoard.join('')}`;
};
