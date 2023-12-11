import { createInitialBoard } from "../../tools";
import { PIECE_VALUES, DIRECTION_VECTORS } from "../../../src/tools/enums";

import { isEmpty, findNearestPiece, isInRange, isSafe } from "../../../src/tools/tools/board"

describe('Tests the isEmpty function', () => {
    it('Should return true if the space is empty', () => {
        const board = createInitialBoard();

        board.forEach((_row, row) => {
            _row.forEach((_col, col) => {
                expect(isEmpty(board, [row, col])).toBe(true);
            });
        });
    });

    it('Should return false if the space is not empty', () => {
        const board = createInitialBoard();

        board.forEach((_row, row) => {
            _row.forEach((_col, col) => {
                board[row][col] = PIECE_VALUES.PAWN;
                expect(isEmpty(board, [row, col])).toBe(false);
            });
        });
    });
});

describe('Tests the isInRange function', () => {
    it('Should return true if the space is in range', () => {
        expect(isInRange([0, 0])).toBe(true);
        expect(isInRange([7, 7])).toBe(true);
        expect(isInRange([4, 4])).toBe(true);
    });

    it('Should return false if the space is not in range', () => {
        expect(isInRange([-1, 0])).toBe(false);
        expect(isInRange([0, -1])).toBe(false);
        expect(isInRange([8, 0])).toBe(false);
        expect(isInRange([0, 8])).toBe(false);
    });
});

describe('Tests the findNearestPiece function', () => {
    describe('Test the EAST direction', () => {
        it('Should find a piece towards the EAST', () => {
            const board = createInitialBoard();
            board[0][1] = 'WP1';
            board[0][2] = 'WP2';

            const result = findNearestPiece(board, [0, 0], DIRECTION_VECTORS.EAST, 'WP1');

            expect(result).toEqual([0, 2]);
        });

        it('Should return null if no piece is found', () => {
            const board = createInitialBoard();
            board[0][2] = 'WP2';

            const result = findNearestPiece(board, [0, 2], DIRECTION_VECTORS.EAST, 'WP2');

            expect(result).toBe(null);
        });

        it('Should find the first piece towards the EAST', () => {
            const board = createInitialBoard();
            board[0][1] = 'WP1';
            board[0][2] = 'WP2';
            board[0][3] = 'WP3';

            const result = findNearestPiece(board, [0, 0], DIRECTION_VECTORS.EAST, 'WP1');

            expect(result).toEqual([0, 2]);
        });

        it('Should ignore an identical piece', () => {
            const board = createInitialBoard();
            board[0][1] = 'WP1';

            const result = findNearestPiece(board, [0, 0], DIRECTION_VECTORS.EAST, 'WP1');

            expect(result).toEqual(null);
        });

        it('Should ignore an identical piece and find the next piece', () => {
            const board = createInitialBoard();
            board[0][1] = 'WP1';
            board[0][2] = 'WP2';

            const result = findNearestPiece(board, [0, 0], DIRECTION_VECTORS.EAST, 'WP1');

            expect(result).toEqual([0, 2]);
        });
    });

    describe('Test the WEST direction', () => {
        it('Should find a piece towards the WEST', () => {
            const board = createInitialBoard();
            board[0][1] = 'WP1';
            board[0][2] = 'WP2';

            const result = findNearestPiece(board, [0, 3], DIRECTION_VECTORS.WEST, 'WP2');

            expect(result).toEqual([0, 1]);
        });

        it('Should return null if no piece is found', () => {
            const board = createInitialBoard();
            board[0][2] = 'WP2';

            const result = findNearestPiece(board, [0, 2], DIRECTION_VECTORS.WEST, 'WP2');

            expect(result).toBe(null);
        });

        it('Should find the first piece towards the WEST', () => {
            const board = createInitialBoard();
            board[0][1] = 'WP1';
            board[0][2] = 'WP2';
            board[0][3] = 'WP3';

            const result = findNearestPiece(board, [0, 3], DIRECTION_VECTORS.WEST, 'WP3');

            expect(result).toEqual([0, 2]);
        });

        it('Should ignore an identical piece', () => {
            const board = createInitialBoard();
            board[0][1] = 'WP1';

            const result = findNearestPiece(board, [0, 3], DIRECTION_VECTORS.WEST, 'WP1');

            expect(result).toEqual(null);
        });

        it('Should ignore an identical piece and find the next piece', () => {
            const board = createInitialBoard();
            board[0][1] = 'WP1';
            board[0][2] = 'WP2';

            const result = findNearestPiece(board, [0, 3], DIRECTION_VECTORS.WEST, 'WP2');

            expect(result).toEqual([0, 1]);
        });
    });

    describe('Test the NORTH direction', () => {
        it('Should find a piece towards the NORTH', () => {
            const board = createInitialBoard();
            board[1][0] = 'WP1';
            board[2][0] = 'WP2';

            const result = findNearestPiece(board, [3, 0], DIRECTION_VECTORS.NORTH, 'WP2');

            expect(result).toEqual([1, 0]);
        });

        it('Should return null if no piece is found', () => {
            const board = createInitialBoard();
            board[2][0] = 'WP2';

            const result = findNearestPiece(board, [2, 0], DIRECTION_VECTORS.NORTH, 'WP2');

            expect(result).toBe(null);
        });

        it('Should find the first piece towards the NORTH', () => {
            const board = createInitialBoard();
            board[1][0] = 'WP1';
            board[2][0] = 'WP2';
            board[3][0] = 'WP3';

            const result = findNearestPiece(board, [3, 0], DIRECTION_VECTORS.NORTH, 'WP3');

            expect(result).toEqual([2, 0]);
        });

        it('Should ignore an identical piece', () => {
            const board = createInitialBoard();
            board[1][0] = 'WP1';

            const result = findNearestPiece(board, [3, 0], DIRECTION_VECTORS.NORTH, 'WP1');

            expect(result).toEqual(null);
        });

        it('Should ignore an identical piece and find the next piece', () => {
            const board = createInitialBoard();
            board[1][0] = 'WP1';
            board[2][0] = 'WP2';

            const result = findNearestPiece(board, [3, 0], DIRECTION_VECTORS.NORTH, 'WP2');

            expect(result).toEqual([1, 0]);
        });
    });

    describe('Test the SOUTH direction', () => {
        it('Should find a piece towards the SOUTH', () => {
            const board = createInitialBoard();
            board[1][0] = 'WP1';
            board[2][0] = 'WP2';

            const result = findNearestPiece(board, [0, 0], DIRECTION_VECTORS.SOUTH, 'WP1');

            expect(result).toEqual([2, 0]);
        });

        it('Should return null if no piece is found', () => {
            const board = createInitialBoard();
            board[2][0] = 'WP2';

            const result = findNearestPiece(board, [2, 0], DIRECTION_VECTORS.SOUTH, 'WP2');

            expect(result).toBe(null);
        });

        it('Should find the first piece towards the SOUTH', () => {
            const board = createInitialBoard();
            board[1][0] = 'WP1';
            board[2][0] = 'WP2';
            board[3][0] = 'WP3';

            const result = findNearestPiece(board, [0, 0], DIRECTION_VECTORS.SOUTH, 'WP1');

            expect(result).toEqual([2, 0]);
        });

        it('Should ignore an identical piece', () => {
            const board = createInitialBoard();
            board[1][0] = 'WP1';

            const result = findNearestPiece(board, [0, 0], DIRECTION_VECTORS.SOUTH, 'WP1');

            expect(result).toEqual(null);
        });

        it('Should ignore an identical piece and find the next piece', () => {
            const board = createInitialBoard();
            board[1][0] = 'WP1';
            board[2][0] = 'WP2';

            const result = findNearestPiece(board, [0, 0], DIRECTION_VECTORS.SOUTH, 'WP1');

            expect(result).toEqual([2, 0]);
        });
    });

    describe('Test the NORTH_EAST direction', () => {
        it('Should find a piece towards the NORTH_EAST', () => {
            const board = createInitialBoard();
            board[1][3] = 'WP1';
            board[2][2] = 'WP2';

            const result = findNearestPiece(board, [2, 2], DIRECTION_VECTORS.NORTH_EAST, 'WP2');

            expect(result).toEqual([1, 3]);
        });

        it('Should return null if no piece is found', () => {
            const board = createInitialBoard();
            board[2][2] = 'WP2';

            const result = findNearestPiece(board, [2, 2], DIRECTION_VECTORS.NORTH_EAST, 'WP2');

            expect(result).toBe(null);
        });

        it('Should find the first piece towards the NORTH_EAST', () => {
            const board = createInitialBoard();
            board[1][3] = 'WP1';
            board[2][2] = 'WP2';
            board[3][1] = 'WP3';

            const result = findNearestPiece(board, [3, 1], DIRECTION_VECTORS.NORTH_EAST, 'WP3');

            expect(result).toEqual([2, 2]);
        });

        it('Should ignore an identical piece', () => {
            const board = createInitialBoard();
            board[1][1] = 'WP1';

            const result = findNearestPiece(board, [3, 3], DIRECTION_VECTORS.NORTH_EAST, 'WP1');

            expect(result).toEqual(null);
        });

        it('Should ignore an identical piece and find the next piece', () => {
            const board = createInitialBoard();
            board[1][3] = 'WP1';
            board[2][2] = 'WP2';

            const result = findNearestPiece(board, [3, 1], DIRECTION_VECTORS.NORTH_EAST, 'WP2');

            expect(result).toEqual([1, 3]);
        });
    });

    describe('Test the NORTH_WEST direction', () => {
        it('Should find a piece towards the NORTH_WEST', () => {
            const board = createInitialBoard();
            board[1][1] = 'WP1';
            board[2][2] = 'WP2';

            const result = findNearestPiece(board, [2, 2], DIRECTION_VECTORS.NORTH_WEST, 'WP2');

            expect(result).toEqual([1, 1]);
        });

        it('Should return null if no piece is found', () => {
            const board = createInitialBoard();
            board[2][0] = 'WP2';

            const result = findNearestPiece(board, [2, 0], DIRECTION_VECTORS.NORTH_WEST, 'WP2');

            expect(result).toBe(null);
        });

        it('Should find the first piece towards the NORTH_WEST', () => {
            const board = createInitialBoard();
            board[1][1] = 'WP1';
            board[2][2] = 'WP2';
            board[3][3] = 'WP3';

            const result = findNearestPiece(board, [3, 3], DIRECTION_VECTORS.NORTH_WEST, 'WP3');

            expect(result).toEqual([2, 2]);
        });

        it('Should ignore an identical piece', () => {
            const board = createInitialBoard();
            board[1][1] = 'WP1';

            const result = findNearestPiece(board, [3, 0], DIRECTION_VECTORS.NORTH_WEST, 'WP1');

            expect(result).toEqual(null);
        });

        it('Should ignore an identical piece and find the next piece', () => {
            const board = createInitialBoard();
            board[1][1] = 'WP1';
            board[2][2] = 'WP2';

            const result = findNearestPiece(board, [3, 3], DIRECTION_VECTORS.NORTH_WEST, 'WP2');

            expect(result).toEqual([1, 1]);
        });
    });

    describe('Test the SOUTH_EAST direction', () => {
        it('Should find a piece towards the SOUTH_EAST', () => {
            const board = createInitialBoard();
            board[1][3] = 'WP1';
            board[2][2] = 'WP2';

            const result = findNearestPiece(board, [0, 0], DIRECTION_VECTORS.SOUTH_EAST, 'WP1');

            expect(result).toEqual([2, 2]);
        });

        it('Should return null if no piece is found', () => {
            const board = createInitialBoard();
            board[2][2] = 'WP2';

            const result = findNearestPiece(board, [2, 2], DIRECTION_VECTORS.SOUTH_EAST, 'WP2');

            expect(result).toBe(null);
        });

        it('Should find the first piece towards the SOUTH_EAST', () => {
            const board = createInitialBoard();
            board[1][3] = 'WP1';
            board[2][2] = 'WP2';
            board[3][1] = 'WP3';

            const result = findNearestPiece(board, [0, 0], DIRECTION_VECTORS.SOUTH_EAST, 'WP1');

            expect(result).toEqual([2, 2]);
        });

        it('Should ignore an identical piece', () => {
            const board = createInitialBoard();
            board[1][1] = 'WP1';

            const result = findNearestPiece(board, [0, 0], DIRECTION_VECTORS.SOUTH_EAST, 'WP1');

            expect(result).toEqual(null);
        });

        it('Should ignore an identical piece and find the next piece', () => {
            const board = createInitialBoard();
            board[1][2] = 'WP1';
            board[2][3] = 'WP2';

            const result = findNearestPiece(board, [0, 1], DIRECTION_VECTORS.SOUTH_EAST, 'WP1');

            expect(result).toEqual([2, 3]);
        });
    });

    describe('Test the SOUTH_WEST direction', () => {
        it('Should find a piece towards the SOUTH_WEST', () => {
            const board = createInitialBoard();
            board[1][1] = 'WP1';
            board[2][0] = 'WP2';

            const result = findNearestPiece(board, [1, 1], DIRECTION_VECTORS.SOUTH_WEST, 'WP1');

            expect(result).toEqual([2, 0]);
        });

        it('Should return null if no piece is found', () => {
            const board = createInitialBoard();
            board[2][2] = 'WP2';

            const result = findNearestPiece(board, [2, 2], DIRECTION_VECTORS.SOUTH_WEST, 'WP2');

            expect(result).toBe(null);
        });

        it('Should find the first piece towards the SOUTH_WEST', () => {
            const board = createInitialBoard();
            board[1][3] = 'WP1';
            board[2][2] = 'WP2';
            board[3][1] = 'WP3';

            const result = findNearestPiece(board, [1, 3], DIRECTION_VECTORS.SOUTH_WEST, 'WP1');

            expect(result).toEqual([2, 2]);
        });

        it('Should ignore an identical piece', () => {
            const board = createInitialBoard();
            board[1][1] = 'WP1';

            const result = findNearestPiece(board, [0, 0], DIRECTION_VECTORS.SOUTH_WEST, 'WP1');

            expect(result).toEqual(null);
        });

        it('Should ignore an identical piece and find the next piece', () => {
            const board = createInitialBoard();
            board[1][1] = 'WP1';
            board[2][0] = 'WP2';

            const result = findNearestPiece(board, [0, 2], DIRECTION_VECTORS.SOUTH_WEST, 'WP1');

            expect(result).toEqual([2, 0]);
        });
    });
});

describe('Tests the isSafe function', () => {
    describe('Tests the danger from a pawn', () => {
        it('Should return false if a white pawn is in the bottom left or right side of a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            expect(isSafe(board, [3, 3], 'BP1')).toBe(false);
            expect(isSafe(board, [3, 5], 'BP1')).toBe(false);
        });

        it('Should return false if a black pawn is in the top left or right side of a white piece', () => {
            const board = createInitialBoard();
            board[3][3] = 'BP1';

            expect(isSafe(board, [4, 4], 'WP1')).toBe(false);
            expect(isSafe(board, [4, 2], 'WP1')).toBe(false);
        });

        it('Should return true if a white pawn is in the bottom left or right side of a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            expect(isSafe(board, [3, 3], 'WP1')).toBe(true);
            expect(isSafe(board, [3, 5], 'WP1')).toBe(true);
        });

        it('Should return true if a black pawn is in the top left or right side of a black piece', () => {
            const board = createInitialBoard();
            board[3][3] = 'BP1';

            expect(isSafe(board, [4, 4], 'BP1')).toBe(true);
            expect(isSafe(board, [4, 2], 'BP1')).toBe(true);
        });

        it('Should return true if a white pawn is in the top left or right side of a black piece', () => {
            const board = createInitialBoard();
            board[3][3] = 'WP1';

            expect(isSafe(board, [4, 4], 'BP1')).toBe(true);
            expect(isSafe(board, [4, 2], 'BP1')).toBe(true);
        });

        it('Should return true if a black pawn is in the bottom left or right side of a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';
            board[3][3] = 'WP1';
            board[3][5] = 'WP2';

            const leftResult = isSafe(board, [3, 3], 'WP1');
            const rightResult = isSafe(board, [3, 5], 'WP1');

            expect(leftResult).toBe(true);
            expect(rightResult).toBe(true);
        });

        it('Should return true if a white pawn is in front of a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            expect(isSafe(board, [5, 4], 'WP1')).toBe(true);
        });

        it('Should return true if a black pawn is in front of a white piece', () => {
            const board = createInitialBoard();
            board[3][3] = 'WP1';

            expect(isSafe(board, [2, 3], 'BP1')).toBe(true);
        });
    });

    describe('Tests the danger from a knight', () => {
        const KNIGHT_VECTORS = [
            [1, 2],
            [2, 1],
            [-1, 2],
            [-2, 1],
            [1, -2],
            [2, -1],
            [-1, -2],
            [-2, -1],
        ];

        it('Should return false if a white knight is in any of the 8 possible positions for a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            KNIGHT_VECTORS.forEach(([row, col]) => {
                board[4 + row][4 + col] = 'WN1';

                const result = isSafe(board, [4, 4], 'BP1');
                expect(result).toBe(false);

                board[4 + row][4 + col] = PIECE_VALUES.EMPTY;
            });
        });

        it('Should return false if a black knight is in any of the 8 possible positions for a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            KNIGHT_VECTORS.forEach(([row, col]) => {
                board[4 + row][4 + col] = 'BN1';

                const result = isSafe(board, [4, 4], 'WP1');
                expect(result).toBe(false);

                board[4 + row][4 + col] = PIECE_VALUES.EMPTY;
            });
        });

        it('Should return true if a white knight is in any of the 8 possible positions for a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            KNIGHT_VECTORS.forEach(([row, col]) => {
                board[4 + row][4 + col] = 'WN1';

                const result = isSafe(board, [4, 4], 'WP1');
                expect(result).toBe(true);

                board[4 + row][4 + col] = PIECE_VALUES.EMPTY;
            });
        });

        it('Should return true if a black knight is in any of the 8 possible positions for a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            KNIGHT_VECTORS.forEach(([row, col]) => {
                board[4 + row][4 + col] = 'BN1';

                const result = isSafe(board, [4, 4], 'BP1');
                expect(result).toBe(true);

                board[4 + row][4 + col] = PIECE_VALUES.EMPTY;
            });
        });
    });

    describe('Tests the danger from a rook', () => {
        it('Should return false if a white rook is in the same row as a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            for (let col = 0; col < 8; col++) {
                if (col === 4) continue;
                board[4][col] = 'WR1';

                const result = isSafe(board, [4, 4], 'BP1');
                expect(result).toBe(false);

                board[4][col] = PIECE_VALUES.EMPTY;
            }
        });

        it('Should return false if a black rook is in the same row as a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            for (let col = 0; col < 8; col++) {
                if (col === 4) continue;
                board[4][col] = 'BR1';

                const result = isSafe(board, [4, 4], 'WP1');
                expect(result).toBe(false);

                board[4][col] = PIECE_VALUES.EMPTY;
            }
        });

        it('Should return false if a white rook is in the same column as a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            for (let row = 0; row < 8; row++) {
                if (row === 4) continue;
                board[row][4] = 'WR1';

                const result = isSafe(board, [4, 4], 'BP1');
                expect(result).toBe(false);

                board[row][4] = PIECE_VALUES.EMPTY;
            }
        });

        it('Should return false if a black rook is in the same column as a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            for (let row = 0; row < 8; row++) {
                if (row === 4) continue;
                board[row][4] = 'BR1';


                const result = isSafe(board, [4, 4], 'WP1');
                expect(result).toBe(false);

                board[row][4] = PIECE_VALUES.EMPTY;
            }
        });

        it('Should return true if a white rook is in the same row as a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            for (let col = 0; col < 8; col++) {
                if (col === 4) continue;
                board[4][col] = 'WR1';

                const result = isSafe(board, [4, 4], 'WP1');
                expect(result).toBe(true);

                board[4][col] = PIECE_VALUES.EMPTY;
            }
        });

        it('Should return true if a black rook is in the same row as a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            for (let col = 0; col < 8; col++) {
                if (col === 4) continue;
                board[4][col] = 'BR1';

                const result = isSafe(board, [4, 4], 'BP1');
                expect(result).toBe(true);

                board[4][col] = PIECE_VALUES.EMPTY;
            }
        });

        it('Should return true if a white rook is not in the same row or col as a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            for (let diag = 0; diag < 8; diag++) {
                if (diag === 4) continue;
                board[diag][diag] = 'WR1';

                const result = isSafe(board, [4, 4], 'BP1');
                expect(result).toBe(true);

                board[diag][diag] = PIECE_VALUES.EMPTY;
            }
        });

        it('Should return true if a black rook is not in the same row or col as a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            for (let diag = 0; diag < 8; diag++) {
                if (diag === 4 || 7 - diag === 4) continue;
                board[diag][7 - diag] = 'BR1';

                const result = isSafe(board, [4, 4], 'WP1');
                expect(result).toBe(true);

                board[diag][7 - diag] = PIECE_VALUES.EMPTY;
            }
        });

        it('Should return trye if a rook is blocked by another piece from attacking', () => {
            const board = createInitialBoard();
            board[4][2] = 'BR2';
            board[4][3] = 'BP2';
            board[4][4] = 'WK';
            board[4][5] = 'BP1';
            board[4][6] = 'BR1';
            board[3][4] = 'WP1';
            board[5][4] = 'WP2';
            board[2][4] = 'BR3';
            board[6][4] = 'BR4';

            const result = isSafe(board, [4, 4], 'WK');

            expect(result).toBe(true);
        });
    });

    describe('Tests the danger from a bishop', () => {
        it('Should return false if a white bishop is in the same diagonal as a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            for (let diag = 0; diag < 8; diag++) {
                if (diag === 4) continue;
                board[diag][diag] = 'WB1';

                const result = isSafe(board, [4, 4], 'BP1');
                expect(result).toBe(false);

                board[diag][diag] = PIECE_VALUES.EMPTY;
            }

            for (let diag = 1; diag < 8; diag++) {
                if (diag === 4) continue;
                board[diag][8 - diag] = 'WB1';

                const result = isSafe(board, [4, 4], 'BP1');
                expect(result).toBe(false);

                board[diag][7 - diag] = PIECE_VALUES.EMPTY;
            }
        });

        it('Should return false if a black bishop is in the same diagonal as a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            for (let diag = 0; diag < 8; diag++) {
                if (diag === 4) continue;
                board[diag][diag] = 'BB1';

                const result = isSafe(board, [4, 4], 'WP1');
                expect(result).toBe(false);

                board[diag][diag] = PIECE_VALUES.EMPTY;
            }

            for (let diag = 1; diag < 8; diag++) {
                if (diag === 4) continue;
                board[diag][diag] = 'BB1';

                const result = isSafe(board, [4, 4], 'WP1');
                expect(result).toBe(false);

                board[diag][7 - diag] = PIECE_VALUES.EMPTY;
            }
        });

        it('Should return true if a white bishop is in the same diagonal as a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            for (let diag = 0; diag < 8; diag++) {
                if (diag === 4) continue;
                board[diag][diag] = 'WB1';

                const result = isSafe(board, [4, 4], 'WP1');
                expect(result).toBe(true);

                board[diag][diag] = PIECE_VALUES.EMPTY;
            }

            for (let diag = 1; diag < 8; diag++) {
                if (diag === 4) continue;
                board[diag][diag] = 'WB1';

                const result = isSafe(board, [4, 4], 'WP1');
                expect(result).toBe(true);

                board[diag][7 - diag] = PIECE_VALUES.EMPTY;
            }
        });

        it('Should return true if a black bishop is in the same diagonal as a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            for (let diag = 0; diag < 8; diag++) {
                if (diag === 4) continue;
                board[diag][diag] = 'BB1';

                const result = isSafe(board, [4, 4], 'BP1');
                expect(result).toBe(true);

                board[diag][diag] = PIECE_VALUES.EMPTY;
            }

            for (let diag = 1; diag < 8; diag++) {
                if (diag === 4) continue;
                board[diag][diag] = 'BB1';

                const result = isSafe(board, [4, 4], 'BP1');
                expect(result).toBe(true);

                board[diag][7 - diag] = PIECE_VALUES.EMPTY;
            }
        });

        it('Should return true if a black bishop is not in the same diagonal as a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            for (let col = 0; col < 8; col++) {
                if (col === 4) continue;
                board[4][col] = 'WB1';

                const result = isSafe(board, [4, 4], 'BP1');
                expect(result).toBe(true);

                board[4][col] = PIECE_VALUES.EMPTY;
            }

            for (let row = 0; row < 8; row++) {
                if (row === 4) continue;
                board[row][4] = 'WB1';

                const result = isSafe(board, [4, 4], 'BP1');
                expect(result).toBe(true);

                board[row][4] = PIECE_VALUES.EMPTY;
            }
        });
    });

    describe('Tests the danger from a queen', () => {
        it('Should return false if a white queen is in the same column, row or diagonal as a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (row === 4 && col === 4) continue;
                    board[row][col] = 'WQ1';

                    const result = isSafe(board, [4, 4], 'BP1');

                    if (row === 4 || col === 4) {
                        expect(result).toBe(false);
                    } else if (row === col || row === 8 - col) {
                        expect(result).toBe(false);
                    } else {
                        expect(result).toBe(true);
                    }

                    board[row][col] = PIECE_VALUES.EMPTY;
                }
            }
        });

        it('Should return false if a black queen is in the same column, row or diagonal as a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (row === 4 && col === 4) continue;
                    board[row][col] = 'BQ1';

                    const result = isSafe(board, [4, 4], 'WP1');

                    if (row === 4 || col === 4) {
                        expect(result).toBe(false);
                    } else if (row === col || row === 8 - col) {
                        expect(result).toBe(false);
                    } else {
                        expect(result).toBe(true);
                    }

                    board[row][col] = PIECE_VALUES.EMPTY;
                }
            }
        });

        it('Should return true if a white queen is in the same column, row or diagonal as a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (row === 4 && col === 4) continue;
                    board[row][col] = 'WQ1';

                    const result = isSafe(board, [4, 4], 'WP1');
                    expect(result).toBe(true);

                    board[row][col] = PIECE_VALUES.EMPTY;
                }
            }
        });

        it('Should return true if a black queen is in the same column, row or diagonal as a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (row === 4 && col === 4) continue;
                    board[row][col] = 'BQ1';

                    const result = isSafe(board, [4, 4], 'BP1');
                    expect(result).toBe(true);

                    board[row][col] = PIECE_VALUES.EMPTY;
                }
            }
        });

        it('Should return true if a queen is blocked by another piece from attacking', () => {
            const board = createInitialBoard();
            board[4][4] = 'BK';
            board[4][3] = 'BP1';
            board[4][5] = 'BP2';
            board[3][4] = 'BP3';
            board[5][4] = 'BP4';
            board[3][3] = 'BP5';
            board[5][5] = 'BP6';
            board[3][5] = 'BP7';
            board[5][3] = 'BP8';

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (3 <= row && row <= 5 && 3 <= col && col <= 5) continue;
                    board[row][col] = 'BQ1';

                    const result = isSafe(board, [4, 4], 'BP1');
                    expect(result).toBe(true);

                    board[row][col] = PIECE_VALUES.EMPTY;
                }
            }
        });
    });

    describe('Tests the danger from a king', () => {
        it('Should return false if a white king is in any of the 8 possible positions for a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (row === 4 && col === 4) continue;
                    board[row][col] = 'WK';

                    const result = isSafe(board, [4, 4], 'BP1');

                    if (3 <= row && row <= 5 && 3 <= col && col <= 5) {
                        expect(result).toBe(false);
                    } else {
                        expect(result).toBe(true);
                    }

                    board[row][col] = PIECE_VALUES.EMPTY;
                }
            }
        });

        it('Should return false if a black king is in any of the 8 possible positions for a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (row === 4 && col === 4) continue;
                    board[row][col] = 'BK';

                    const result = isSafe(board, [4, 4], 'WP1');

                    if (3 <= row && row <= 5 && 3 <= col && col <= 5) {
                        expect(result).toBe(false);
                    } else {
                        expect(result).toBe(true);
                    }

                    board[row][col] = PIECE_VALUES.EMPTY;
                }
            }
        });

        it('Should return true if a white king is in any of the 8 possible positions for a white piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'WP1';

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (row === 4 && col === 4) continue;
                    board[row][col] = 'WK';

                    const result = isSafe(board, [4, 4], 'WP1');
                    expect(result).toBe(true);

                    board[row][col] = PIECE_VALUES.EMPTY;
                }
            }
        });

        it('Should return true if a black king is in any of the 8 possible positions for a black piece', () => {
            const board = createInitialBoard();
            board[4][4] = 'BP1';

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (row === 4 && col === 4) continue;
                    board[row][col] = 'BK';

                    const result = isSafe(board, [4, 4], 'BP1');
                    expect(result).toBe(true);

                    board[row][col] = PIECE_VALUES.EMPTY;
                }
            }
        });
    });

    describe('Tests the ability to ignore a piece', () => {
        it('Should ignore the given piece and see the danger to the left', () => {
            const board = createInitialBoard();

            board[4][3] = 'BK';
            board[4][2] = 'WR1';

            const result = isSafe(board, [4, 4], 'BK');
            expect(result).toBe(false);
        });

        it('Should ignore the given piece and see the danger to the right', () => {
            const board = createInitialBoard();

            board[4][5] = 'BK';
            board[4][6] = 'WR1';

            const result = isSafe(board, [4, 4], 'BK');
            expect(result).toBe(false);
        });

        it('Should ignore the given piece and see the danger to the top', () => {
            const board = createInitialBoard();

            board[3][4] = 'BK';
            board[2][4] = 'WR1';

            const result = isSafe(board, [4, 4], 'BK');
            expect(result).toBe(false);
        });

        it('Should ignore the given piece and see the danger to the bottom', () => {
            const board = createInitialBoard();

            board[5][4] = 'BK';
            board[6][4] = 'WR1';

            const result = isSafe(board, [4, 4], 'BK');
            expect(result).toBe(false);
        });

        it('Should ignore the given piece and see the danger to the north west', () => {
            const board = createInitialBoard();

            board[3][3] = 'BK';
            board[2][2] = 'WB1';

            const result = isSafe(board, [4, 4], 'BK');
            expect(result).toBe(false);
        });

        it('Should ignore the given piece and see the danger to the south east', () => {
            const board = createInitialBoard();

            board[5][5] = 'BK';
            board[6][6] = 'WB1';

            const result = isSafe(board, [4, 4], 'BK');
            expect(result).toBe(false);
        });

        it('Should ignore the given piece and see the danger to the south west', () => {
            const board = createInitialBoard();

            board[5][3] = 'BK';
            board[6][2] = 'WB1';

            const result = isSafe(board, [4, 4], 'BK');
            expect(result).toBe(false);
        });

        it('Should ignore the given piece and see the danger to the north east', () => {
            const board = createInitialBoard();

            board[3][5] = 'BK';
            board[2][6] = 'WB1';

            const result = isSafe(board, [4, 4], 'BK');
            expect(result).toBe(false);
        });
    });
});
