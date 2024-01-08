import { GAME_VALIDATION_MESSAGES, PIECE_VALUES, DIRECTION_VECTORS, PIECE_COLORS, CAPTURED_PIECE } from '../enum';
import { isEnemy } from '../../tools/tools/piece';
import { extractCoords } from './translate';
import { areAllies, areEnemies, canAttackDirection, isColor, isPiece, ownsPiece } from './piece';
import { convertToAction, executeAction } from './action';
import { ACTION_TYPES } from '../../tools/enums';

const isInRange = (board, [row, col]) => {
    if (0 <= row && row < board.length) {
        if (0 <= col && col < board[row].length) {
            return true;
        }
    }

    return false;
}

const copyBoard = (board) => {
    const newBoard = [];

    board.forEach((row) => {
        newBoard.push([...row]);
    });

    return newBoard;
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

    while (isInRange(board, [r, c])) {
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
const generateBlackPawnMoves = (board, [row, col], piece) => {
    const moves = [];
    const possibleMove = [row - 1, col];
    const possibleSpecialMove = [row - 2, col];
    const possibleCaptures = [
        [row - 1, col + 1],
        [row - 1, col - 1],
    ];

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
        if (isInRange(board, capture) && !isEmpty(board, capture, piece) && isEnemy(piece, board[capture[0]][capture[1]])) {
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
const generateWhitePawnMoves = (board, [row, col], piece) => {
    const moves = [];
    const possibleMove = [row + 1, col];
    const possibleSpecialMove = [row + 2, col];
    const possibleCaptures = [
        [row + 1, col + 1],
        [row + 1, col - 1],
    ];

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
        if (isInRange(board, capture) && !isEmpty(board, capture, piece) && isEnemy(piece, board[capture[0]][capture[1]])) {
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
const generatePawnMoves = (board, pos, piece, registry) => {
    if (registry[piece]) {
        const transformedPiece = piece[0] + registry[piece];

        if (isPiece(transformedPiece, PIECE_VALUES.ROOK)) {
            return generateRookMoves(board, pos, piece);
        } else if (isPiece(transformedPiece, PIECE_VALUES.KNIGHT)) {
            return generateKnightMoves(board, pos, piece);
        } else if (isPiece(transformedPiece, PIECE_VALUES.BISHOP)) {
            return generateBishopMoves(board, pos, piece);
        } else if (isPiece(transformedPiece, PIECE_VALUES.QUEEN)) {
            return generateQueenMoves(board, pos, piece);
        }
    }

    if (isColor(piece, PIECE_COLORS.WHITE)) {
        return generateWhitePawnMoves(board, pos, piece);
    } else {
        return generateBlackPawnMoves(board, pos, piece);
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

const generateKnightMoves = (board, [row, col], piece) => {
    const moves = [];

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
        if (isInRange(board, move)) {
            if (isEmpty(board, move, piece)) {
                moves.push(convertToAction(move, ACTION_TYPES.MOVE));
            } else if (areEnemies(piece, board[move[0]][move[1]])) {
                moves.push(convertToAction(move, ACTION_TYPES.CAPTURE));
            }
        }
    });

    return moves;
};


const isSafe = (board, pos, ignore, registry) => {
    const piece = ignore ?? getPieceAt(board, pos);
    if (!piece) {
        return true;
    }

    const [row, col] = pos;

    const directionalDanger = Object.values(DIRECTION_VECTORS).some((direction) => {
        const nearestPiecePos = findNearestPiece(board, pos, direction, ignore);

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
        [row - 2, col - 1],
        [row - 2, col + 1],
        [row - 1, col - 2],
        [row - 1, col + 2],
        [row + 1, col - 2],
        [row + 1, col + 2],
        [row + 2, col - 1],
        [row + 2, col + 1],
    ];

    const knightDanger = knightMoves.some(([r, c]) => {
        if (isInRange(board, [r, c])) {
            const knight = getPieceAt(board, [r, c]);
            return isEnemy(piece, knight) && isPiece(knight, PIECE_VALUES.KNIGHT, registry);
        }
    });

    const pawnAttacks = isColor(piece, PIECE_COLORS.BLACK) ? [DIRECTION_VECTORS.NORTH_EAST, DIRECTION_VECTORS.NORTH_WEST] : [DIRECTION_VECTORS.SOUTH_EAST, DIRECTION_VECTORS.SOUTH_WEST];

    const pawnDanger = pawnAttacks.some((direction) => {
        const [rowDir, colDir] = direction;
        const [r, c] = [row + rowDir, col + colDir];

        if (isInRange(board, [r, c]) && !isEmpty(board, [r, c], ignore)) {
            const pawn = board[r][c];
            return isEnemy(piece, pawn) && isPiece(pawn, PIECE_VALUES.PAWN);
        }
    });

    return !knightDanger && !pawnDanger
};

const validLongCastle = (board, [row, col], piece, canCastle, registry) => {
    if (!canCastle[1]) {
        return false;
    }

    const isAllEmpty = [1, 2, 3, 4].every((castleCol) => {
        return isEmpty(board, [row, castleCol], piece);
    });
    if (!isAllEmpty) {
        return false;
    }

    const isAllSafe = [1, 2, 3, 4].every((castleCol) => {
        return isSafe(board, [row, castleCol], piece, registry);
    });
    if (!isAllSafe) {
        return false;
    }

    if (!isPiece(board[row][0], PIECE_VALUES.ROOK) || !areAllies(piece, board[row][0])) {
        return false;
    }

    return true;
}

const validShortCastle = (board, [row, col], piece, canCastle, registry) => {
    if (!canCastle[2]) {
        return false;
    }

    const isAllEmpty = [4, 5, 6].every((castleCol) => {
        return isEmpty(board, [row, castleCol], piece);
    });
    if (!isAllEmpty) {
        return false;
    }

    const isAllSafe = [4, 5, 6].every((castleCol) => {
        return isSafe(board, [row, castleCol], piece, registry);
    });
    if (!isAllSafe) {
        return false;
    }

    if (!isPiece(board[row][7], PIECE_VALUES.ROOK) || !areAllies(piece, board[row][7])) {
        return false;
    }

    return true;
}

const generateKingMoves = (board, [row, col], piece, canCastle, registry) => {
    const moves = [];

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
        if (isInRange(board, move) && isSafe(board, move, piece, registry) && !areAllies(piece, board[move[0]][move[1]])) {
            if (isEmpty(board, move, piece)) {
                moves.push(convertToAction(move, ACTION_TYPES.MOVE));
            } else {
                moves.push(convertToAction(move, ACTION_TYPES.CAPTURE));
            }
        }
    });

    if (validLongCastle(board, [row, 0], piece, canCastle, registry)) {
        moves.push(convertToAction([row, 2], ACTION_TYPES.CASTLE));
    }
    if (validShortCastle(board, [row, 7], piece, canCastle, registry)) {
        moves.push(convertToAction([row, 6], ACTION_TYPES.CASTLE));
    }



    return moves;
};

const generateMovesForPiece = (board, chessPos, canCastle, registry, kingPos, ignore) => {
    const pos = extractCoords(chessPos);
    const piece = ignore || getPieceAt(board, pos);
    let actions = [];

    if (!piece) {
        return [];
    }

    if (isPiece(piece, PIECE_VALUES.PAWN)) {
        actions = generatePawnMoves(board, pos, piece, registry);
    } else if (isPiece(piece, PIECE_VALUES.ROOK)) {
        actions = generateRookMoves(board, pos, piece);
    } else if (isPiece(piece, PIECE_VALUES.KNIGHT)) {
        actions = generateKnightMoves(board, pos, piece);
    } else if (isPiece(piece, PIECE_VALUES.BISHOP)) {
        actions = generateBishopMoves(board, pos, piece);
    } else if (isPiece(piece, PIECE_VALUES.QUEEN)) {
        actions = generateQueenMoves(board, pos, piece);
    } else if (isPiece(piece, PIECE_VALUES.KING)) {
        return generateKingMoves(board, pos, piece, canCastle, registry);
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
    const pos = extractCoords(chessPos);
    const piece = ignore || getPieceAt(board, pos);

    return isSafe(board, pos, piece, registry);
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
    const [startRow, startCol] = extractCoords(start);
    const [endRow, endCol] = extractCoords(end);

    board[endRow][endCol] = board[startRow][startCol];
    board[startRow][startCol] = PIECE_VALUES.EMPTY;

    return board;
}

export const placePiece = (board, pos, piece) => {
    if (pos !== CAPTURED_PIECE) {
        const [row, col] = extractCoords(pos);
        board[row][col] = piece;
    }

    return board;
}

export const getPieceAtChessCoords = (board, coords) => {
    return getPieceAt(board, extractCoords(coords));
}
