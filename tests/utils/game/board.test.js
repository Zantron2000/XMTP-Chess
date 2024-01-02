import { validateMove, getTurnInfo, movePiece, placePiece } from "../../../src/utils/game/board";
import { INITIAL_BOARD_POSITIONS, PIECE_COLORS, PIECE_VALUES } from "../../../src/utils/enum";
import { ACTION_TYPES } from "../../../src/tools/enums";

const { KING, KNIGHT, BISHOP, EMPTY, PAWN, QUEEN, ROOK } = PIECE_VALUES;
const { BLACK, WHITE } = PIECE_COLORS;
const { MOVE, CAPTURE, TRANSFORM, CASTLE } = ACTION_TYPES;

const createStarterBoard = () => {
    return [
        ['WR1', 'WN1', 'WB1', 'WQ', 'WK', 'WB2', 'WN2', 'WR2'],
        ['WP1', 'WP2', 'WP3', 'WP4', 'WP5', 'WP6', 'WP7', 'WP8'],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        ['BP1', 'BP2', 'BP3', 'BP4', 'BP5', 'BP6', 'BP7', 'BP8'],
        ['BR1', 'BN1', 'BB1', 'BQ', 'BK', 'BB2', 'BN2', 'BR2'],
    ]
}

const createEmptyBoard = () => {
    return [
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    ]
}

const createDeadPositions = () => {
    return {
        [WHITE + PAWN + '1']: 'XX',
        [WHITE + PAWN + '2']: 'XX',
        [WHITE + PAWN + '3']: 'XX',
        [WHITE + PAWN + '4']: 'XX',
        [WHITE + PAWN + '5']: 'XX',
        [WHITE + PAWN + '6']: 'XX',
        [WHITE + PAWN + '7']: 'XX',
        [WHITE + PAWN + '8']: 'XX',
        [WHITE + ROOK + '1']: 'XX',
        [WHITE + ROOK + '2']: 'XX',
        [WHITE + KNIGHT + '1']: 'XX',
        [WHITE + KNIGHT + '2']: 'XX',
        [WHITE + BISHOP + '1']: 'XX',
        [WHITE + BISHOP + '2']: 'XX',
        [WHITE + QUEEN]: 'XX',
        [WHITE + KING]: 'XX',
        [BLACK + PAWN + '1']: 'XX',
        [BLACK + PAWN + '2']: 'XX',
        [BLACK + PAWN + '3']: 'XX',
        [BLACK + PAWN + '4']: 'XX',
        [BLACK + PAWN + '5']: 'XX',
        [BLACK + PAWN + '6']: 'XX',
        [BLACK + PAWN + '7']: 'XX',
        [BLACK + PAWN + '8']: 'XX',
        [BLACK + ROOK + '1']: 'XX',
        [BLACK + ROOK + '2']: 'XX',
        [BLACK + KNIGHT + '1']: 'XX',
        [BLACK + KNIGHT + '2']: 'XX',
        [BLACK + BISHOP + '1']: 'XX',
        [BLACK + BISHOP + '2']: 'XX',
        [BLACK + QUEEN]: 'XX',
        [BLACK + KING]: 'XX',
    }
}

describe('Tests validateMove', () => {
    describe('Tests untransformed pawns', () => {
        it('Should find no error for a white pawn starting position', () => {
            const board = createStarterBoard();
            const doubleMove = {
                piecePos: 'A2',
                action: 'A4' + ACTION_TYPES.MOVE,
            }
            const singleMove = {
                piecePos: 'A2',
                action: 'A3' + ACTION_TYPES.MOVE,
            }
            const transform = {
                piecePos: 'A2',
                action: 'A3' + ACTION_TYPES.TRANSFORM,
            }

            const { error: doubleMoveError } = validateMove(board, doubleMove, undefined, undefined, 'XX');
            const { error: singleMoveError } = validateMove(board, singleMove, undefined, undefined, 'XX');
            const { error: transformError } = validateMove(board, transform, undefined, undefined, 'XX');

            expect(singleMoveError).toBe(null);
            expect(doubleMoveError).toBe(null);
            expect(transformError).not.toBe(null);
        });

        it('Should find an error for an invalid double move for a white pawn', () => {
            const board = createStarterBoard();
            board[1][0] = PIECE_VALUES.EMPTY;
            board[2][0] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';

            const doubleMoveData = {
                piecePos: 'A3',
                action: 'A5' + ACTION_TYPES.MOVE,
            }
            const singleMoveData = {
                piecePos: 'A3',
                action: 'A4' + ACTION_TYPES.MOVE,
            }
            const transform = {
                piecePos: 'A2',
                action: 'A3' + ACTION_TYPES.TRANSFORM,
            }

            const { error: invalidError } = validateMove(board, doubleMoveData);
            const { error: validError } = validateMove(board, singleMoveData);
            const { error: transformError } = validateMove(board, transform);

            expect(invalidError).not.toBe(null);
            expect(validError).toBe(null);
            expect(transformError).not.toBe(null);
        });

        it('Should find an error for an enemy 2 spaces away from a white pawn', () => {
            const board = createStarterBoard();
            board[3][0] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            const doubleMove = {
                piecePos: 'A2',
                action: 'A4' + ACTION_TYPES.MOVE,
            }
            const singleMove = {
                piecePos: 'A2',
                action: 'A3' + ACTION_TYPES.MOVE,
            }
            const capture = {
                piecePos: 'A2',
                action: 'B4' + ACTION_TYPES.CAPTURE,
            }
            const transform = {
                piecePos: 'A2',
                action: 'A3' + ACTION_TYPES.TRANSFORM,
            }

            const { error: doubleMoveError } = validateMove(board, doubleMove);
            const { error: singleMoveError } = validateMove(board, singleMove);
            const { error: captureError } = validateMove(board, capture);
            const { error: transformError } = validateMove(board, transform);

            expect(singleMoveError).toBe(null);
            expect(doubleMoveError).not.toBe(null);
            expect(captureError).not.toBe(null);
            expect(transformError).not.toBe(null);
        });

        it('Should find an error for an enemy 1 space away from a white pawn', () => {
            const board = createStarterBoard();
            board[2][0] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            const doubleMove = {
                piecePos: 'A2',
                action: 'A4' + ACTION_TYPES.MOVE,
            }
            const singleMove = {
                piecePos: 'A2',
                action: 'A3' + ACTION_TYPES.MOVE,
            }
            const capture = {
                piecePos: 'A2',
                action: 'B4' + ACTION_TYPES.CAPTURE,
            }

            const { error: doubleMoveError } = validateMove(board, doubleMove);
            const { error: singleMoveError } = validateMove(board, singleMove);
            const { error: captureError } = validateMove(board, capture);

            expect(singleMoveError).not.toBe(null);
            expect(doubleMoveError).not.toBe(null);
            expect(captureError).not.toBe(null);
        });

        it('Should find an error for an ally 2 spaces away from a white pawn', () => {
            const board = createStarterBoard();
            board[3][0] = PIECE_COLORS.WHITE + PIECE_VALUES.ROOK + '1';
            const doubleMove = {
                piecePos: 'A2',
                action: 'A4' + ACTION_TYPES.MOVE,
            }
            const singleMove = {
                piecePos: 'A2',
                action: 'A3' + ACTION_TYPES.MOVE,
            }
            const capture = {
                piecePos: 'A2',
                action: 'B4' + ACTION_TYPES.CAPTURE,
            }

            const { error: doubleMoveError } = validateMove(board, doubleMove);
            const { error: singleMoveError } = validateMove(board, singleMove);
            const { error: captureError } = validateMove(board, capture);

            expect(singleMoveError).toBe(null);
            expect(doubleMoveError).not.toBe(null);
            expect(captureError).not.toBe(null);
        });

        it('Should find an error for an ally 1 space away from a white pawn', () => {
            const board = createStarterBoard();
            board[2][0] = PIECE_COLORS.WHITE + PIECE_VALUES.ROOK + '1';
            const doubleMove = {
                piecePos: 'A2',
                action: 'A4' + ACTION_TYPES.MOVE,
            }
            const singleMove = {
                piecePos: 'A2',
                action: 'A3' + ACTION_TYPES.MOVE,
            }
            const capture = {
                piecePos: 'A2',
                action: 'B4' + ACTION_TYPES.CAPTURE,
            }

            const { error: doubleMoveError } = validateMove(board, doubleMove);
            const { error: singleMoveError } = validateMove(board, singleMove);
            const { error: captureError } = validateMove(board, capture);

            expect(singleMoveError).not.toBe(null);
            expect(doubleMoveError).not.toBe(null);
            expect(captureError).not.toBe(null);
        });

        it('Should not allow a white pawn to transform if it is not near the last row', () => {
            const board = createStarterBoard();
            const data = {
                piecePos: 'A2',
                action: 'A3' + ACTION_TYPES.TRANSFORM,
            }

            const { error } = validateMove(board, data);

            expect(error).not.toBe(null);
        });

        it('Should not allow a white pawn to move in any direction other than south', () => {
            const board = createStarterBoard();
            board[0][0] = PIECE_VALUES.EMPTY;
            board[1][0] = PIECE_VALUES.EMPTY;
            board[0][1] = PIECE_VALUES.EMPTY;
            board[0][2] = PIECE_VALUES.EMPTY;
            board[1][2] = PIECE_VALUES.EMPTY;
            const invalidMoves = [
                'A1', 'B1', 'C1', 'A2', 'C2', 'A3', 'C3'
            ]
            const validMoves = [
                'B4'
            ]

            invalidMoves.forEach(move => {
                const data = {
                    piecePos: 'B2',
                    action: move + ACTION_TYPES.MOVE,
                }

                const { error } = validateMove(board, data);

                expect(error).not.toBe(null);
            });

            validMoves.forEach(move => {
                const data = {
                    piecePos: 'B2',
                    action: move + ACTION_TYPES.MOVE,
                }

                const { error } = validateMove(board, data);

                expect(error).toBe(null);
            });
        })

        it('Should allow a white pawn to transform if a piece is blocking the pawn', () => {
            const board = createStarterBoard();
            board[1][0] = PIECE_VALUES.EMPTY;
            board[6][0] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            const data = {
                piecePos: 'A7',
                action: 'A8' + ACTION_TYPES.TRANSFORM,
            }

            const { error } = validateMove(board, data);

            expect(error).not.toBe(null);
        });

        it('Should allow a white pawn to transform if it is near the last row', () => {
            const board = createStarterBoard();
            board[1][0] = PIECE_VALUES.EMPTY;
            board[6][0] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            board[7][0] = PIECE_VALUES.EMPTY;
            const data = {
                piecePos: 'A7',
                action: 'A8' + ACTION_TYPES.TRANSFORM,
            }

            const { error } = validateMove(board, data);

            expect(error).toBe(null);
        });

        it('Should allow a white pawn to attack enemy pieces diagonally', () => {
            const board = createEmptyBoard();
            board[2][2] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            board[3][3] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            board[3][1] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '2';
            const leftCapture = {
                piecePos: 'C3',
                action: 'B4' + ACTION_TYPES.CAPTURE,
            }
            const rightCapture = {
                piecePos: 'C3',
                action: 'D4' + ACTION_TYPES.CAPTURE,
            }

            const { error: leftError } = validateMove(board, leftCapture);
            const { error: rightError } = validateMove(board, rightCapture);

            expect(leftError).toBe(null);
            expect(rightError).toBe(null);
        });

        it('Should not allow a white pawn to attack ally pieces diagonally', () => {
            const board = createEmptyBoard();
            board[2][2] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            board[3][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            board[3][1] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '2';
            const leftCapture = {
                piecePos: 'C3',
                action: 'B4' + ACTION_TYPES.CAPTURE,
            }
            const rightCapture = {
                piecePos: 'C3',
                action: 'D4' + ACTION_TYPES.CAPTURE,
            }

            const { error: leftError } = validateMove(board, leftCapture);
            const { error: rightError } = validateMove(board, rightCapture);

            expect(leftError).not.toBe(null);
            expect(rightError).not.toBe(null);
        });

        it('Should not allow a white pawn to attack enemy pieces if they are too far away', () => {
            const board = createEmptyBoard();
            board[2][2] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            board[4][4] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            board[4][0] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '2';
            const leftCapture = {
                piecePos: 'C3',
                action: 'A5' + ACTION_TYPES.CAPTURE,
            }
            const rightCapture = {
                piecePos: 'C3',
                action: 'E5' + ACTION_TYPES.CAPTURE,
            }

            const { error: leftError } = validateMove(board, leftCapture);
            const { error: rightError } = validateMove(board, rightCapture);

            expect(leftError).not.toBe(null);
            expect(rightError).not.toBe(null);
        });

        it('Should find no error for a black pawn starting position', () => {
            const board = createStarterBoard();
            const doubleMove = {
                piecePos: 'A7',
                action: 'A5' + ACTION_TYPES.MOVE,
            }
            const singleMove = {
                piecePos: 'A7',
                action: 'A6' + ACTION_TYPES.MOVE,
            }
            const transform = {
                piecePos: 'A7',
                action: 'A6' + ACTION_TYPES.TRANSFORM,
            }

            const { error: doubleMoveError } = validateMove(board, doubleMove);
            const { error: singleMoveError } = validateMove(board, singleMove);
            const { error: transformError } = validateMove(board, transform);

            expect(singleMoveError).toBe(null);
            expect(doubleMoveError).toBe(null);
            expect(transformError).not.toBe(null);
        });

        it('Should find an error for an invalid double move for a black pawn', () => {
            const board = createStarterBoard();
            board[6][0] = PIECE_VALUES.EMPTY;
            board[5][0] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';

            const doubleMoveData = {
                piecePos: 'A6',
                action: 'A4' + ACTION_TYPES.MOVE,
            }
            const singleMoveData = {
                piecePos: 'A6',
                action: 'A5' + ACTION_TYPES.MOVE,
            }
            const transform = {
                piecePos: 'A6',
                action: 'A5' + ACTION_TYPES.TRANSFORM,
            }

            const { error: invalidError } = validateMove(board, doubleMoveData);
            const { error: validError } = validateMove(board, singleMoveData);
            const { error: transformError } = validateMove(board, transform);

            expect(invalidError).not.toBe(null);
            expect(validError).toBe(null);
            expect(transformError).not.toBe(null);
        });

        it('Should find an error for an enemy 2 spaces away from a black pawn', () => {
            const board = createStarterBoard();
            board[4][0] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            const doubleMove = {
                piecePos: 'A7',
                action: 'A5' + ACTION_TYPES.MOVE,
            }
            const singleMove = {
                piecePos: 'A7',
                action: 'A6' + ACTION_TYPES.MOVE,
            }
            const capture = {
                piecePos: 'A7',
                action: 'A5' + ACTION_TYPES.CAPTURE,
            }
            const transform = {
                piecePos: 'A7',
                action: 'A6' + ACTION_TYPES.TRANSFORM,
            }

            const { error: doubleMoveError } = validateMove(board, doubleMove);
            const { error: singleMoveError } = validateMove(board, singleMove);
            const { error: captureError } = validateMove(board, capture);
            const { error: transformError } = validateMove(board, transform);

            expect(singleMoveError).toBe(null);
            expect(doubleMoveError).not.toBe(null);
            expect(captureError).not.toBe(null);
            expect(transformError).not.toBe(null);
        });

        it('Should find an error for an enemy 1 space away from a black pawn', () => {
            const board = createStarterBoard();
            board[5][0] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            const doubleMove = {
                piecePos: 'A7',
                action: 'A5' + ACTION_TYPES.MOVE,
            }
            const singleMove = {
                piecePos: 'A7',
                action: 'A6' + ACTION_TYPES.MOVE,
            }
            const capture = {
                piecePos: 'A7',
                action: 'B6' + ACTION_TYPES.CAPTURE,
            }

            const { error: doubleMoveError } = validateMove(board, doubleMove);
            const { error: singleMoveError } = validateMove(board, singleMove);
            const { error: captureError } = validateMove(board, capture);

            expect(singleMoveError).not.toBe(null);
            expect(doubleMoveError).not.toBe(null);
            expect(captureError).not.toBe(null);
        });

        it('Should find an error for an ally 2 spaces away from a black pawn', () => {
            const board = createStarterBoard();
            board[4][0] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '2';
            const doubleMove = {
                piecePos: 'A7',
                action: 'A5' + ACTION_TYPES.MOVE,
            }
            const singleMove = {
                piecePos: 'A7',
                action: 'A6' + ACTION_TYPES.MOVE,
            }
            const capture = {
                piecePos: 'A7',
                action: 'A5' + ACTION_TYPES.CAPTURE,
            }
            const transform = {
                piecePos: 'A7',
                action: 'A6' + ACTION_TYPES.TRANSFORM,
            }

            const { error: doubleMoveError } = validateMove(board, doubleMove);
            const { error: singleMoveError } = validateMove(board, singleMove);
            const { error: captureError } = validateMove(board, capture);
            const { error: transformError } = validateMove(board, transform);

            expect(singleMoveError).toBe(null);
            expect(doubleMoveError).not.toBe(null);
            expect(captureError).not.toBe(null);
            expect(transformError).not.toBe(null);
        });

        it('Should find an error for an ally 1 space away from a black pawn', () => {
            const board = createStarterBoard();
            board[2][0] = PIECE_COLORS.BLACK + PIECE_VALUES.ROOK + '1';
            const doubleMove = {
                piecePos: 'A2',
                action: 'A4' + ACTION_TYPES.MOVE,
            }
            const singleMove = {
                piecePos: 'A2',
                action: 'A3' + ACTION_TYPES.MOVE,
            }
            const capture = {
                piecePos: 'A2',
                action: 'B4' + ACTION_TYPES.CAPTURE,
            }

            const { error: doubleMoveError } = validateMove(board, doubleMove);
            const { error: singleMoveError } = validateMove(board, singleMove);
            const { error: captureError } = validateMove(board, capture);

            expect(singleMoveError).not.toBe(null);
            expect(doubleMoveError).not.toBe(null);
            expect(captureError).not.toBe(null);
        });

        it('Should not allow a black pawn to transform if it is not near the first row', () => {
            const board = createStarterBoard();
            const data = {
                piecePos: 'A7',
                action: 'A1' + ACTION_TYPES.TRANSFORM,
            }

            const { error } = validateMove(board, data);

            expect(error).not.toBe(null);
        });

        it('Should not allow a black pawn to move in any direction other than north', () => {
            const board = createEmptyBoard();
            board[6][1] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            const invalidMoves = [
                'A8', 'B8', 'C8', 'A7', 'C7', 'A6', 'C6'
            ]
            const validMoves = [
                'B5', 'B6'
            ]

            invalidMoves.forEach(move => {
                const data = {
                    piecePos: 'B7',
                    action: move + ACTION_TYPES.MOVE,
                }

                const { error } = validateMove(board, data);

                expect(error).not.toBe(null);
            });

            validMoves.forEach(move => {
                const data = {
                    piecePos: 'B7',
                    action: move + ACTION_TYPES.MOVE,
                }

                const { error } = validateMove(board, data);

                expect(error).toBe(null);
            });
        })

        it('Should not allow a black pawn to transform if a piece is blocking the pawn', () => {
            const board = createStarterBoard();
            board[6][0] = PIECE_VALUES.EMPTY;
            board[1][0] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            const data = {
                piecePos: 'A2',
                action: 'A1' + ACTION_TYPES.TRANSFORM,
            }

            const { error } = validateMove(board, data);

            expect(error).not.toBe(null);
        });

        it('Should allow a black pawn to transform if it is near the last row', () => {
            const board = createStarterBoard();
            board[6][0] = PIECE_VALUES.EMPTY;
            board[1][0] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            board[0][0] = PIECE_VALUES.EMPTY;
            const data = {
                piecePos: 'A2',
                action: 'A1' + ACTION_TYPES.TRANSFORM,
            }

            const { error } = validateMove(board, data);

            expect(error).toBe(null);
        });

        it('Should allow a black pawn to attack enemy pieces diagonally', () => {
            const board = createEmptyBoard();
            board[2][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            board[1][1] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            board[1][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '2';
            const leftCapture = {
                piecePos: 'C3',
                action: 'B2' + ACTION_TYPES.CAPTURE,
            }
            const rightCapture = {
                piecePos: 'C3',
                action: 'D2' + ACTION_TYPES.CAPTURE,
            }

            const { error: leftError } = validateMove(board, leftCapture);
            const { error: rightError } = validateMove(board, rightCapture);

            expect(leftError).toBe(null);
            expect(rightError).toBe(null);
        });

        it('Should not allow a black pawn to attack ally pieces diagonally', () => {
            const board = createEmptyBoard();
            board[2][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            board[1][3] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            board[1][1] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '2';
            const leftCapture = {
                piecePos: 'C3',
                action: 'B2' + ACTION_TYPES.CAPTURE,
            }
            const rightCapture = {
                piecePos: 'C3',
                action: 'D2' + ACTION_TYPES.CAPTURE,
            }

            const { error: leftError } = validateMove(board, leftCapture, undefined, {});
            const { error: rightError } = validateMove(board, rightCapture, undefined, {});

            expect(leftError).not.toBe(null);
            expect(rightError).not.toBe(null);
        });

        it('Should not allow a black pawn to attack enemy pieces if they are too far away', () => {
            const board = createEmptyBoard();
            board[2][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            board[0][0] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            board[0][4] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '2';
            const leftCapture = {
                piecePos: 'C3',
                action: 'A1' + ACTION_TYPES.CAPTURE,
            }
            const rightCapture = {
                piecePos: 'C3',
                action: 'E1' + ACTION_TYPES.CAPTURE,
            }

            const { error: leftError } = validateMove(board, leftCapture, undefined, {});
            const { error: rightError } = validateMove(board, rightCapture, undefined, {});

            expect(leftError).not.toBe(null);
            expect(rightError).not.toBe(null);
        });
    });

    describe('Tests transformed pawns', () => {
        it('Should allow a knight pawn to move like a knight', () => {
            const board = createEmptyBoard();
            board[3][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            const registry = {
                [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1']: PIECE_VALUES.KNIGHT
            }
            const knightMove = {
                piecePos: 'D4',
                action: 'C6' + ACTION_TYPES.MOVE,
            }
            const pawnMove = {
                piecePos: 'D4',
                action: 'D5' + ACTION_TYPES.MOVE,
            }

            const { error: knightError } = validateMove(board, knightMove, undefined, registry);
            const { error: pawnError } = validateMove(board, pawnMove, undefined, registry);

            expect(knightError).toBe(null);
            expect(pawnError).not.toBe(null);
        });

        it('Should allow a knight pawn to attack like a knight', () => {
            const board = createEmptyBoard();
            board[3][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            board[2][5] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            board[4][4] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '2';
            const registry = {
                [PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1']: PIECE_VALUES.KNIGHT
            }
            const knightCapture = {
                piecePos: 'D4',
                action: 'F3' + ACTION_TYPES.CAPTURE,
            }
            const pawnCapture = {
                piecePos: 'D4',
                action: 'E5' + ACTION_TYPES.CAPTURE,
            }

            const { error: knightError } = validateMove(board, knightCapture, undefined, registry);
            const { error: pawnError } = validateMove(board, pawnCapture, undefined, registry);

            expect(knightError).toBe(null);
            expect(pawnError).not.toBe(null);
        });
    });

    describe('Tests knights', () => {
        it('Should find no error for moving a knight', () => {
            const board = createEmptyBoard();
            board[3][3] = PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT + '1';
            const validMoves = [
                'B3', 'B5', 'C2', 'C6', 'E2', 'E6', 'F3', 'F5'
            ];
            const invalidMoves = [
                'C3', 'D3', 'E3', 'C4', 'E4', 'C5', 'D5', 'E5'
            ];

            validMoves.forEach(move => {
                const data = {
                    piecePos: 'D4',
                    action: move + ACTION_TYPES.MOVE,
                }

                const { error } = validateMove(board, data);

                expect(error).toBe(null);
            });

            invalidMoves.forEach(move => {
                const data = {
                    piecePos: 'D4',
                    action: move + ACTION_TYPES.MOVE,
                }

                const { error } = validateMove(board, data);

                expect(error).not.toBe(null);
            });
        });

        it('Should find no error for capturing enemies with a knight', () => {
            const board = createEmptyBoard();
            board[3][3] = PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT + '1';
            board[2][1] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1';
            board[2][5] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '2';
            board[4][1] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '3';
            board[4][5] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '4';
            board[1][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '5';
            board[1][4] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '6';
            board[5][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '7';
            board[5][4] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '8';
            const validCaptures = [
                'B3', 'B5', 'C2', 'C6', 'E2', 'E6', 'F3', 'F5'
            ];
            const invalidCaptures = [
                'C3', 'D3', 'E3', 'C4', 'E4', 'C5', 'D5', 'E5'
            ];

            validCaptures.forEach(move => {
                const data = {
                    piecePos: 'D4',
                    action: move + ACTION_TYPES.CAPTURE,
                }

                const { error } = validateMove(board, data);

                expect(error).toBe(null);
            });

            invalidCaptures.forEach(move => {
                const data = {
                    piecePos: 'D4',
                    action: move + ACTION_TYPES.CAPTURE,
                }

                const { error } = validateMove(board, data);

                expect(error).not.toBe(null);
            });
        });

        it('Should find error for capturing allies with a knight', () => {
            const board = createEmptyBoard();
            board[3][3] = PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT + '1';
            board[2][1] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '1';
            board[2][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '2';
            board[4][1] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '3';
            board[4][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '4';
            board[1][2] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '5';
            board[1][4] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '6';
            board[5][2] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '7';
            board[5][4] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '8';
            const validCaptures = [
                'B3', 'B5', 'C2', 'C6', 'E2', 'E6', 'F3', 'F5'
            ];

            validCaptures.forEach(move => {
                const data = {
                    piecePos: 'D4',
                    action: move + ACTION_TYPES.CAPTURE,
                }

                const { error } = validateMove(board, data);

                expect(error).not.toBe(null);
            });
        });

        it('Should find no error for moving a knight past other pieces', () => {
            const board = createEmptyBoard();
            board[3][3] = 'WN1';
            board[3][4] = 'WP1';
            board[4][3] = 'WP2';
            board[2][3] = 'WP3';
            board[3][2] = 'WP4';
            const data = {
                piecePos: 'D4',
                action: 'B5' + ACTION_TYPES.MOVE,
            }

            const { error } = validateMove(board, data);

            expect(error).toBe(null);
        });
    })

    describe('Tests queens', () => {
        it('Should find no error for moving a queen diagonally to the other end of the board', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WQ';
            const data = {
                piecePos: 'A1',
                action: 'H8' + ACTION_TYPES.MOVE,
            }

            const { error } = validateMove(board, data);

            expect(error).toBe(null);
        });

        it('Should find no error for moving a queen horizontally to the other end of the board', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WQ';
            const data = {
                piecePos: 'A1',
                action: 'H1' + ACTION_TYPES.MOVE,
            }

            const { error } = validateMove(board, data);

            expect(error).toBe(null);
        });

        it('Should find no error for moving a queen vertically to the other end of the board', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WQ';
            const data = {
                piecePos: 'A1',
                action: 'A8' + ACTION_TYPES.MOVE,
            }

            const { error } = validateMove(board, data);

            expect(error).toBe(null);
        });

        it('Should find an error for moving a queen diagonally past a piece', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WQ';
            board[1][1] = 'WP1';
            const data = {
                piecePos: 'A1',
                action: 'C3' + ACTION_TYPES.MOVE,
            }

            const { error } = validateMove(board, data);

            expect(error).not.toBe(null);
        });
    });

    describe('Tests kings', () => {
        it('Should find no error for moving a king diagonally', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WK';
            const data = {
                piecePos: 'A1',
                action: 'B2' + ACTION_TYPES.MOVE,
            }
            const canCastle = {
                1: true,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).toBe(null);
        });

        it('Should find no error for moving a king horizontally', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WK';
            const data = {
                piecePos: 'A1',
                action: 'B1' + ACTION_TYPES.MOVE,
            }
            const canCastle = {
                1: true,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).toBe(null);
        });

        it('Should find no error for moving a king vertically', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WK';
            const data = {
                piecePos: 'A1',
                action: 'A2' + ACTION_TYPES.MOVE,
            }
            const canCastle = {
                1: true,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).toBe(null);
        });

        it('Should find an error for moving a king diagonally past a piece', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WK';
            board[1][1] = 'WP1';
            const data = {
                piecePos: 'A1',
                action: 'C3' + ACTION_TYPES.MOVE,
            }
            const canCastle = {
                1: true,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).not.toBe(null);
        });

        it('Should find an error for moving a king into a dangerous pawn position', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WK';
            board[2][2] = 'BP1';
            const data = {
                piecePos: 'A1',
                action: 'B2' + ACTION_TYPES.MOVE,
            }
            const canCastle = {
                1: true,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).not.toBe(null);
        })

        it('Should find an error for moving a king into a dangerous bishop position', () => {
            const board = createEmptyBoard();
            board[0][0] = WHITE + KING;
            board[2][2] = BLACK + BISHOP + '1';
            const data = {
                piecePos: 'A1',
                action: 'B2' + ACTION_TYPES.MOVE,
            }
            const canCastle = {
                1: true,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).not.toBe(null);
        })

        it('Should find an error for moving a king into a dangerous rook position', () => {
            const board = createEmptyBoard();
            board[0][0] = WHITE + KING;
            board[1][7] = BLACK + ROOK + '1';
            const data = {
                piecePos: 'A1',
                action: 'A2' + ACTION_TYPES.MOVE,
            }
            const canCastle = {
                1: true,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).not.toBe(null);
        })

        it('Should find an error for moving a king into a dangerous queen position', () => {
            const board = createEmptyBoard();
            board[0][0] = WHITE + KING;
            board[7][1] = BLACK + QUEEN;
            const data = {
                piecePos: 'A1',
                action: 'B1' + ACTION_TYPES.MOVE,
            }
            const canCastle = {
                1: true,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).not.toBe(null);
        })

        it('Should find an error for having a king capture a protected queen', () => {
            const board = createEmptyBoard();
            board[0][0] = WHITE + KING;
            board[1][1] = BLACK + QUEEN;
            board[2][2] = BLACK + PAWN + '1';
            const data = {
                piecePos: 'A1',
                action: 'B2' + ACTION_TYPES.CAPTURE,
            }
            const canCastle = {
                1: true,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).not.toBe(null);
        })

        it('Should allow a king to kill a queen', () => {
            const board = createEmptyBoard();
            board[0][0] = WHITE + KING;
            board[1][1] = BLACK + QUEEN;
            const data = {
                piecePos: 'A1',
                action: 'B2' + ACTION_TYPES.CAPTURE,
            }
            const canCastle = {
                1: true,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).toBe(null);
        });

        it('Should find an error for having a king move into a protected transformed queen pawn position', () => {
            const board = createEmptyBoard();
            board[0][0] = WHITE + KING;
            board[7][1] = BLACK + PAWN + '1';
            const data = {
                piecePos: 'A1',
                action: 'B1' + ACTION_TYPES.MOVE,
            }
            const canCastle = {
                1: true,
                2: true
            }
            const registry = {
                [BLACK + PAWN + '1']: QUEEN
            }

            const { error } = validateMove(board, data, canCastle, registry);

            expect(error).not.toBe(null);
        })

        it('Should find an error for having a king move into a protected transformed knight pawn position', () => {
            const board = createEmptyBoard();
            board[0][0] = WHITE + KING;
            board[0][2] = BLACK + PAWN + '1';
            const data = {
                piecePos: 'A1',
                action: 'A2' + ACTION_TYPES.MOVE,
            }
            const canCastle = {
                1: true,
                2: true
            }
            const registry = {
                [BLACK + PAWN + '1']: KNIGHT
            }

            const { error } = validateMove(board, data, canCastle, registry);

            expect(error).not.toBe(null);
        });

        it('Should allow a king make a long castle', () => {
            const board = createEmptyBoard();
            board[0][4] = WHITE + KING;
            board[0][0] = WHITE + ROOK + '1';
            const data = {
                piecePos: 'E1',
                action: 'C1' + ACTION_TYPES.CASTLE,
            }
            const canCastle = {
                1: true,
                2: false
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).toBe(null);
        });

        it('Should allow a king make a short castle', () => {
            const board = createEmptyBoard();
            board[7][4] = BLACK + KING;
            board[7][7] = BLACK + ROOK + '2';
            const data = {
                piecePos: 'E8',
                action: 'G8' + ACTION_TYPES.CASTLE,
            }
            const canCastle = {
                1: false,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).toBe(null);
        });

        it('Should not allow a king make a long castle when a piece is in the way', () => {
            const board = createEmptyBoard();
            board[0][4] = WHITE + KING;
            board[0][0] = WHITE + ROOK + '1';
            board[0][2] = WHITE + PAWN + '1';
            const data = {
                piecePos: 'E1',
                action: 'C1' + ACTION_TYPES.CASTLE,
            }
            const canCastle = {
                1: true,
                2: false
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).not.toBe(null);
        });

        it('Should not allow a king make a short castle when a spot is not safe', () => {
            const board = createEmptyBoard();
            board[7][4] = BLACK + KING;
            board[7][7] = BLACK + ROOK + '2';
            board[0][5] = WHITE + ROOK + '1';
            const data = {
                piecePos: 'E8',
                action: 'G8' + ACTION_TYPES.CASTLE,
            }
            const canCastle = {
                1: false,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).not.toBe(null);
        });

        it('Should not allow a king make a short castle when they lost the ability to', () => {
            const board = createEmptyBoard();
            board[7][4] = BLACK + KING;
            board[7][7] = BLACK + ROOK + '2';
            const data = {
                piecePos: 'E8',
                action: 'G8' + ACTION_TYPES.CASTLE,
            }
            const canCastle = {
                1: false,
                2: false
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).not.toBe(null);
        });

        it('Should not allow a king make a short castle when there is an enemy behind them', () => {
            const board = createEmptyBoard();
            board[7][4] = BLACK + KING;
            board[7][7] = BLACK + ROOK + '2';
            board[7][0] = WHITE + ROOK + '1';
            const data = {
                piecePos: 'E8',
                action: 'G8' + ACTION_TYPES.CASTLE,
            }
            const canCastle = {
                1: true,
                2: true
            }

            const { error } = validateMove(board, data, canCastle);

            expect(error).not.toBe(null);
        });
    });

    describe('Tests rooks', () => {
        it('Should find no error for moving a rook horizontally', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WR1';
            const data = {
                piecePos: 'A1',
                action: 'H1' + ACTION_TYPES.MOVE,
            }

            const { error } = validateMove(board, data);

            expect(error).toBe(null);
        });

        it('Should find an error for moving a rook horizontally past a piece', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WR1';
            board[0][1] = 'WP1';
            const data = {
                piecePos: 'A1',
                action: 'H1' + ACTION_TYPES.MOVE,
            }

            const { error } = validateMove(board, data);

            expect(error).not.toBe(null);
        });

        it('Should find no error for moving a rook vertically', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WR1';
            const data = {
                piecePos: 'A1',
                action: 'A8' + ACTION_TYPES.MOVE,
            }

            const { error } = validateMove(board, data);

            expect(error).toBe(null);
        });

        it('Should find an error for moving a rook vertically past a piece', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WR1';
            board[1][0] = 'WP1';
            const data = {
                piecePos: 'A1',
                action: 'A8' + ACTION_TYPES.MOVE,
            }

            const { error } = validateMove(board, data);

            expect(error).not.toBe(null);
        });
    });

    describe('Tests bishops', () => {
        it('Should find no error for moving a bishop diagonally', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WB1';
            const data = {
                piecePos: 'A1',
                action: 'H8' + ACTION_TYPES.MOVE,
            }

            const { error } = validateMove(board, data);

            expect(error).toBe(null);
        });

        it('Should find an error for moving a bishop diagonally past a piece', () => {
            const board = createEmptyBoard();
            board[0][0] = 'WB1';
            board[1][1] = 'WP1';
            const data = {
                piecePos: 'A1',
                action: 'H8' + ACTION_TYPES.MOVE,
            }

            const { error } = validateMove(board, data);

            expect(error).not.toBe(null);
        });
    });
});

describe('Tests getTurnInfo', () => {
    it('Should generate all the starter moves for white', () => {
        const board = createStarterBoard();

        const { actions, isKingSafe } = getTurnInfo(board, PIECE_COLORS.WHITE, INITIAL_BOARD_POSITIONS, {}, { 1: true, 2: true });

        expect(isKingSafe).toBe(true);
        expect(Object.keys(actions).length).toBe(16);
        expect(actions[WHITE + PAWN + '1']).toEqual(['A3' + MOVE, 'A4' + MOVE]);
        expect(actions[WHITE + PAWN + '2']).toEqual(['B3' + MOVE, 'B4' + MOVE]);
        expect(actions[WHITE + PAWN + '3']).toEqual(['C3' + MOVE, 'C4' + MOVE]);
        expect(actions[WHITE + PAWN + '4']).toEqual(['D3' + MOVE, 'D4' + MOVE]);
        expect(actions[WHITE + PAWN + '5']).toEqual(['E3' + MOVE, 'E4' + MOVE]);
        expect(actions[WHITE + PAWN + '6']).toEqual(['F3' + MOVE, 'F4' + MOVE]);
        expect(actions[WHITE + PAWN + '7']).toEqual(['G3' + MOVE, 'G4' + MOVE]);
        expect(actions[WHITE + PAWN + '8']).toEqual(['H3' + MOVE, 'H4' + MOVE]);
        expect(actions[WHITE + ROOK + '1']).toEqual([]);
        expect(actions[WHITE + ROOK + '2']).toEqual([]);
        expect(actions[WHITE + KNIGHT + '1']).toEqual(['A3' + MOVE, 'C3' + MOVE]);
        expect(actions[WHITE + KNIGHT + '2']).toEqual(['F3' + MOVE, 'H3' + MOVE]);
        expect(actions[WHITE + BISHOP + '1']).toEqual([]);
        expect(actions[WHITE + BISHOP + '2']).toEqual([]);
        expect(actions[WHITE + QUEEN]).toEqual([]);
        expect(actions[WHITE + KING]).toEqual([]);
    });

    it('Should generate all possible moves for black', () => {
        const board = createStarterBoard();

        const { actions, isKingSafe } = getTurnInfo(board, PIECE_COLORS.BLACK, INITIAL_BOARD_POSITIONS, {}, { 1: true, 2: true });

        expect(isKingSafe).toBe(true);
        expect(Object.keys(actions).length).toBe(16);
        expect(actions[BLACK + PAWN + '1']).toEqual(['A6' + MOVE, 'A5' + MOVE]);
        expect(actions[BLACK + PAWN + '2']).toEqual(['B6' + MOVE, 'B5' + MOVE]);
        expect(actions[BLACK + PAWN + '3']).toEqual(['C6' + MOVE, 'C5' + MOVE]);
        expect(actions[BLACK + PAWN + '4']).toEqual(['D6' + MOVE, 'D5' + MOVE]);
        expect(actions[BLACK + PAWN + '5']).toEqual(['E6' + MOVE, 'E5' + MOVE]);
        expect(actions[BLACK + PAWN + '6']).toEqual(['F6' + MOVE, 'F5' + MOVE]);
        expect(actions[BLACK + PAWN + '7']).toEqual(['G6' + MOVE, 'G5' + MOVE]);
        expect(actions[BLACK + PAWN + '8']).toEqual(['H6' + MOVE, 'H5' + MOVE]);
        expect(actions[BLACK + ROOK + '1']).toEqual([]);
        expect(actions[BLACK + ROOK + '2']).toEqual([]);
        expect(actions[BLACK + KNIGHT + '1']).toEqual(['A6' + MOVE, 'C6' + MOVE]);
        expect(actions[BLACK + KNIGHT + '2']).toEqual(['F6' + MOVE, 'H6' + MOVE]);
        expect(actions[BLACK + BISHOP + '1']).toEqual([]);
        expect(actions[BLACK + BISHOP + '2']).toEqual([]);
        expect(actions[BLACK + QUEEN]).toEqual([]);
        expect(actions[BLACK + KING]).toEqual([]);
    });

    it('Should generate moves for a knight', () => {
        const board = createStarterBoard();
        const moveBoard = movePiece(board, 'G1', 'E5')
        const positions = JSON.parse(JSON.stringify(INITIAL_BOARD_POSITIONS))
        positions[WHITE + KNIGHT + '2'] = 'E5';

        const { actions, isKingSafe } = getTurnInfo(moveBoard, PIECE_COLORS.WHITE, positions, {}, { 1: true, 2: true });
        const knightActions = actions[WHITE + KNIGHT + '2'];

        expect(isKingSafe).toBe(true);
        expect(knightActions.length).toBe(8);
        expect(knightActions).toContain('D3' + MOVE);
        expect(knightActions).toContain('F3' + MOVE);
        expect(knightActions).toContain('C4' + MOVE);
        expect(knightActions).toContain('C6' + MOVE);
        expect(knightActions).toContain('G4' + MOVE);
        expect(knightActions).toContain('G6' + MOVE);
        expect(knightActions).toContain('F7' + CAPTURE);
        expect(knightActions).toContain('D7' + CAPTURE);
    });

    it('Should generate only moves that pull the king out of check', () => {
        const board = createEmptyBoard();
        placePiece(board, 'A1', WHITE + KING);
        placePiece(board, 'B8', BLACK + ROOK + '1');
        placePiece(board, 'H2', BLACK + ROOK + '2');
        placePiece(board, 'C3', BLACK + BISHOP + '1');
        placePiece(board, 'G7', WHITE + QUEEN);
        const positions = createDeadPositions();
        positions[WHITE + KING] = 'A1';
        positions[BLACK + ROOK + '1'] = 'B8';
        positions[BLACK + ROOK + '2'] = 'H2';
        positions[BLACK + BISHOP + '1'] = 'C3';
        positions[WHITE + QUEEN] = 'G7';

        const { actions, isKingSafe } = getTurnInfo(board, PIECE_COLORS.WHITE, positions, {}, { 1: false, 2: false });

        expect(isKingSafe).toBe(false);
        expect(actions[WHITE + KING].length).toBe(0)
        expect(actions[WHITE + QUEEN].length).toBe(1)
        expect(actions[WHITE + QUEEN]).toContain('C3' + CAPTURE)
        expect(actions[WHITE + ROOK + '1'].length).toBe(0)
    })

    it('Should generate rook moves for a rook pawn', () => {
        const board = createEmptyBoard();
        placePiece(board, 'A1', WHITE + PAWN + '1');
        placePiece(board, 'A8', BLACK + PAWN + '1');
        placePiece(board, 'B2', BLACK + PAWN + '2');
        const positions = createDeadPositions();
        positions[WHITE + PAWN + '1'] = 'A1';
        positions[BLACK + PAWN + '1'] = 'A8';
        positions[BLACK + PAWN + '2'] = 'B2';
        const registry = { [WHITE + PAWN + '1']: ROOK }

        const { actions, isKingSafe } = getTurnInfo(board, PIECE_COLORS.WHITE, positions, registry, { 1: true, 2: true });

        expect(isKingSafe).toBe(true);
        expect(actions[WHITE + PAWN + '1'].length).toBe(14);
        expect(actions[WHITE + PAWN + '1']).toContain('A2' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('A3' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('A4' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('A5' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('A6' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('A7' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('A8' + CAPTURE);
        expect(actions[WHITE + PAWN + '1']).toContain('B1' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('C1' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('D1' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('E1' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('F1' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('G1' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('H1' + MOVE);
    })

    it('Should generate knight moves for a knight pawn', () => {
        const board = createEmptyBoard();
        placePiece(board, 'E5', WHITE + PAWN + '1');
        placePiece(board, 'F7', BLACK + PAWN + '1');
        placePiece(board, 'D7', BLACK + PAWN + '2');
        const positions = createDeadPositions();
        positions[WHITE + PAWN + '1'] = 'E5';
        positions[BLACK + PAWN + '1'] = 'F7';
        positions[BLACK + PAWN + '2'] = 'D7';
        const registry = { [WHITE + PAWN + '1']: KNIGHT }

        const { actions, isKingSafe } = getTurnInfo(board, PIECE_COLORS.WHITE, positions, registry, { 1: true, 2: true });

        expect(isKingSafe).toBe(true);
        expect(actions[WHITE + PAWN + '1'].length).toBe(8);
        expect(actions[WHITE + PAWN + '1']).toContain('D3' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('F3' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('C4' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('C6' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('G4' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('G6' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('F7' + CAPTURE);
        expect(actions[WHITE + PAWN + '1']).toContain('D7' + CAPTURE);
    });

    it('Should generate bishop moves for a bishop pawn', () => {
        const board = createEmptyBoard();
        placePiece(board, 'A1', WHITE + PAWN + '1');
        placePiece(board, 'G7', BLACK + PAWN + '1');
        placePiece(board, 'H8', BLACK + PAWN + '2');
        const positions = createDeadPositions();
        positions[WHITE + PAWN + '1'] = 'A1';
        positions[BLACK + PAWN + '1'] = 'G7';
        positions[BLACK + PAWN + '2'] = 'H8';
        const registry = { [WHITE + PAWN + '1']: BISHOP }

        const { actions, isKingSafe } = getTurnInfo(board, PIECE_COLORS.WHITE, positions, registry, { 1: true, 2: true });

        expect(isKingSafe).toBe(true);
        expect(actions[WHITE + PAWN + '1'].length).toBe(6);
        expect(actions[WHITE + PAWN + '1']).toContain('B2' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('C3' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('D4' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('E5' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('F6' + MOVE);
        expect(actions[WHITE + PAWN + '1']).toContain('G7' + CAPTURE);
    });

    it('Should generate castle moves for a king if the flag is enabled', () => {
        const board = createEmptyBoard();
        placePiece(board, 'E1', WHITE + KING);
        placePiece(board, 'A1', WHITE + ROOK + '1');
        placePiece(board, 'H1', WHITE + ROOK + '2');
        const positions = createDeadPositions();
        positions[WHITE + KING] = 'E1';
        positions[WHITE + ROOK + '1'] = 'A1';
        positions[WHITE + ROOK + '2'] = 'H1';

        const { actions, isKingSafe } = getTurnInfo(board, PIECE_COLORS.WHITE, positions, {}, { 1: true, 2: false });

        expect(isKingSafe).toBe(true);
        expect(actions[WHITE + KING].length).toBe(6);
        expect(actions[WHITE + KING]).toContain('D1' + MOVE);
        expect(actions[WHITE + KING]).toContain('D2' + MOVE);
        expect(actions[WHITE + KING]).toContain('E2' + MOVE);
        expect(actions[WHITE + KING]).toContain('F2' + MOVE);
        expect(actions[WHITE + KING]).toContain('F1' + MOVE);
        expect(actions[WHITE + KING]).toContain('C1' + CASTLE);
    });

    it('Should generate castle moves for a king if the path is safe', () => {
        const board = createEmptyBoard();
        placePiece(board, 'E1', WHITE + KING);
        placePiece(board, 'A1', WHITE + ROOK + '1');
        placePiece(board, 'H1', WHITE + ROOK + '2');
        placePiece(board, 'C7', BLACK + ROOK + '1');
        const positions = createDeadPositions();
        positions[WHITE + KING] = 'E1';
        positions[WHITE + ROOK + '1'] = 'A1';
        positions[WHITE + ROOK + '2'] = 'H1';

        const { actions, isKingSafe } = getTurnInfo(board, PIECE_COLORS.WHITE, positions, {}, { 1: true, 2: true });

        expect(isKingSafe).toBe(true);
        expect(actions[WHITE + KING].length).toBe(6);
        expect(actions[WHITE + KING]).toContain('D1' + MOVE);
        expect(actions[WHITE + KING]).toContain('D2' + MOVE);
        expect(actions[WHITE + KING]).toContain('E2' + MOVE);
        expect(actions[WHITE + KING]).toContain('F2' + MOVE);
        expect(actions[WHITE + KING]).toContain('F1' + MOVE);
        expect(actions[WHITE + KING]).toContain('G1' + CASTLE);
    });
})
