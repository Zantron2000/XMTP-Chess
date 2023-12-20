import { getGameDifferences, validateTurnContinuity } from './message';
import { GAME_VALIDATION_MESSAGES, PIECE_VALUES, DIRECTION_VECTORS, PIECE_COLORS } from '../enum';
import { isEnemy } from '../../tools/tools/piece';
import { extractCoords } from './translate';
import { areEnemies, canAttackDirection, isColor, isPiece } from './piece';
import { convertToAction } from './action';
import { ACTION_TYPES } from '../../tools/enums';

const isInRange = (board, [row, col]) => {
    if (0 <= row && row < board.length) {
        if (0 <= col && col < board[row].length) {
            return true;
        }
    }

    return false;
}

const getPieceAt = (board, [row, col]) => {
    if (isInRange(board, [row, col])) {
        return board[row][col];
    }

    return undefined;
}

const isEmpty = (board, pos, ignore) => {
    const piece = getPieceAt(board, pos);

    return !piece || PIECE_VALUES.isEqual(piece, ignore);
}

const findNearestPiece = (board, [row, col], direction, piece) => {
    const [rowDir, colDir] = direction;
    let [r, c] = [row + rowDir, col + colDir];

    while (isInRange([r, c], board)) {
        if (!isEmpty(board, [r, c], piece)) {
            return [r, c];
        }

        r += rowDir;
        c += colDir;
    }

    return null;
}

/**
 * Generates possible moves for a pawn. Pawns can move forward one space,
 * or two spaces if it is the first move. Pawns can also capture diagonally.
 * Each string in the array should be in the following format:
 *  <row><col><type> where <row> is the row of the move, <col> is the column of the move,
 *  and <type> is the type of move, which can be: 'M' for a move, 'C' for a capture,
 * 
 * @param {String[][]} board The board in array format
 * @param {Number} row The row of the pawn
 * @param {Number} col The column of the pawn
 * @param {String} piece The piece representation of the pawn
 * @returns {String[]} An array of possible moves
 */
const generateBlackPawnMoves = (board, row, col, ignore) => {
    const moves = [];
    const possibleMove = [row - 1, col];
    const possibleSpecialMove = [row - 2, col];
    const possibleCaptures = [
        [row - 1, col + 1],
        [row - 1, col - 1],
    ];
    const piece = getPieceAt(board, [row, col]);

    if (isInRange(board, possibleMove) && isEmpty(board, possibleMove, ignore)) {
        if (row === 2) {
            moves.push(convertToAction(possibleMove, ACTION_TYPES.TRANSFORM));
        } else {
            moves.push(convertToAction(possibleMove, ACTION_TYPES.MOVE));
        }

        if (row === 6 && isEmpty(board, possibleSpecialMove, ignore)) {
            moves.push(convertToAction(possibleSpecialMove, ACTION_TYPES.MOVE));
        }
    }

    possibleCaptures.forEach((capture) => {
        if (isInRange(board, capture) && !isEmpty(board, capture, ignore) && isEnemy(piece, board[capture[0]][capture[1]])) {
            moves.push(convertToAction(capture, ACTION_TYPES.CAPTURE));
        }
    });

    return moves;
};

/**
 * Generates possible moves for a pawn. Pawns can move forward one space,
 * or two spaces if it is the first move. Pawns can also capture diagonally.
 * 
 * @param {String[][]} board The board in array format
 * @param {Number} row The row of the pawn
 * @param {Number} col The column of the pawn
 * @param {String} piece The piece representation of the pawn
 * @returns {String[]} An array of possible moves
 */
const generateWhitePawnMoves = (board, row, col, ignore) => {
    const moves = [];
    const possibleMove = [row + 1, col];
    const possibleSpecialMove = [row + 2, col];
    const possibleCaptures = [
        [row + 1, col + 1],
        [row + 1, col - 1],
    ];
    const piece = getPieceAt(board, [row, col]);

    if (isInRange(board, possibleMove) && isEmpty(board, possibleMove, ignore)) {
        if (row === 6) {
            moves.push(convertToAction(possibleMove, ACTION_TYPES.TRANSFORM));
        } else {
            moves.push(convertToAction(possibleMove, ACTION_TYPES.MOVE));
        }

        if (row === 1 && isEmpty(board, possibleSpecialMove, ignore)) {
            moves.push(convertToAction(possibleSpecialMove, ACTION_TYPES.MOVE));
        }
    }

    possibleCaptures.forEach((capture) => {
        if (isInRange(board, capture) && !isEmpty(board, capture, ignore) && isEnemy(piece, board[capture[0]][capture[1]])) {
            moves.push(convertToAction(capture, ACTION_TYPES.CAPTURE));
        }
    });

    return moves;
};

/**
 * Generates possible moves for a pawn. Pawns can move forward one space,
 * or two spaces if it is the first move. Pawns can also capture diagonally.
 * 
 * @param {String[][]} board The board in array format
 * @param {Number[]} position The position of the pawn
 * @param {String} piece The piece representation of the pawn
 * @returns {String[]} An array of possible moves
 */
const generatePawnMoves = (board, [row, col], ignore) => {
    if (isColor(piece, PIECE_COLORS.WHITE)) {
        return generateWhitePawnMoves(board, row, col, ignore);
    } else {
        return generateBlackPawnMoves(board, row, col, ignore);
    }
}

const generateMovesInDirection = (board, [row, col], direction, ignore) => {
    const moves = [];
    const [rowDir, colDir] = direction;
    let [r, c] = [row + rowDir, col + colDir];
    const piece = getPieceAt(board, [row, col]);

    while (isInRange(board, [r, c])) {
        if (isEmpty(board, [r, c], ignore)) {
            moves.push(convertToAction([r, c], ACTION_TYPES.MOVE));
        } else if (isEnemy(piece, getPieceAt(board, [r, c]))) {
            moves.push(convertToAction([r, c], ACTION_TYPES.CAPTURE));
            break;
        } else {
            break;
        }

        r += rowDir;
        c += colDir;
    }

    return moves;
}

const generateMovesInDirections = (board, pos, directions, ignore) => {
    const moves = [];

    directions.forEach((direction) => {
        moves.push(...generateMovesInDirection(board, pos, direction, ignore));
    });

    return moves;
}

const generateRookMoves = (board, pos, ignore) => {
    const directions = [
        DIRECTION_VECTORS.NORTH,
        DIRECTION_VECTORS.EAST,
        DIRECTION_VECTORS.SOUTH,
        DIRECTION_VECTORS.WEST,
    ]

    return generateMovesInDirections(board, pos, directions, ignore);
}

const generateBishopMoves = (board, pos, ignore) => {
    const directions = [
        DIRECTION_VECTORS.NORTH_EAST,
        DIRECTION_VECTORS.SOUTH_EAST,
        DIRECTION_VECTORS.SOUTH_WEST,
        DIRECTION_VECTORS.NORTH_WEST,
    ]

    return generateMovesInDirections(board, pos, directions, ignore);
}

const generateQueenMoves = (board, pos, ignore) => {
    const directions = [
        DIRECTION_VECTORS.NORTH,
        DIRECTION_VECTORS.EAST,
        DIRECTION_VECTORS.SOUTH,
        DIRECTION_VECTORS.WEST,
        DIRECTION_VECTORS.NORTH_EAST,
        DIRECTION_VECTORS.SOUTH_EAST,
        DIRECTION_VECTORS.SOUTH_WEST,
        DIRECTION_VECTORS.NORTH_WEST,
    ]

    return generateMovesInDirections(board, pos, directions, ignore);
}

const generateKnightMoves = (board, [row, col], ignore) => {
    const moves = [];
    const piece = getPieceAt(board, [row, col]);

    const possibleMoves = [
        [row - 2, col - 1],
        [row - 2, col + 1],
        [row - 1, col - 2],
        [row - 1, col + 2],
        [row + 1, col - 2],
        [row + 1, col + 2],
        [row + 2, col - 1],
        [row + 2, col + 1],
    ];

    possibleMoves.forEach((move) => {
        if (isInRange(move, board) && (isEmpty(board, move) || areEnemies(piece, board[move[0]][move[1]]))) {
            if (isEmpty(board, move, ignore)) {
                moves.push(convertToAction(move, ACTION_TYPES.MOVE));
            } else {
                moves.push(convertToAction(move, ACTION_TYPES.CAPTURE));
            }
        }
    });

    return moves;
};


const isSafe = (board, pos, ignore = null) => {
    const piece = ignore ?? getPieceAt(board, pos);
    if (!PIECE_VALUES.isPiece(piece)) {
        return true;
    }

    DIRECTION_VECTORS.forEach((direction) => {
        const nearestPiecePos = findNearestPiece(board, pos, direction, ignore);
        const nearestPiece = getPieceAt(board, nearestPiecePos);

        if (isEnemy(piece, nearestPiece) && canAttackDirection(nearestPiece, direction)) {
            return false;
        }
    });

    const knightMoves = [
        [row - 2, col - 1],
        [row - 2, col + 1],
        [row - 1, col - 2],
        [row - 1, col + 2],
        [row + 1, col - 2],
        [row + 1, col + 2],
        [row + 2, col - 1],
        [row + 2, col + 1],
    ];

    const knightDanger = !knightMoves.some(([r, c]) => {
        if (isInRange([r, c], board)) {
            const knight = getPieceAt(board, [r, c]);
            return isEnemy(piece, knight) && isPiece(knight, PIECE_VALUES.KNIGHT);
        }
    });

    const pawnAttacks = isColor(PIECE_COLORS.WHITE, piece) ? [DIRECTION_VECTORS.NORTH_EAST, DIRECTION_VECTORS.NORTH_WEST] : [DIRECTION_VECTORS.SOUTH_EAST, DIRECTION_VECTORS.SOUTH_WEST];

    const pawnDanger = !pawnAttacks.some((direction) => {
        const [rowDir, colDir] = direction;
        const [r, c] = [row + rowDir, col + colDir];

        if (isInRange(board, [r, c]) && !isEmpty(board, [r, c], ignore)) {
            const pawn = board[r][c];
            return isEnemy(piece, pawn) && isPiece(pawn, PIECE_VALUES.PAWN);
        }
    });

    return knightDanger || pawnDanger
};

const generateKingMoves = (board, [row, col], canCastle) => {
    const moves = [];
    const piece = getPieceAt(board, [row, col]);

    const possibleMoves = [
        [row - 1, col - 1],
        [row - 1, col],
        [row - 1, col + 1],
        [row, col - 1],
        [row, col + 1],
        [row + 1, col - 1],
        [row + 1, col],
        [row + 1, col + 1],
    ];

    possibleMoves.forEach((move) => {
        if (isInRange(board, move) && isSafe(board, move, piece) && !isAlly(piece, board[move[0]][move[1]])) {
            if (isEmpty(board, move, ignore)) {
                moves.push(convertToAction(move, ACTION_TYPES.MOVE));
            } else {
                moves.push(convertToAction(move, ACTION_TYPES.CAPTURE));
            }
        }
    });

    return moves;
};

const generateMovesForPiece = (board, chessPos, canCastle, ignore) => {
    const pos = extractCoords(chessPos);
    const piece = getPieceAt(board, pos);

    if (!piece) {
        return [];
    }

    if (isPiece(piece, PIECE_VALUES.PAWN)) {
        return generatePawnMoves(board, position, piece);
    } else if (isPiece(piece, PIECE_VALUES.ROOK)) {
        return generateRookMoves(board, position, piece);
    } else if (isPiece(piece, PIECE_VALUES.KNIGHT)) {
        return generateKnightMoves(board, position, piece);
    } else if (isPiece(piece, PIECE_VALUES.BISHOP)) {
        return generateBishopMoves(board, position, piece);
    } else if (isPiece(piece, PIECE_VALUES.QUEEN)) {
        return generateQueenMoves(board, position, piece);
    } else if (isPiece(piece, PIECE_VALUES.KING)) {
        return generateKingMoves(board, position, canCastle);
    } else {
        return [];
    }
}

export const validateMove = (board, { piecePos, action }) => {
    const actions = generateMovesForPiece(board, piecePos, ignore);

    if (!actions.includes(action)) {
        return {
            error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.INVALID_ACTION, player)
        };
    }

    return { error: null };
}

export const getPieceAtChessCoords = (board, coords) => {
    return getPieceAt(board, extractCoords(coords));
}
