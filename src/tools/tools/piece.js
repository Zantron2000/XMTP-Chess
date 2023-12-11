import { PIECE_VALUES, PIECE_COLORS } from "../enums";

/**
 * Checks if a piece is a pawn. It is a pawn if the second character in the
 * piece representation matches the pawn value.
 * 
 * @param {String} piece The piece representation
 * @returns {Boolean} True if the piece is a pawn, false otherwise
 */
export const isPawn = (piece) => piece[1] === PIECE_VALUES.PAWN;

/**
 * Checks if a piece is a knight. It is a knight if the second character in the
 * piece representation matches the knight value.
 * 
 * @param {String} piece The piece representation
 * @returns {Boolean} True if the piece is a knight, false otherwise
 */
export const isKnight = (piece) => piece[1] === PIECE_VALUES.KNIGHT;

/**
 * Checks if a piece is a bishop. It is a bishop if the second character in the
 * piece representation matches the bishop value.
 * 
 * @param {String} piece The piece representation
 * @returns {Boolean} True if the piece is a bishop, false otherwise
 */
export const isBishop = (piece) => piece[1] === PIECE_VALUES.BISHOP;

/**
 * Checks if a piece is a rook. It is a rook if the second character in the
 * piece representation matches the rook value.
 * 
 * @param {String} piece The piece representation
 * @returns {Boolean} True if the piece is a rook, false otherwise
 */
export const isRook = (piece) => piece[1] === PIECE_VALUES.ROOK;

/**
 * Checks if a piece is a queen. It is a queen if the second character in the
 * piece representation matches the queen value.
 * 
 * @param {String} piece The piece representation
 * @returns {Boolean} True if the piece is a queen, false otherwise
 */
export const isQueen = (piece) => piece[1] === PIECE_VALUES.QUEEN;

/**
 * Checks if a piece is a king. It is a king if the second character in the
 * piece representation matches the king value.
 * 
 * @param {String} piece The piece representation
 * @returns {Boolean} True if the piece is a king, false otherwise
 */
export const isKing = (piece) => piece[1] === PIECE_VALUES.KING;

/**
 * Checks if a piece is white. It is white if the first character in the piece
 * representation matches the white value.
 * 
 * @param {String} piece The piece representation
 * @returns {Boolean} True if the piece is white, false otherwise
 */
export const isWhite = (piece) => piece[0] === PIECE_COLORS.WHITE;

/**
 * Checks if a piece is black. It is black if the first character in the piece
 * representation matches the black value.
 * 
 * @param {String} piece The piece representation
 * @returns {Boolean} True if the piece is black, false otherwise
 */
export const isBlack = (piece) => piece[0] === PIECE_COLORS.BLACK;

/**
 * Checks if a piece is an enemy. Two pieces are enemies if they are not the
 * same color.
 * 
 * @param {String} piece1 The first piece representation
 * @param {String} piece2 The second piece representation
 * @returns {Boolean} True if the pieces are enemies, false otherwise
 */
export const isEnemy = (piece1, piece2) => piece1[0] !== piece2[0];

/**
 * Checks if a piece is an ally. Two pieces are allies if they are the same
 * color.
 * 
 * @param {String} piece1 The first piece representation
 * @param {String} piece2 The second piece representation
 * @returns {Boolean} True if the pieces are allies, false otherwise
 */
export const isAlly = (piece1, piece2) => piece1[0] === piece2[0];

/**
 * Checks if two pieces are identical. Two pieces are identical if they are
 * the same string
 * 
 * @param {String} piece1 The first piece representation
 * @param {String} piece2 The second piece representation
 * @returns {Boolean} True if the pieces are identical, false otherwise
 */
export const isIdentical = (piece1, piece2) => piece1 === piece2;

/**
 * Checks if a piece is one of the provided pieces
 * 
 * @param {String} piece The piece representation
 * @param  {...String} pieces The pieces to check
 * @returns {Boolean} True if the piece is one of the provided pieces, false otherwise
 */
export const isMatchingPiece = (piece, ...pieces) => pieces.includes(piece[1]);