import { GAME_VALIDATION_MESSAGES, PIECE_VALUES, DIRECTION_VECTORS, PIECE_COLORS, CAPTURED_PIECE, ROW_TO_INDEX, COL_TO_INDEX, INDEX_TO_ROW, INDEX_TO_COL } from '../enum';
import { isEnemy } from '../../tools/tools/piece';
import { extractCoords } from './translate';
import { areAllies, areEnemies, canAttackDirection, isColor, isPiece, ownsPiece } from './piece';
import { convertToAction, executeAction } from './action';
import { ACTION_TYPES } from '../../tools/enums';

const isInRange = (board, chessPos) => {
    return chessPos !== null;
}

const copyBoard = (board) => {
    return { ...board };
}

const getPieceAt = (board, chessPos) => {
    return board[chessPos];
}

const movePos = (chessPos, rowAmt, colAmt) => {
    const [col, row] = chessPos.split('');

    const newRow = ROW_TO_INDEX[row] + rowAmt;
    const newCol = COL_TO_INDEX[col] + colAmt;

    if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) {
        return null;
    }

    return INDEX_TO_COL[newCol] + INDEX_TO_ROW[newRow];
}

const isEmpty = (board, chessPos, ignore) => {
    const piece = getPieceAt(board, chessPos);

    return !piece || PIECE_VALUES.isEqual(piece, ignore);
}

const findNearestPiece = (board, chessPos, direction, piece) => {
    const [rowDir, colDir] = direction;
    let checkPos = movePos(chessPos, rowDir, colDir);

    while (isInRange(board, checkPos)) {
        if (!isEmpty(board, checkPos, piece)) {
            return checkPos;
        }

        checkPos = movePos(checkPos, rowDir, colDir);
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
const generateBlackPawnMoves = (board, chessPos, piece) => {
    const moves = [];
    const possibleMove = movePos(chessPos, -1, 0);
    const possibleSpecialMove = movePos(chessPos, -2, 0);
    const possibleCaptures = [
        movePos(chessPos, -1, 1),
        movePos(chessPos, -1, -1),
    ];
    const row = ROW_TO_INDEX[chessPos[1]];

    if (isInRange(board, possibleMove) && isEmpty(board, possibleMove, piece)) {
        if (row === 1) {
            moves.push(convertToAction(possibleMove, ACTION_TYPES.TRANSFORM));
        } else {
            moves.push(convertToAction(possibleMove, ACTION_TYPES.MOVE));
        }

        if (row === 6 && isEmpty(board, possibleSpecialMove, piece)) {
            moves.push(convertToAction(possibleSpecialMove, ACTION_TYPES.MOVE));
        }
    }

    possibleCaptures.forEach((capture) => {
        if (isInRange(board, capture) && !isEmpty(board, capture, piece) && isEnemy(piece, getPieceAt(board, capture))) {
            const action = row === 1 ? ACTION_TYPES.TRANSFORM : ACTION_TYPES.CAPTURE;

            moves.push(convertToAction(capture, action));
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
const generateWhitePawnMoves = (board, chessPos, piece) => {
    const moves = [];
    const possibleMove = movePos(chessPos, 1, 0);
    const possibleSpecialMove = movePos(chessPos, 2, 0);
    const possibleCaptures = [
        movePos(chessPos, 1, 1),
        movePos(chessPos, 1, -1),
    ];
    const row = ROW_TO_INDEX[chessPos[1]];

    if (isInRange(board, possibleMove) && isEmpty(board, possibleMove, piece)) {
        if (row === 6) {
            moves.push(convertToAction(possibleMove, ACTION_TYPES.TRANSFORM));
        } else {
            moves.push(convertToAction(possibleMove, ACTION_TYPES.MOVE));
        }

        if (row === 1 && isEmpty(board, possibleSpecialMove, piece)) {
            moves.push(convertToAction(possibleSpecialMove, ACTION_TYPES.MOVE));
        }
    }

    possibleCaptures.forEach((capture) => {
        if (isInRange(board, capture) && !isEmpty(board, capture, piece) && isEnemy(piece, getPieceAt(board, capture))) {
            const action = row === 6 ? ACTION_TYPES.TRANSFORM : ACTION_TYPES.CAPTURE;

            moves.push(convertToAction(capture, action));
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
const generatePawnMoves = (board, chessPos, piece, registry) => {
    if (registry[piece]) {
        const transformedPiece = piece[0] + registry[piece];

        if (isPiece(transformedPiece, PIECE_VALUES.ROOK)) {
            return generateRookMoves(board, chessPos, piece);
        } else if (isPiece(transformedPiece, PIECE_VALUES.KNIGHT)) {
            return generateKnightMoves(board, chessPos, piece);
        } else if (isPiece(transformedPiece, PIECE_VALUES.BISHOP)) {
            return generateBishopMoves(board, chessPos, piece);
        } else if (isPiece(transformedPiece, PIECE_VALUES.QUEEN)) {
            return generateQueenMoves(board, chessPos, piece);
        }
    }

    if (isColor(piece, PIECE_COLORS.WHITE)) {
        return generateWhitePawnMoves(board, chessPos, piece);
    } else {
        return generateBlackPawnMoves(board, chessPos, piece);
    }
}

const generateMovesInDirection = (board, chessPos, direction, ignore) => {
    const moves = [];
    const [rowDir, colDir] = direction;
    let actionPos = movePos(chessPos, rowDir, colDir);
    const piece = ignore || getPieceAt(board, chessPos);

    while (isInRange(board, actionPos)) {
        if (isEmpty(board, actionPos, ignore)) {
            moves.push(convertToAction(actionPos, ACTION_TYPES.MOVE));
        } else if (isEnemy(piece, getPieceAt(board, actionPos))) {
            moves.push(convertToAction(actionPos, ACTION_TYPES.CAPTURE));
            break;
        } else {
            break;
        }

        actionPos = movePos(actionPos, rowDir, colDir);
    }

    return moves;
}

const generateMovesInDirections = (board, chessPos, directions, ignore) => {
    const moves = [];

    directions.forEach((direction) => {
        moves.push(...generateMovesInDirection(board, chessPos, direction, ignore));
    });

    return moves;
}

const generateRookMoves = (board, chessPos, ignore) => {
    const directions = [
        DIRECTION_VECTORS.NORTH,
        DIRECTION_VECTORS.EAST,
        DIRECTION_VECTORS.SOUTH,
        DIRECTION_VECTORS.WEST,
    ]

    return generateMovesInDirections(board, chessPos, directions, ignore);
}

const generateBishopMoves = (board, chessPos, ignore) => {
    const directions = [
        DIRECTION_VECTORS.NORTH_EAST,
        DIRECTION_VECTORS.SOUTH_EAST,
        DIRECTION_VECTORS.SOUTH_WEST,
        DIRECTION_VECTORS.NORTH_WEST,
    ]

    return generateMovesInDirections(board, chessPos, directions, ignore);
}

const generateQueenMoves = (board, chessPos, ignore) => {
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

    return generateMovesInDirections(board, chessPos, directions, ignore);
}

const generateKnightMoves = (board, chessPos, piece) => {
    const moves = [];

    const possibleMoves = [
        movePos(chessPos, -2, -1),
        movePos(chessPos, -2, 1),
        movePos(chessPos, -1, -2),
        movePos(chessPos, -1, 2),
        movePos(chessPos, 1, -2),
        movePos(chessPos, 1, 2),
        movePos(chessPos, 2, -1),
        movePos(chessPos, 2, 1),
    ];

    possibleMoves.forEach((move) => {
        if (isInRange(board, move)) {
            if (isEmpty(board, move, piece)) {
                moves.push(convertToAction(move, ACTION_TYPES.MOVE));
            } else if (areEnemies(piece, getPieceAt(board, move))) {
                moves.push(convertToAction(move, ACTION_TYPES.CAPTURE));
            }
        }
    });

    return moves;
};


const isSafe = (board, chessPos, ignore, registry) => {
    const piece = ignore ?? getPieceAt(board, chessPos);
    if (!piece) {
        return true;
    }

    const directionalDanger = Object.values(DIRECTION_VECTORS).some((direction) => {
        const nearestPiecePos = findNearestPiece(board, chessPos, direction, ignore);

        if (nearestPiecePos) {
            const nearestPiece = getPieceAt(board, nearestPiecePos);

            if (isEnemy(piece, nearestPiece)) {
                if (canAttackDirection(nearestPiece, direction, registry)) {
                    return true;
                }
            }
        }

        return false;
    });

    if (directionalDanger) {
        return false;
    }

    const knightMoves = [
        movePos(chessPos, -2, -1),
        movePos(chessPos, -2, 1),
        movePos(chessPos, -1, -2),
        movePos(chessPos, -1, 2),
        movePos(chessPos, 1, -2),
        movePos(chessPos, 1, 2),
        movePos(chessPos, 2, -1),
        movePos(chessPos, 2, 1),
    ];

    const knightDanger = knightMoves.some((actionPos) => {
        if (isInRange(board, actionPos)) {
            const knight = getPieceAt(board, actionPos);
            return isEnemy(piece, knight) && isPiece(knight, PIECE_VALUES.KNIGHT, registry);
        }
    });

    const pawnAttacks = isColor(piece, PIECE_COLORS.BLACK) ? [DIRECTION_VECTORS.NORTH_EAST, DIRECTION_VECTORS.NORTH_WEST] : [DIRECTION_VECTORS.SOUTH_EAST, DIRECTION_VECTORS.SOUTH_WEST];

    const pawnDanger = pawnAttacks.some((direction) => {
        const [rowDir, colDir] = direction;
        const tempPos = movePos(chessPos, rowDir, colDir);

        if (isInRange(board, tempPos) && !isEmpty(board, tempPos, ignore)) {
            const pawn = getPieceAt(board, tempPos);
            return isEnemy(piece, pawn) && isPiece(pawn, PIECE_VALUES.PAWN);
        }
    });

    return !knightDanger && !pawnDanger
};

const validLongCastle = (board, chessPos, piece, canCastle, registry) => {
    if (!canCastle[1]) {
        return false;
    }

    const isAllEmpty = [1, 2, 3, 4].every((castleCol) => {
        const checkPos = INDEX_TO_COL[castleCol] + chessPos[1]

        return isEmpty(board, checkPos, piece);
    });
    if (!isAllEmpty) {
        return false;
    }

    const isAllSafe = [1, 2, 3, 4].every((castleCol) => {
        const checkPos = INDEX_TO_COL[castleCol] + chessPos[1]

        return isSafe(board, checkPos, piece, registry);
    });
    if (!isAllSafe) {
        return false;
    }

    if (!isPiece(getPieceAt(board, 'A' + chessPos[1]), PIECE_VALUES.ROOK) || !areAllies(piece, getPieceAt(board, 'A' + chessPos[1]))) {
        return false;
    }

    return true;
}

const validShortCastle = (board, chessPos, piece, canCastle, registry) => {
    if (!canCastle[2]) {
        return false;
    }

    const isAllEmpty = [4, 5, 6].every((castleCol) => {
        const checkPos = INDEX_TO_COL[castleCol] + chessPos[1]

        return isEmpty(board, checkPos, piece);
    });
    if (!isAllEmpty) {
        return false;
    }

    const isAllSafe = [4, 5, 6].every((castleCol) => {
        const checkPos = INDEX_TO_COL[castleCol] + chessPos[1]

        return isSafe(board, checkPos, piece, registry);
    });
    if (!isAllSafe) {
        return false;
    }

    if (!isPiece(getPieceAt(board, 'H' + chessPos[1]), PIECE_VALUES.ROOK) || !areAllies(piece, getPieceAt(board, 'H' + chessPos[1]))) {
        return false;
    }

    return true;
}

const generateKingMoves = (board, chessPos, piece, canCastle, registry) => {
    const moves = [];

    const possibleMoves = [
        movePos(chessPos, -1, -1),
        movePos(chessPos, -1, 0),
        movePos(chessPos, -1, 1),
        movePos(chessPos, 0, -1),
        movePos(chessPos, 0, 1),
        movePos(chessPos, 1, -1),
        movePos(chessPos, 1, 0),
        movePos(chessPos, 1, 1),
    ];

    possibleMoves.forEach((move) => {
        if (isInRange(board, move) && isSafe(board, move, piece, registry) && !areAllies(piece, getPieceAt(board, move))) {
            if (isEmpty(board, move, piece)) {
                moves.push(convertToAction(move, ACTION_TYPES.MOVE));
            } else {
                moves.push(convertToAction(move, ACTION_TYPES.CAPTURE));
            }
        }
    });

    if (validLongCastle(board, 'A' + chessPos[1], piece, canCastle, registry)) {
        moves.push(convertToAction('C' + chessPos[1], ACTION_TYPES.CASTLE));
    }
    if (validShortCastle(board, 'H' + chessPos[1], piece, canCastle, registry)) {
        moves.push(convertToAction('G' + chessPos[1], ACTION_TYPES.CASTLE));
    }



    return moves;
};

const generateMovesForPiece = (board, chessPos, canCastle, registry, kingPos, ignore) => {
    const piece = ignore || getPieceAt(board, chessPos);
    let actions = [];

    if (!piece) {
        return [];
    }

    if (isPiece(piece, PIECE_VALUES.PAWN)) {
        actions = generatePawnMoves(board, chessPos, piece, registry);
    } else if (isPiece(piece, PIECE_VALUES.ROOK)) {
        actions = generateRookMoves(board, chessPos, piece);
    } else if (isPiece(piece, PIECE_VALUES.KNIGHT)) {
        actions = generateKnightMoves(board, chessPos, piece);
    } else if (isPiece(piece, PIECE_VALUES.BISHOP)) {
        actions = generateBishopMoves(board, chessPos, piece);
    } else if (isPiece(piece, PIECE_VALUES.QUEEN)) {
        actions = generateQueenMoves(board, chessPos, piece);
    } else if (isPiece(piece, PIECE_VALUES.KING)) {
        return generateKingMoves(board, chessPos, piece, canCastle, registry);
    } else {
        return [];
    }

    return actions.filter((action) => {
        const nextBoard = movePiece(copyBoard(board), chessPos, action.substring(0, 2));

        return isSafeMove(nextBoard, kingPos, registry);
    })
}

const exitsCheck = (board, registry, piecePos, move, kingPos) => {
    const nextBoard = executeAction(copyBoard(board), piecePos, move, {});

    const newKingChessPos = piecePos === kingPos ? move.substring(0, 2) : kingPos;

    return isSafeMove(nextBoard, newKingChessPos, registry);
}

export const validateMove = (board, { piecePos, action }, canCastle, registry = {}, kingPos = 'XX', ignore) => {
    const actions = generateMovesForPiece(board, piecePos, canCastle, registry, kingPos, ignore);

    if (!actions.includes(action)) {
        return {
            error: GAME_VALIDATION_MESSAGES.INVALID_ACTION
        };
    }

    return { error: null };
}

export const isSafeMove = (board, chessPos, registry, ignore) => {
    const piece = ignore || getPieceAt(board, chessPos);

    return isSafe(board, chessPos, piece, registry);
}

export const getTurnInfo = (board, player, positions, registry, canCastle) => {
    const actions = {};
    const isKingSafe = isSafeMove(board, positions[player + PIECE_VALUES.KING], registry);

    Object.keys(positions).forEach((piece) => {
        if (isColor(piece, player)) {
            if (positions[piece] !== 'XX') {
                actions[piece] = generateMovesForPiece(
                    board,
                    positions[piece],
                    canCastle,
                    registry,
                    positions[player + PIECE_VALUES.KING],
                    piece
                );
            } else {
                actions[piece] = [];
            }
        }
    });

    if (!isKingSafe) {
        Object.keys(actions).forEach((piece) => {
            actions[piece] = actions[piece].filter((move) => {
                return exitsCheck(board, registry, positions[piece], move, positions[player + PIECE_VALUES.KING]);
            });
        });
    }

    return { actions, isKingSafe };
}

export const movePiece = (board, start, end) => {
    board[end] = board[start];
    board[start] = PIECE_VALUES.EMPTY;

    return board;
}

export const placePiece = (board, chessPos, piece) => {
    if (chessPos !== CAPTURED_PIECE) {
        board[chessPos] = piece;
    }

    return board;
}

export const removePiece = (board, chessPos) => {
    delete board[chessPos];

    return board;
}

export const getPieceAtChessCoords = (board, coords) => {
    return getPieceAt(board, coords);
}
