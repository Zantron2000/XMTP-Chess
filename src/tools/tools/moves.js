import { isWhite, isEnemy, isBishop, isKing, isKnight, isQueen, isRook, isPawn } from "./piece";
import { isSafe, isInRange, isEmpty } from "./board";
import { PIECE_VALUES } from "../enums";

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
const generateBlackPawnMoves = (board, row, col, piece) => {
    const moves = [];
    const possibleMove = [row + 1, col];
    const possibleSpecialMove = [row + 2, col];
    const possibleCaptures = [
        [row + 1, col + 1],
        [row + 1, col - 1],
    ];

    if (isInRange(possibleMove) && isEmpty(board, possibleMove)) {
        moves.push(`${possibleMove[0]}${possibleMove[1]}M`);

        if (row === 1 && isEmpty(board, possibleSpecialMove)) {
            moves.push(`${possibleSpecialMove[0]}${possibleSpecialMove[1]}M`);
        }
    }

    possibleCaptures.forEach((capture) => {
        if (isInRange(capture) && !isEmpty(board, capture) && isEnemy(piece, board[capture[0]][capture[1]])) {
            moves.push(`${capture[0]}${capture[1]}C`);
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
const generateWhitePawnMoves = (board, row, col, piece) => {
    const moves = [];
    const possibleMove = [row - 1, col];
    const possibleSpecialMove = [row - 2, col];
    const possibleCaptures = [
        [row - 1, col + 1],
        [row - 1, col - 1],
    ];

    if (isInRange(possibleMove) && isEmpty(board, possibleMove)) {
        moves.push(`${possibleMove[0]}${possibleMove[1]}M`);

        if (row === 6 && isEmpty(board, possibleSpecialMove)) {
            moves.push(`${possibleSpecialMove[0]}${possibleSpecialMove[1]}M`);
        }
    }

    possibleCaptures.forEach((capture) => {
        if (isInRange(capture) && !isEmpty(board, capture) && isEnemy(piece, board[capture[0]][capture[1]])) {
            moves.push(`${capture[0]}${capture[1]}C`);
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
const generatePawnMoves = (board, [row, col], piece) => {
    if (isWhite(piece)) {
        return generateWhitePawnMoves(board, row, col, piece);
    } else {
        return generateBlackPawnMoves(board, row, col, piece);
    }
}

/**
 * Generates possible moves for a rook. Rooks can move horizontally or vertically
 * any number of spaces. Rooks cannot jump over pieces.
 * 
 * @param {String[][]} board The board in array format
 * @param {Number[]} position The position of the rook
 * @param {String} piece The piece representation of the rook
 * @returns {String[]} An array of possible moves
 */
const generateRookMoves = (board, [row, col], piece) => {
    const moves = [];

    const north = [row - 1, col];
    while (isInRange(north) && isEmpty(board, north)) {
        moves.push(`${north[0]}${north[1]}M`);
        north[0]--;
    }
    if (isInRange(north) && isEnemy(piece, board[north[0]][north[1]])) {
        moves.push(`${north[0]}${north[1]}C`);
    }

    const south = [row + 1, col];
    while (isInRange(south) && isEmpty(board, south)) {
        moves.push(`${south[0]}${south[1]}M`);
        south[0]++;
    }
    if (isInRange(south) && isEnemy(piece, board[south[0]][south[1]])) {
        moves.push(`${south[0]}${south[1]}C`);
    }

    const east = [row, col + 1];
    while (isInRange(east) && isEmpty(board, east)) {
        moves.push(`${east[0]}${east[1]}M`);
        east[1]++;
    }
    if (isInRange(east) && isEnemy(piece, board[east[0]][east[1]])) {
        moves.push(`${east[0]}${east[1]}C`);
    }

    const west = [row, col - 1];
    while (isInRange(west) && isEmpty(board, west)) {
        moves.push(`${west[0]}${west[1]}M`);
        west[1]--;
    }
    if (isInRange(west) && isEnemy(piece, board[west[0]][west[1]])) {
        moves.push(`${west[0]}${west[1]}C`);
    }

    return moves;
};

/**
 * Generates possible moves for a knight. Knights can move in an L shape,
 * two spaces in one direction and one space in another direction.
 * 
 * @param {String[][]} board The board in array format
 * @param {Number[]} position The position of the rook
 * @param {String} piece The piece representation of the knight
 * @returns {String[]} An array of possible moves
 */
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
        if (isInRange(move) && (isEmpty(board, move) || isEnemy(piece, board[move[0]][move[1]]))) {
            moves.push(`${move[0]}${move[1]}${isEmpty(board, move) ? 'M' : 'C'}`);
        }
    });

    return moves;
};

/**
 * Generates possible moves for a bishop. Bishops can move diagonally
 * any number of spaces. Bishops cannot jump over pieces.
 * 
 * @param {String[][]} board The board in array format
 * @param {Number[]} position The position of the bishop
 * @param {String} piece The piece representation of the bishop
 * @returns {String[]} An array of possible moves
 */
const generateBishopMoves = (board, [row, col], piece) => {
    const moves = [];

    const northEast = [row - 1, col + 1];
    while (isInRange(northEast) && isEmpty(board, northEast)) {
        moves.push(`${northEast[0]}${northEast[1]}M`);
        northEast[0]--;
        northEast[1]++;
    }
    if (isInRange(northEast) && isEnemy(piece, board[northEast[0]][northEast[1]])) {
        moves.push(`${northEast[0]}${northEast[1]}C`);
    }

    const southEast = [row + 1, col + 1];
    while (isInRange(southEast) && isEmpty(board, southEast)) {
        moves.push(`${southEast[0]}${southEast[1]}M`);
        southEast[0]++;
        southEast[1]++;
    }
    if (isInRange(southEast) && isEnemy(piece, board[southEast[0]][southEast[1]])) {
        moves.push(`${southEast[0]}${southEast[1]}C`);
    }

    const southWest = [row + 1, col - 1];
    while (isInRange(southWest) && isEmpty(board, southWest)) {
        moves.push(`${southWest[0]}${southWest[1]}M`);
        southWest[0]++;
        southWest[1]--;
    }
    if (isInRange(southWest) && isEnemy(piece, board[southWest[0]][southWest[1]])) {
        moves.push(`${southWest[0]}${southWest[1]}C`);
    }

    const northWest = [row - 1, col - 1];
    while (isInRange(northWest) && isEmpty(board, northWest)) {
        moves.push(`${northWest[0]}${northWest[1]}M`);
        northWest[0]--;
        northWest[1]--;
    }
    if (isInRange(northWest) && isEnemy(piece, board[northWest[0]][northWest[1]])) {
        moves.push(`${northWest[0]}${northWest[1]}C`);
    }

    return moves;
};

/**
 * Generates possible moves for a queen. Queens can move horizontally, vertically,
 * or diagonally any number of spaces. Queens cannot jump over pieces.
 * 
 * @param {String[][]} board The board in array format
 * @param {Number[]} position The position of the queen
 * @param {String} piece The piece representation of the queen
 * @returns {String[]} An array of possible moves
 */
const generateQueenMoves = (board, position, piece) => {
    const moves = [];

    moves.push(...generateRookMoves(board, position, piece));
    moves.push(...generateBishopMoves(board, position, piece));

    return moves;
};

const generateKingMoves = (board, [row, col], piece) => {
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
        if (isInRange(move) && isSafe(board, move, piece) && (isEmpty(board, move) || isEnemy(piece, board[move[0]][move[1]]))) {
            moves.push(`${move[0]}${move[1]}${isEmpty(board, move) ? 'M' : 'C'}`);
        }
    });

    return moves;
}

export const generateMoves = (board, position, piece) => {
    if (isPawn(piece)) {
        return generatePawnMoves(board, position, piece);
    } else if (isRook(piece)) {
        return generateRookMoves(board, position, piece);
    } else if (isKnight(piece)) {
        return generateKnightMoves(board, position, piece);
    } else if (isBishop(piece)) {
        return generateBishopMoves(board, position, piece);
    } else if (isQueen(piece)) {
        return generateQueenMoves(board, position, piece);
    } else if (isKing(piece)) {
        return generateKingMoves(board, position, piece);
    } else {
        return [];
    }
}

export const validateMove = (board, piece, [oldRow, oldCol], [newRow, newCol]) => {
    board[newRow][newCol] = PIECE_VALUES.EMPTY;
    board[oldRow][oldCol] = piece;

    const moves = generateMoves(board, [newRow, newCol], piece);

    board[oldRow][oldCol] = PIECE_VALUES.EMPTY;
    board[newRow][newCol] = piece;

    return moves.includes(`${newRow}${newCol}M`);
}
