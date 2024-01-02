import { PIECE_COLORS, PIECE_VALUES, DIRECTION_VECTORS } from "../enum";

export const areEnemies = (piece1, piece2) => {
    const color1 = piece1?.[0] ?? undefined;
    const color2 = piece2?.[0] ?? undefined;

    return PIECE_COLORS.isEnemy(color1, color2);
}

export const areAllies = (piece1, piece2) => {
    const color1 = piece1?.[0] ?? undefined;
    const color2 = piece2?.[0] ?? undefined;

    return PIECE_COLORS.isAlly(color1, color2);
}

export const isMatchingPiece = (piece, registry, ...types) => types.some(pieceType => isPiece(piece, pieceType, registry));

export const getEnemyColor = (color) => {
    if (color === PIECE_COLORS.WHITE) {
        return PIECE_COLORS.BLACK;
    } else if (color === PIECE_COLORS.BLACK) {
        return PIECE_COLORS.WHITE;
    } else {
        return undefined;
    }
}

export const ownsPiece = (player, piece) => {
    const color = piece[0] ?? undefined;

    return color === player;
}

export const isColor = (piece, color) => {
    const pieceColor = piece[0] ?? undefined;

    return pieceColor === color;
}

export const isDiagonal = (direction) => {
    return direction === DIRECTION_VECTORS.NORTH_EAST ||
        direction === DIRECTION_VECTORS.NORTH_WEST ||
        direction === DIRECTION_VECTORS.SOUTH_EAST ||
        direction === DIRECTION_VECTORS.SOUTH_WEST;
}

export const isPiece = (piece, type, registry = {}) => {
    if (piece && piece.length >= 2) {
        if (piece[1] === type) {
            return true;
        } else if (piece[1] === PIECE_VALUES.PAWN) {
            const transformedPawn = registry[piece];
            return transformedPawn === type;
        }
    }

    return false;

    piece[1] === type;
}


export const canAttackDirection = (piece, direction, registry) => {
    const diagonal = isDiagonal(direction);

    if (diagonal) {
        return isMatchingPiece(piece, registry, PIECE_VALUES.BISHOP, PIECE_VALUES.QUEEN);
    } else {
        return isMatchingPiece(piece, registry, PIECE_VALUES.ROOK, PIECE_VALUES.QUEEN);
    }
}