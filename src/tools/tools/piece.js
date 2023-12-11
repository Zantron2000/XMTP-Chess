import { PIECE_VALUES, PIECE_COLORS } from "../enums";

export const isPawn = (piece) => piece[1] === PIECE_VALUES.PAWN;

export const isKnight = (piece) => piece[1] === PIECE_VALUES.KNIGHT;

export const isBishop = (piece) => piece[1] === PIECE_VALUES.BISHOP;

export const isRook = (piece) => piece[1] === PIECE_VALUES.ROOK;

export const isQueen = (piece) => piece[1] === PIECE_VALUES.QUEEN;

export const isKing = (piece) => piece[1] === PIECE_VALUES.KING;

export const isWhite = (piece) => piece[0] === PIECE_COLORS.WHITE;

export const isBlack = (piece) => piece[0] === PIECE_COLORS.BLACK;

export const isEnemy = (piece1, piece2) => piece1[0] !== piece2[0];

export const isAlly = (piece1, piece2) => piece1[0] === piece2[0];

export const isIdentical = (piece1, piece2) => piece1 === piece2;

export const isMatchingPiece = (piece, ...pieces) => pieces.includes(piece);