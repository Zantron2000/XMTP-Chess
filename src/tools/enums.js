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

export const PIECE_ORDER = {
    WR1: 0,
    WN1: 1,
    WB1: 2,
    WQ: 3,
    WK: 4,
    WB2: 5,
    WN2: 6,
    WR2: 7,
    WP1: 8,
    WP2: 9,
    WP3: 10,
    WP4: 11,
    WP5: 12,
    WP6: 13,
    WP7: 14,
    WP8: 15,
    BR1: 16,
    BN1: 17,
    BB1: 18,
    BQ: 19,
    BK: 20,
    BB2: 21,
    BN2: 22,
    BR2: 23,
    BP1: 24,
    BP2: 25,
    BP3: 26,
    BP4: 27,
    BP5: 28,
    BP6: 29,
    BP7: 30,
    BP8: 31,
};

export const PIECE_POSITIONS = Object.entries(PIECE_ORDER).reduce((acc, [piece, index]) => {
    acc[index] = piece;
    return acc;
}, {});

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
