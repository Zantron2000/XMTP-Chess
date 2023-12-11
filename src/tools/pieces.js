const text_pieces = {
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

const PIECE_ORDER = {
    WHITE_ROOK_1: 0,
    WHITE_KNIGHT_1: 1,
    WHITE_BISHOP_1: 2,
    WHITE_QUEEN: 3,
    WHITE_KING: 4,
    WHITE_BISHOP_2: 5,
    WHITE_KNIGHT_2: 6,
    WHITE_ROOK_2: 7,
    WHITE_PAWN_1: 8,
    WHITE_PAWN_2: 9,
    WHITE_PAWN_3: 10,
    WHITE_PAWN_4: 11,
    WHITE_PAWN_5: 12,
    WHITE_PAWN_6: 13,
    WHITE_PAWN_7: 14,
    WHITE_PAWN_8: 15,
    BLACK_ROOK_1: 16,
    BLACK_KNIGHT_1: 17,
    BLACK_BISHOP_1: 18,
    BLACK_QUEEN: 19,
    BLACK_KING: 20,
    BLACK_BISHOP_2: 21,
    BLACK_KNIGHT_2: 22,
    BLACK_ROOK_2: 23,
    BLACK_PAWN_1: 24,
    BLACK_PAWN_2: 25,
    BLACK_PAWN_3: 26,
    BLACK_PAWN_4: 27,
    BLACK_PAWN_5: 28,
    BLACK_PAWN_6: 29,
    BLACK_PAWN_7: 30,
    BLACK_PAWN_8: 31,
}

const PIECE_REPRESENTATION = {
    WHITE_ROOK_1: 'WR1',
    WHITE_KNIGHT_1: 'WN1',
    WHITE_BISHOP_1: 'WB1',
    WHITE_QUEEN: 'WQ',
    WHITE_KING: 'WK',
    WHITE_BISHOP_2: 'WB2',
    WHITE_KNIGHT_2: 'WN2',
    WHITE_ROOK_2: 'WR2',
    WHITE_PAWN_1: 'WP1',
    WHITE_PAWN_2: 'WP2',
    WHITE_PAWN_3: 'WP3',
    WHITE_PAWN_4: 'WP4',
    WHITE_PAWN_5: 'WP5',
    WHITE_PAWN_6: 'WP6',
    WHITE_PAWN_7: 'WP7',
    WHITE_PAWN_8: 'WP8',
    BLACK_ROOK_1: 'BR1',
    BLACK_KNIGHT_1: 'BN1',
    BLACK_BISHOP_1: 'BB1',
    BLACK_QUEEN: 'BQ',
    BLACK_KING: 'BK',
    BLACK_BISHOP_2: 'BB2',
    BLACK_KNIGHT_2: 'BN2',
    BLACK_ROOK_2: 'BR2',
    BLACK_PAWN_1: 'BP1',
    BLACK_PAWN_2: 'BP2',
    BLACK_PAWN_3: 'BP3',
    BLACK_PAWN_4: 'BP4',
    BLACK_PAWN_5: 'BP5',
    BLACK_PAWN_6: 'BP6',
    BLACK_PAWN_7: 'BP7',
    BLACK_PAWN_8: 'BP8',
}

const PIECE_VALUES = {
    P: "PAWN",
    N: "KNIGHT",
    B: "BISHOP",
    R: "ROOK",
    Q: "QUEEN",
    K: "KING",
};

const translatePieceRepresentation = (pieceRep) => {
    const color = pieceRep[0] === 'W' ? 'WHITE' : 'BLACK';
    const piece = PIECE_VALUES[pieceRep[1]];
    const number = pieceRep[2];

    return `${color}_${piece}` + (number ? `_${number}` : '');
}

/**
 * Creates an empty board with no pieces.
 * 
 * @returns {String[][]} The empty board
 */
const createInitialBoard = () => {
    const board = [];
    for (let i = 0; i < 8; i++) {
        board.push([]);
        for (let j = 0; j < 8; j++) {
            board[i].push('');
        }
    }
    return board;
};

/**
 * Translate a board in string format to an array of pieces.
 * A board is represented as the following format:
 * 
 * Hash-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * 
 * Where:
 * - Hash: The hash of the board, this should be ignored
 * - XX: The piece in the position XX, where the first X is the row and the second X is the column.  The row and column should be numbers or the letter X,
 *    which represents a dead piece, and in that case don't add the piece to the board. The row and column should be between 0 and 7.
 * There are 64 XX pairs, one for each piece in the board
 * The pairs appear in the order of the pieces_order object, so the first pair is the first piece in the pieces_order object
 * 
 * The function should return a 2D array of pieces, where the first index is the row and the second index is the column
 * and the value at that index is the piece representation of the piece in that position.
 * 
 * @param {String} stringBoard The board in string format
 * @returns {String[][]} The board in array format
 */
const translateMessageBoard = (stringBoard) => {
    const board = createInitialBoard();
    const boardString = stringBoard.substring(5);

    Object.entries(PIECE_ORDER).forEach(([piece, index]) => {
        const pos = index * 2;
        const piecePos = boardString.substring(pos, pos + 2);

        if (piecePos[0] !== 'X' && piecePos[1] !== 'X') {
            const row = parseInt(piecePos[0]);
            const col = parseInt(piecePos[1]);
            board[row][col] = PIECE_REPRESENTATION[piece];
        }
    });

    return board;
};

/**
 * Validates that a board is in the correct format. The board
 * should be in the following format:
 * 
 * Hash-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * 
 * Where:
 * - Hash: The hash of the board, this should be 5 characters long
 * - XX: The piece in the position XX, where the first X is the row and the second X is the column,
 *     the row and column should be between 0 and 7. The row and column should be numbers or the letter X,
 *     which represents a dead piece, and in that case both the row and column should be X. There should be
 *     64 XX pairs, one for each piece in the board
 * 
 * @param {String} stringBoard The board in string format
 * @returns {Boolean} True if the board is in the correct format, false otherwise
 */
const validateBoardMessage = (stringBoard) => {
    const boardString = stringBoard.substring(5);
    if (stringBoard.length !== 134) {
        return false;
    }

    const hash = stringBoard.substring(0, 5);
    if (!hash.match(/^[a-zA-Z0-9]*$/)) {
        return false;
    }

    if (!boardString.match(/^[0-7X]{128}$/)) {
        return false;
    }

    return true;
};

/**
 * Creates a string representation of a board.
 * A board is represented as the following format:
 * 
 * Hash-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * 
 * Where:
 * - Hash: The hash of the board, this should be 5 characters long
 * - XX: The piece in the position XX, where the first X is the row and the second X is the column,
 *     the row and column should be between 0 and 7. The row and column should be numbers or the letter X,
 *     which represents a dead piece, and in that case both the row and column should be X. There should be
 *     64 XX pairs, one for each piece in the board
 * 
 * @param {String} hash The hash of the board
 * @param {String[][]} board The board in array format
 * @returns {String} The board in string format
 */
const createMessageBoard = (hash, board) => {
    const flatBoard = Array(32);

    board.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            if (piece !== '') {
                const pieceRep = translatePieceRepresentation(piece);
                flatBoard[PIECE_ORDER[pieceRep]] = `${rowIndex}${colIndex}`;
            }
        });
    });

    return `${hash}-${flatBoard.join('')}`;
};

/**
 * Checks if two pieces are the same color.
 * 
 * @param {String} piece1 The first piece
 * @param {String} piece2 The second piece
 * @returns {Boolean} True if the pieces are the same color, false otherwise
 */
const isEnemy = (movingPiece, targetPiece) => {
    return movingPiece[0] !== targetPiece[0];
}

/**
 * Checks if a position is in the board.
 * 
 * @param {Number[]} position The position to check
 * @returns {Boolean} True if the position is in the board, false otherwise
 */
const isInRange = ([row, col]) => {
    return row >= 0 && row <= 7 && col >= 0 && col <= 7;
}

/**
 * Checks if a position is empty.
 * 
 * @param {String[][]} board The board in array format
 * @param {Number[]} position The position to check
 * @returns {Boolean} True if the position is empty, false otherwise
 */
const isEmpty = (board, [row, col]) => {
    return board[row][col] === '';
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
};

/**
 * Generates possible moves for a rook. Rooks can move horizontally or vertically
 * any number of spaces. Rooks cannot jump over pieces.
 * 
 * @param {String[][]} board The board in array format
 * @param {Number} row The row of the rook
 * @param {Number} col The column of the rook
 * @param {String} piece The piece representation of the rook
 * @returns {String[]} An array of possible moves
 */
const generateRookMoves = (board, row, col, piece) => {
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
 * @param {Number} row The row of the knight
 * @param {Number} col The column of the knight
 * @param {String} piece The piece representation of the knight
 * @returns {String[]} An array of possible moves
 */
const generateKnightMoves = (board, row, col, piece) => {
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
 * @param {Number} row The row of the bishop
 * @param {Number} col The column of the bishop
 * @param {String} piece The piece representation of the bishop
 * @returns {String[]} An array of possible moves
 */
const generateBishopMoves = (board, row, col, piece) => {
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
 * @param {Number} row The row of the queen
 * @param {Number} col The column of the queen
 * @param {String} piece The piece representation of the queen
 * @returns {String[]} An array of possible moves
 */
const generateQueenMoves = (board, row, col, piece) => {
    const moves = [];

    moves.push(...generateRookMoves(board, row, col, piece));
    moves.push(...generateBishopMoves(board, row, col, piece));

    return moves;
};

/**
 * Checks to see if a space is safe for a piece to move. A space is safe if
 * there are no enemy pieces that can capture the piece on the space. The given 
 * piece isn't assumed to be on the space, and if encountered, it should be ignored.
 * 
 * @param {String[][]} board The board in array format
 * @param {Number} row The row of the space
 * @param {Number} col The column of the space
 * @param {String} piece The piece representation of the piece
 * @returns {Boolean} True if the space is safe, false otherwise
 */
const isSafeSpace = (board, row, col, piece) => {

}
