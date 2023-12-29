/**
 * @typedef {{
 *  WHITE: 'W',
 *  BLACK: 'B',
 * }} PIECE_COLORS The colors of the pieces
 * 
 * @type {{
 *  WHITE: PIECE_COLORS.WHITE,
 *  BLACK: PIECE_COLORS.BLACK,
 *  isAlly: (color1: PIECE_COLORS[keyof PIECE_COLORS], color2: PIECE_COLORS[keyof PIECE_COLORS]) => Boolean,
 *  isEnemy: (color1: PIECE_COLORS[keyof PIECE_COLORS], color2: PIECE_COLORS[keyof PIECE_COLORS]) => Boolean,
 *  isWhite: (color: PIECE_COLORS[keyof PIECE_COLORS]) => Boolean,
 *  isBlack: (color: PIECE_COLORS[keyof PIECE_COLORS]) => Boolean,
 * }}
 */
export const PIECE_COLORS = {
    WHITE: 'W',
    BLACK: 'B',

    isAlly: (color1, color2) => color1 === color2,
    isEnemy: (color1, color2) => color1 !== color2,
    isWhite: (color) => color === PIECE_COLORS.WHITE,
    isBlack: (color) => color === PIECE_COLORS.BLACK,
}

/**
 * @typedef {{
 *  WHITE_TURN: 'W',
 *  BLACK_TURN: 'B',
 *  CHECKMATE: 'C',
 *  STALEMATE: 'S',
 *  CHEAT: 'X',
 * }} GAME_STATUS The statuses of the game
 * 
 * @type {{
 *  WHITE_TURN: GAME_STATUS.WHITE_TURN,
 *  BLACK_TURN: GAME_STATUS.BLACK_TURN,
 *  CHECKMATE: GAME_STATUS.CHECKMATE,
 *  STALEMATE: GAME_STATUS.STALEMATE,
 *  CHEAT: GAME_STATUS.CHEAT,
 * }}
 */
export const GAME_STATUS = {
    WHITE_TURN: 'W',
    BLACK_TURN: 'B',
    CHECKMATE: 'C',
    STALEMATE: 'S',
    CHEAT: 'X',

    isWhiteTurn: (status) => status === GAME_STATUS.WHITE_TURN,
    isBlackTurn: (status) => status === GAME_STATUS.BLACK_TURN,
    isCheckmate: (status) => status === GAME_STATUS.CHECKMATE,
    isStalemate: (status) => status === GAME_STATUS.STALEMATE,
    isCheat: (status) => status === GAME_STATUS.CHEAT,
}

/**
 * The messages to display to the user for validation errors
 */
export const GAME_VALIDATION_MESSAGES = {
    SAME_MESSAGE_COLOR: 1,
    NO_MOVE: 2,
    MULTI_MOVE: 3,
    REENABLE_CASTLING: 4,
    MULTI_ACTION: 5,
    INVALID_ACTION: 6,
    MOVE_NO_PIECE: 7,
    MOVE_OPPONENT_PIECE: 8,
    NO_CAPTURED_PIECE: 9,
    NO_CAPTURER_PIECE: 10,
    CAPTURE_WITH_OPPONENT_PIECE: 12,
    CAPTURE_FRIENDLY_PIECE: 13,
    CAPTURED_ALREADY_DEAD: 14,
    CAPTURER_DIED: 15,
    CAPTURED_SURVIVED: 16,
    CAPTURED_FAR_TARGET: 17,
    NO_REVIVED_PIECE: 18,
    OPPONENT_TRANSFORM: 19,
    INVALID_ACTION: 20,
    INVALID_MESSAGE: 21,
    INVALID_BOARD: 22,
    INVALID_PIECE_COUNT: 23,
    INVALID_TRANSFORM_COUNT: 24,
    INVALID_PIECE_POS: 25,
    INVALID_BOARD_SIZE: 26,
    CAPTURE_WITH_DEAD_PIECE: 27,
    CASTLED_NON_KING: 28,
    CASTLED_NON_ROOK: 29,
    CASTLED_ENEMY_PIECE: 30,
    CASTLED_DEAD_PIECE: 31,
    CASTLED_PIECE_DIED: 32,

    formatMessage: (message, color) => message,
}

export const PIECE_VALUES = {
    PAWN: 'P',
    KNIGHT: 'N',
    BISHOP: 'B',
    ROOK: 'R',
    QUEEN: 'Q',
    KING: 'K',
    EMPTY: undefined,

    isEqual: (piece1, piece2) => piece1 === piece2,
    isPawn: (piece) => piece === PIECE_VALUES.PAWN,
    isKnight: (piece) => piece === PIECE_VALUES.KNIGHT,
    isBishop: (piece) => piece === PIECE_VALUES.BISHOP,
    isRook: (piece) => piece === PIECE_VALUES.ROOK,
    isQueen: (piece) => piece === PIECE_VALUES.QUEEN,
    isKing: (piece) => piece === PIECE_VALUES.KING,
    isEmpty: (piece) => piece === PIECE_VALUES.EMPTY,
};

export const PIECE_MESSAGE_ORDER = {
    [PIECE_COLORS.WHITE + PIECE_VALUES.ROOK + '1']: 0,
    [PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT + '1']: 1,
    [PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP + '1']: 2,
    [PIECE_COLORS.WHITE + PIECE_VALUES.QUEEN]: 3,
    [PIECE_COLORS.WHITE + PIECE_VALUES.KING]: 4,
    [PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP + '2']: 5,
    [PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT + '2']: 6,
    [PIECE_COLORS.WHITE + PIECE_VALUES.ROOK + '2']: 7,
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1']: 8,
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '2']: 9,
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '3']: 10,
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '4']: 11,
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '5']: 12,
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '6']: 13,
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '7']: 14,
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '8']: 15,
    [PIECE_COLORS.BLACK + PIECE_VALUES.ROOK + '1']: 16,
    [PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT + '1']: 17,
    [PIECE_COLORS.BLACK + PIECE_VALUES.BISHOP + '1']: 18,
    [PIECE_COLORS.BLACK + PIECE_VALUES.QUEEN]: 19,
    [PIECE_COLORS.BLACK + PIECE_VALUES.KING]: 20,
    [PIECE_COLORS.BLACK + PIECE_VALUES.BISHOP + '2']: 21,
    [PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT + '2']: 22,
    [PIECE_COLORS.BLACK + PIECE_VALUES.ROOK + '2']: 23,
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1']: 24,
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '2']: 25,
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '3']: 26,
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '4']: 27,
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '5']: 28,
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '6']: 29,
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '7']: 30,
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '8']: 31,
};

export const INITIAL_BOARD_POSITIONS = {
    [PIECE_COLORS.WHITE + PIECE_VALUES.ROOK + '1']: 'A1',
    [PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT + '1']: 'B1',
    [PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP + '1']: 'C1',
    [PIECE_COLORS.WHITE + PIECE_VALUES.QUEEN]: 'D1',
    [PIECE_COLORS.WHITE + PIECE_VALUES.KING]: 'E1',
    [PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP + '2']: 'F1',
    [PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT + '2']: 'G1',
    [PIECE_COLORS.WHITE + PIECE_VALUES.ROOK + '2']: 'H1',
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1']: 'A2',
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '2']: 'B2',
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '3']: 'C2',
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '4']: 'D2',
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '5']: 'E2',
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '6']: 'F2',
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '7']: 'G2',
    [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '8']: 'H2',
    [PIECE_COLORS.BLACK + PIECE_VALUES.ROOK + '1']: 'A8',
    [PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT + '1']: 'B8',
    [PIECE_COLORS.BLACK + PIECE_VALUES.BISHOP + '1']: 'C8',
    [PIECE_COLORS.BLACK + PIECE_VALUES.QUEEN]: 'D8',
    [PIECE_COLORS.BLACK + PIECE_VALUES.KING]: 'E8',
    [PIECE_COLORS.BLACK + PIECE_VALUES.BISHOP + '2']: 'F8',
    [PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT + '2']: 'G8',
    [PIECE_COLORS.BLACK + PIECE_VALUES.ROOK + '2']: 'H8',
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1']: 'A7',
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '2']: 'B7',
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '3']: 'C7',
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '4']: 'D7',
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '5']: 'E7',
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '6']: 'F7',
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '7']: 'G7',
    [PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '8']: 'H7',
}

/**
 * The representation of a captured piece
 */
export const CAPTURED_PIECE = 'XX';

export const MESSAGE = {
    GAME_DELIMITER: ',',
    TRUE: 'T',
    FALSE: 'F',
    CAN_CASTLE_POSITIONS: {
        [PIECE_COLORS.WHITE]: 0,
        [PIECE_COLORS.BLACK]: 1,
    },
}

export const ROW_TO_INDEX = {
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
}

export const INDEX_TO_ROW = Object.keys(ROW_TO_INDEX);

export const COL_TO_INDEX = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
}

export const INDEX_TO_COL = Object.keys(COL_TO_INDEX);

export const DIRECTION_VECTORS = {
    NORTH: [-1, 0],
    NORTH_EAST: [-1, 1],
    EAST: [0, 1],
    SOUTH_EAST: [1, 1],
    SOUTH: [1, 0],
    SOUTH_WEST: [1, -1],
    WEST: [0, -1],
    NORTH_WEST: [-1, -1],
};

export const DIRECTIONS = {
    NORTH: 'N',
    NORTH_EAST: 'NE',
    EAST: 'E',
    SOUTH_EAST: 'SE',
    SOUTH: 'S',
    SOUTH_WEST: 'SW',
    WEST: 'W',
    NORTH_WEST: 'NW',
};
