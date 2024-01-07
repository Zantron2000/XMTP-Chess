import { PIECE_COLORS, PIECE_VALUES, INITIAL_BOARD_POSITIONS, PIECE_MESSAGE_ORDER, MESSAGE } from "../src/utils/enum";
import { ownsPiece } from "../src/utils/game/piece";
import { extractCoords } from "../src/utils/game/translate";

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
            board[i].push(PIECE_VALUES.EMPTY);
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

export const createMessage = (positions, player, canCastle = 'TTTT') => {
    let board = '';
    PIECE_MESSAGE_ORDER.forEach((piece) => {
        board += positions[piece] || INITIAL_BOARD_POSITIONS[piece];
    });

    return board + MESSAGE.GAME_DELIMITER + player + MESSAGE.GAME_DELIMITER + canCastle;
}

export const createStarterMessage = () => {
    let board = '';
    PIECE_MESSAGE_ORDER.forEach((piece) => {
        board += INITIAL_BOARD_POSITIONS[piece];
    });

    return board + MESSAGE.GAME_DELIMITER + PIECE_COLORS.BLACK + MESSAGE.GAME_DELIMITER + 'TTTT';
}

export const createPositions = (positions = {}) => {
    const newPositions = {};
    PIECE_MESSAGE_ORDER.forEach((piece) => {
        newPositions[piece] = positions[piece] || INITIAL_BOARD_POSITIONS[piece];
    });

    return newPositions;
}

export const createBoard = () => {
    const board = createTestBoard();
    PIECE_MESSAGE_ORDER.forEach((piece) => {
        const chessPos = INITIAL_BOARD_POSITIONS[piece];

        if (chessPos) {
            const [row, col] = extractCoords(chessPos);
            board[row][col] = piece;
        }
    });

    return board;
}

export const createActions = (color, actions = {}) => {
    const newActions = {};
    PIECE_MESSAGE_ORDER.forEach((piece) => {
        if (ownsPiece(color, piece)) {
            newActions[piece] = actions[piece] || [];
        }
    });

    return newActions;
}

export const createTestXMTPMessage = (content) => ({
    content,
    sentAt: new Date().getTime(),
});
