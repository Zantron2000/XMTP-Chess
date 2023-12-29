export const TEXT_PIECES = {
    WHITE_ROOK: '♖',
    WHITE_KNIGHT: '♘',
    WHITE_BISHOP: '♗',
    WHITE_QUEEN: '♕',
    WHITE_KING: '♔',
    WHITE_PAWN: '♙',
    BLACK_ROOK: '♜',
    BLACK_KNIGHT: '♞',
    BLACK_BISHOP: '♝',
    BLACK_QUEEN: '♛',
    BLACK_KING: '♚',
    BLACK_PAWN: '♟',
}

export const PIECE_COLORS = {
    WHITE: 'W',
    BLACK: 'B',
};

export const PIECE_VALUES = {
    PAWN: 'P',
    KNIGHT: 'N',
    BISHOP: 'B',
    ROOK: 'R',
    QUEEN: 'Q',
    KING: 'K',
    EMPTY: '',
};

export const ACTION_TYPES = {
    MOVE: 'M',
    CAPTURE: 'C',
    TRANSFORM: 'T',
    CASTLE: 'S',
};

export const PIECE_ORDER = {
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

export const ROW_TO_INDEX = {
    '1': 0,
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    '8': 7
};

export const INDEX_TO_ROW = {
    0: '1',
    1: '2',
    2: '3',
    3: '4',
    4: '5',
    5: '6',
    6: '7',
    7: '8'
};

export const COL_TO_INDEX = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3,
    'E': 4,
    'F': 5,
    'G': 6,
    'H': 7
};

export const INDEX_TO_COL = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
    6: 'G',
    7: 'H'
};

export const BOARD_SIZE = 8;

export const GAME_STATUS = {
    BLACK_TURN: 'B',
    WHITE_TURN: 'W',
    CHECKMATE: 'C',
    STALEMATE: 'S',
    CHEAT: 'I',
}

export const BOARD_ROW_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const BOARD_COL_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const PIECE_POSITIONS = Object.entries(PIECE_ORDER).reduce((acc, [piece, index]) => {
    acc[index] = piece;
    return acc;
}, {});

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
