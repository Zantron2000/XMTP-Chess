const BOARD_SIZE = 8;

/**
 * Creates an empty board with no pieces.
 * 
 * @returns {String[][]} The empty board
 */
export const createInitialBoard = () => {
    const board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        board.push([]);
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i].push('');
        }
    }
    return board;
};