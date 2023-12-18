import {
    PIECE_VALUES,
    DIRECTION_VECTORS,
    BOARD_ROW_LABELS,
    BOARD_COL_LABELS,
    INITIAL_BOARD_POSITIONS,
    ROW_TO_INDEX, COL_TO_INDEX
} from "../enums";
import { isEnemy, isMatchingPiece, isIdentical, isKing, isPawn, isWhite, isKnight } from "./piece";

const BOARD_SIZE = 8;

/**
 * Checks to see if a board space is empty
 * 
 * @param {String[][]} board The board in array format
 * @param {Number[]} pos The position of the space
 * @returns {Boolean} True if the space is empty, false otherwise
 */
export const isEmpty = (board, [row, col]) => board[row][col] === PIECE_VALUES.EMPTY;

/**
 * Checks to see if a given position is in range of the board
 * 
 * @param {Number[]} pos The position to check
 * @returns {Boolean} True if the position is in range, false otherwise
 */
export const isInRange = ([row, col]) => row >= 0 && row < BOARD_ROW_LABELS.length && col >= 0 && col < BOARD_COL_LABELS.length;

/**
 * Looks for the closet piece in a given direction, starting at the given position.
 * It ignores the given piece, and will return null if no piece is found.
 * 
 * @param {String[][]} board The board in array format
 * @param {Number[]} pos The position of the space to start at
 * @param {Number[]} direction The direction to search in
 * @param {String} piece The piece to ignore
 * @returns {Number[] | null} The position of the nearest piece, or null if no piece is found
 */
export const findNearestPiece = (board, [row, col], direction, piece) => {
    const [rowDir, colDir] = direction;
    let [r, c] = [row + rowDir, col + colDir];

    while (isInRange([r, c])) {
        if (!isEmpty(board, [r, c]) && !isIdentical(board[r][c], piece)) {
            return [r, c];
        }

        r += rowDir;
        c += colDir;
    }

    return null;
}

/**
 * Checks to see if a given piece exists on the board and is occupied by an enemy piece
 * 
 * @param {Number[] | null} coords The coordinates on the board to check
 * @param {String[]} board The board to check
 * @param {String} piece The piece that could be in danger
 * @returns {Boolean} True if the piece is possibly danger, false otherwise
 */
const isPotentialDanger = (coords, board, piece) => {
    if (coords) {
        const [row, col] = coords;
        return isEnemy(piece, board[row][col]);
    }
}

const isHorozontalSafe = (board, [row, col], piece) => {
    const left = findNearestPiece(board, [row, col], DIRECTION_VECTORS.WEST, piece);
    const right = findNearestPiece(board, [row, col], DIRECTION_VECTORS.EAST, piece);

    if (isPotentialDanger(left, board, piece)) {
        const leftPiece = board[left[0]][left[1]];

        if (isMatchingPiece(leftPiece, PIECE_VALUES.ROOK, PIECE_VALUES.QUEEN)) {
            return false;
        } else if (left[1] === col - 1 && isKing(leftPiece)) {
            return false;
        }
    }

    if (isPotentialDanger(right, board, piece)) {
        const rightPiece = board[right[0]][right[1]];

        if (isMatchingPiece(rightPiece, PIECE_VALUES.ROOK, PIECE_VALUES.QUEEN)) {
            return false;
        } else if (right[1] === col + 1 && isKing(rightPiece)) {
            return false;
        }
    }

    return true;
}

const isVerticalSafe = (board, [row, col], piece) => {
    const up = findNearestPiece(board, [row, col], DIRECTION_VECTORS.NORTH, piece);
    const down = findNearestPiece(board, [row, col], DIRECTION_VECTORS.SOUTH, piece);

    if (isPotentialDanger(up, board, piece)) {
        const upPiece = board[up[0]][up[1]];

        if (isMatchingPiece(upPiece, PIECE_VALUES.ROOK, PIECE_VALUES.QUEEN)) {
            return false;
        } else if (up[0] === row - 1 && isKing(upPiece)) {
            return false;
        }
    }

    if (isPotentialDanger(down, board, piece)) {
        const downPiece = board[down[0]][down[1]];

        if (isMatchingPiece(downPiece, PIECE_VALUES.ROOK, PIECE_VALUES.QUEEN)) {
            return false;
        } else if (down[0] === row + 1 && isKing(downPiece)) {
            return false;
        }
    }

    return true;
}

const isPawnSafe = (board, [row, col], piece) => {
    const pawnAttacks = isWhite(piece) ? [DIRECTION_VECTORS.NORTH_EAST, DIRECTION_VECTORS.NORTH_WEST] : [DIRECTION_VECTORS.SOUTH_EAST, DIRECTION_VECTORS.SOUTH_WEST];

    return !pawnAttacks.some((direction) => {
        const [rowDir, colDir] = direction;
        const [r, c] = [row + rowDir, col + colDir];

        if (isInRange([r, c]) && !isEmpty(board, [r, c])) {
            const pawn = board[r][c];
            return isEnemy(piece, pawn) && isPawn(pawn);
        }
    });
}

const isDiagonalSafe = (board, [row, col], piece) => {
    const northEast = findNearestPiece(board, [row, col], DIRECTION_VECTORS.NORTH_EAST, piece);
    const southEast = findNearestPiece(board, [row, col], DIRECTION_VECTORS.SOUTH_EAST, piece);
    const southWest = findNearestPiece(board, [row, col], DIRECTION_VECTORS.SOUTH_WEST, piece);
    const northWest = findNearestPiece(board, [row, col], DIRECTION_VECTORS.NORTH_WEST, piece);

    if (!isPawnSafe(board, [row, col], piece)) {
        return false;
    }

    if (isPotentialDanger(northEast, board, piece)) {
        const northEastPiece = board[northEast[0]][northEast[1]];

        if (isMatchingPiece(northEastPiece, PIECE_VALUES.BISHOP, PIECE_VALUES.QUEEN)) {
            return false;
        } else if (northEast[0] === row - 1 && northEast[1] === col + 1 && isKing(northEastPiece)) {
            return false;
        }
    }

    if (isPotentialDanger(southEast, board, piece)) {
        const southEastPiece = board[southEast[0]][southEast[1]];

        if (isMatchingPiece(southEastPiece, PIECE_VALUES.BISHOP, PIECE_VALUES.QUEEN)) {
            return false;
        } else if (southEast[0] === row + 1 && southEast[1] === col + 1 && isKing(southEastPiece)) {
            return false;
        }
    }

    if (isPotentialDanger(southWest, board, piece)) {
        const southWestPiece = board[southWest[0]][southWest[1]];

        if (isMatchingPiece(southWestPiece, PIECE_VALUES.BISHOP, PIECE_VALUES.QUEEN)) {
            return false;
        } else if (southWest[0] === row + 1 && southWest[1] === col - 1 && isKing(southWestPiece)) {
            return false;
        }
    }

    if (isPotentialDanger(northWest, board, piece)) {
        const northWestPiece = board[northWest[0]][northWest[1]];

        if (isMatchingPiece(northWestPiece, PIECE_VALUES.BISHOP, PIECE_VALUES.QUEEN)) {
            return false;
        } else if (northWest[0] === row - 1 && northWest[1] === col - 1 && isKing(northWestPiece)) {
            return false;
        }
    }

    return true;
}

/**
 * Checks to see if a space is safe for a piece to move. A space is safe if
 * there are no enemy pieces that can capture the piece on the space. The given 
 * piece isn't assumed to be on the space, and if encountered, it should be ignored.
 * To check if a space is safe, all horizontal, vertical, and diagonal spaces should
 * be checked for enemy pieces that can capture the piece on the space. As well as
 * all knight moves from the space. If any of those spaces contain an enemy piece
 * that can capture the piece on the space, the space is not safe.
 * 
 * @param {String[][]} board The board in array format
 * @param {Number} row The row of the space
 * @param {Number} col The column of the space
 * @param {String} piece The piece to keep safe
 * @returns {Boolean} True if the space is safe, false otherwise
 */
export const isSafe = (board, [row, col], piece) => {
    const isDirectionalSafe = isHorozontalSafe(board, [row, col], piece) && isVerticalSafe(board, [row, col], piece) && isDiagonalSafe(board, [row, col], piece);
    if (!isDirectionalSafe) {
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

    return !knightMoves.some(([r, c]) => {
        if (isInRange([r, c])) {
            const knight = board[r][c];
            return isEnemy(piece, knight) && isKnight(knight);
        }
    });
};

/**
 * Creates an empty board with no pieces.
 * 
 * @returns {String[][]} The empty board
 */
export const createEmptyBoard = () => {
    const board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        board.push([]);
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i].push('');
        }
    }
    return board;
};

export const createInitialBoard = () => {
    const board = createEmptyBoard();

    Object.entries(INITIAL_BOARD_POSITIONS).forEach(([piece, pos]) => {
        const row = ROW_TO_INDEX[pos[1]];
        const col = COL_TO_INDEX[pos[0]];

        board[row][col] = piece;
    });

    return board;
}
