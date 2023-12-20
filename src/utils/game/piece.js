import { PIECE_COLORS, PIECE_VALUES, DIRECTION_VECTORS } from "../enum";

export const areEnemies = (piece1, piece2) => {
    const color1 = piece1[0] ?? undefined;
    const color2 = piece2[0] ?? undefined;

    return PIECE_COLORS.isEnemy(color1, color2);
}

export const areAllies = (piece1, piece2) => {
    const color1 = piece1[0] ?? undefined;
    const color2 = piece2[0] ?? undefined;

    return PIECE_COLORS.isAlly(color1, color2);
}

export const isMatchingPiece = (piece, ...types) => types.includes(piece[1]);

export const ownsPiece = (player, piece) => {
    const color = piece[0] ?? undefined;

    return color === player;
}

export const isColor = (color, piece) => {
    const pieceColor = piece[0] ?? undefined;

    return pieceColor === color;
}

export const isDiagonal = (direction) => {
    return direction === DIRECTION_VECTORS.NORTH_EAST ||
        direction === DIRECTION_VECTORS.NORTH_WEST ||
        direction === DIRECTION_VECTORS.SOUTH_EAST ||
        direction === DIRECTION_VECTORS.SOUTH_WEST;
}

export const isPiece = (piece, type) => {
    return piece && piece.length === 2 && piece[1] === type;
}

export const canAttackDirection = (piece, direction) => {
    const diagonal = isDiagonal(direction);

    if (diagonal) {
        return isMatchingPiece(piece, PIECE_VALUES.BISHOP, PIECE_VALUES.QUEEN);
    } else {
        return isMatchingPiece(piece, PIECE_VALUES.ROOK, PIECE_VALUES.QUEEN);
    }
}