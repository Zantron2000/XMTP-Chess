import { PIECE_COLORS, PIECE_VALUES } from "../src/utils/enum";

const BOARD_SIZE = 8;

/**
 * Creates an empty board with no pieces.
 * 
 * @returns {String[][]} The empty board
 */
export const createTestBoard = () => {
    const board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        board.push([]);
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i].push('');
        }
    }
    return board;
};

export const PIECES = {
    WHITE_KNIGHT: PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT,
    WHITE_BISHOP: PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP,
    WHITE_ROOK: PIECE_COLORS.WHITE + PIECE_VALUES.ROOK,
    WHITE_QUEEN: PIECE_COLORS.WHITE + PIECE_VALUES.QUEEN,
    WHITE_KING: PIECE_COLORS.WHITE + PIECE_VALUES.KING,
    WHITE_PAWN: PIECE_COLORS.WHITE + PIECE_VALUES.PAWN,
    BLACK_KNIGHT: PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT,
    BLACK_BISHOP: PIECE_COLORS.BLACK + PIECE_VALUES.BISHOP,
    BLACK_ROOK: PIECE_COLORS.BLACK + PIECE_VALUES.ROOK,
    BLACK_QUEEN: PIECE_COLORS.BLACK + PIECE_VALUES.QUEEN,
    BLACK_KING: PIECE_COLORS.BLACK + PIECE_VALUES.KING,
    BLACK_PAWN: PIECE_COLORS.BLACK + PIECE_VALUES.PAWN,
    EMPTY: PIECE_VALUES.EMPTY,
};