import { createInitialBoard } from "../../tools"

import {
    generateBishopMoves,
    generateKingMoves,
    generateKnightMoves,
    generatePawnMoves,
    generateQueenMoves,
    generateRookMoves,
} from "../../../src/tools/tools/moves";
import { PIECE_COLORS, PIECE_VALUES } from "../../../src/tools/enums";

describe('Tests the generatePawnMoves function', () => {
    it('Should generate two moves for a white pawn in the starting position', () => {
        const board = createInitialBoard();

        for (let col = 0; col < 8; col++) {
            board[1][col] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
            board[6][col] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        }

        for (let col = 0; col < 8; col++) {
            const blackPawnMoves = generatePawnMoves(board, [1, col], PIECE_COLORS.BLACK + PIECE_VALUES.PAWN);
            const whitePawnMoves = generatePawnMoves(board, [6, col], PIECE_COLORS.WHITE + PIECE_VALUES.PAWN);

            expect(blackPawnMoves.length).toBe(2);
            expect(blackPawnMoves).toContain(`2${col}M`);
            expect(blackPawnMoves).toContain(`3${col}M`);

            expect(whitePawnMoves.length).toBe(2);
            expect(whitePawnMoves).toContain(`5${col}M`);
            expect(whitePawnMoves).toContain(`4${col}M`);
        }
    });

    it('Should generate one move for pawns not in the starting position', () => {
        const board = createInitialBoard();

        for (let col = 0; col < 8; col++) {
            board[2][col] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
            board[5][col] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        }

        for (let col = 0; col < 8; col++) {
            const blackPawnMoves = generatePawnMoves(board, [2, col], PIECE_COLORS.BLACK + PIECE_VALUES.PAWN);
            const whitePawnMoves = generatePawnMoves(board, [5, col], PIECE_COLORS.WHITE + PIECE_VALUES.PAWN);

            expect(blackPawnMoves.length).toBe(1);
            expect(blackPawnMoves).toContain(`3${col}M`);

            expect(whitePawnMoves.length).toBe(1);
            expect(whitePawnMoves).toContain(`4${col}M`);
        }
    });

    it('Should generate captures for pawns that have enemies in their front diagonals', () => {
        const board = createInitialBoard();

        for (let col = 0; col < 8; col++) {
            board[3][col] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
            board[4][col] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        }

        for (let col = 0; col < 8; col++) {
            const blackPawnMoves = generatePawnMoves(board, [3, col], PIECE_COLORS.BLACK + PIECE_VALUES.PAWN);
            const whitePawnMoves = generatePawnMoves(board, [4, col], PIECE_COLORS.WHITE + PIECE_VALUES.PAWN);

            if (col === 0) {
                expect(blackPawnMoves.length).toBe(1);
                expect(blackPawnMoves).toContain(`4${col + 1}C`);

                expect(whitePawnMoves.length).toBe(1);
                expect(whitePawnMoves).toContain(`3${col + 1}C`);
            } else if (col === 7) {
                expect(blackPawnMoves.length).toBe(1);
                expect(blackPawnMoves).toContain(`4${col - 1}C`);

                expect(whitePawnMoves.length).toBe(1);
                expect(whitePawnMoves).toContain(`3${col - 1}C`);
            } else {
                expect(blackPawnMoves.length).toBe(2);
                expect(blackPawnMoves).toContain(`4${col + 1}C`);
                expect(blackPawnMoves).toContain(`4${col - 1}C`);

                expect(whitePawnMoves.length).toBe(2);
                expect(whitePawnMoves).toContain(`3${col + 1}C`);
                expect(whitePawnMoves).toContain(`3${col - 1}C`);
            }
        }
    });

    it('Should not generate captures for pawns that have enemies in their back diagonals', () => {
        const board = createInitialBoard();

        for (let col = 0; col < 8; col++) {
            board[3][col] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
            board[4][col] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        }

        for (let col = 0; col < 8; col++) {
            const whitePawnMoves = generatePawnMoves(board, [3, col], PIECE_COLORS.WHITE + PIECE_VALUES.PAWN);
            const blackPawnMoves = generatePawnMoves(board, [4, col], PIECE_COLORS.BLACK + PIECE_VALUES.PAWN);

            expect(blackPawnMoves.length).toBe(1);
            expect(blackPawnMoves).toContain(`5${col}M`);

            expect(whitePawnMoves.length).toBe(1);
            expect(whitePawnMoves).toContain(`2${col}M`);
        }
    });

    it('Should generate all combinations of moves for a pawn if possible', () => {
        const board = createInitialBoard();

        board[1][1] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[2][0] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[2][2] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;

        board[6][1] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][0] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[5][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;

        const blackPawnMoves = generatePawnMoves(board, [1, 1], PIECE_COLORS.BLACK + PIECE_VALUES.PAWN);
        const whitePawnMoves = generatePawnMoves(board, [6, 1], PIECE_COLORS.WHITE + PIECE_VALUES.PAWN);

        expect(blackPawnMoves.length).toBe(4);
        expect(blackPawnMoves).toContain('21M');
        expect(blackPawnMoves).toContain('31M');
        expect(blackPawnMoves).toContain('20C');
        expect(blackPawnMoves).toContain('22C');

        expect(whitePawnMoves.length).toBe(4);
        expect(whitePawnMoves).toContain('51M');
        expect(whitePawnMoves).toContain('41M');
        expect(whitePawnMoves).toContain('50C');
        expect(whitePawnMoves).toContain('52C');
    });

    it('Should not generate moves for pawns that are blocked by other pieces', () => {
        const board = createInitialBoard();

        board[1][1] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[2][1] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;

        board[6][1] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][1] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;

        const blackPawnMoves = generatePawnMoves(board, [1, 1], PIECE_COLORS.BLACK + PIECE_VALUES.PAWN);
        const whitePawnMoves = generatePawnMoves(board, [6, 1], PIECE_COLORS.WHITE + PIECE_VALUES.PAWN);

        expect(blackPawnMoves.length).toBe(0);
        expect(whitePawnMoves.length).toBe(0);
    });

    it('Should not generate moves for pawns that are at the edge of the board', () => {
        const board = createInitialBoard();

        board[0][0] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[0][7] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[7][0] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[7][7] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;

        const whitePawnMoves1 = generatePawnMoves(board, [0, 0], PIECE_COLORS.WHITE + PIECE_VALUES.PAWN);
        const whitePawnMoves2 = generatePawnMoves(board, [0, 7], PIECE_COLORS.WHITE + PIECE_VALUES.PAWN);
        const blackPawnMoves1 = generatePawnMoves(board, [7, 0], PIECE_COLORS.BLACK + PIECE_VALUES.PAWN);
        const blackPawnMoves2 = generatePawnMoves(board, [7, 7], PIECE_COLORS.BLACK + PIECE_VALUES.PAWN);

        expect(blackPawnMoves1.length).toBe(0);
        expect(blackPawnMoves2.length).toBe(0);
        expect(whitePawnMoves1.length).toBe(0);
        expect(whitePawnMoves2.length).toBe(0);
    });
});

describe('Tests the generateRookMoves function', () => {
    it('Should generate all possible movements for a rook', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.ROOK;

        const rookMoves = generateRookMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.ROOK);

        expect(rookMoves.length).toBe(14);
        expect(rookMoves).toContain('40M');
        expect(rookMoves).toContain('41M');
        expect(rookMoves).toContain('42M');
        expect(rookMoves).toContain('43M');
        expect(rookMoves).toContain('45M');
        expect(rookMoves).toContain('46M');
        expect(rookMoves).toContain('47M');
        expect(rookMoves).toContain('04M');
        expect(rookMoves).toContain('14M');
        expect(rookMoves).toContain('24M');
        expect(rookMoves).toContain('34M');
        expect(rookMoves).toContain('54M');
        expect(rookMoves).toContain('64M');
        expect(rookMoves).toContain('74M');
    });

    it('Should not generate moves for rooks that are blocked by other pieces', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.ROOK;
        board[4][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][4] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[4][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[3][4] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;

        const rookMoves = generateRookMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.ROOK);

        expect(rookMoves.length).toBe(0);
    });

    it('Should generate captures for rooks that have enemies in their path', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.ROOK;
        board[4][6] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[6][4] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[4][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[2][4] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;

        const rookMoves = generateRookMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.ROOK);

        expect(rookMoves.length).toBe(8);
        expect(rookMoves).toContain('46C');
        expect(rookMoves).toContain('64C');
        expect(rookMoves).toContain('42C');
        expect(rookMoves).toContain('24C');
        expect(rookMoves).toContain('45M');
        expect(rookMoves).toContain('43M');
        expect(rookMoves).toContain('54M');
        expect(rookMoves).toContain('34M');
    });

    it('Should not generate captures for any pieces that are not in the path of the rook', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.ROOK;
        board[3][3] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[3][5] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[5][3] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[5][5] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[4][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][4] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[4][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[3][4] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;

        const rookMoves = generateRookMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.ROOK);

        expect(rookMoves.length).toBe(0);
    });
});

describe('Tests the generateKnightMoves function', () => {
    it('Should generate all possible movements for a knight', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT;

        const knightMoves = generateKnightMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT);

        expect(knightMoves.length).toBe(8);
        expect(knightMoves).toContain('23M');
        expect(knightMoves).toContain('25M');
        expect(knightMoves).toContain('63M');
        expect(knightMoves).toContain('65M');
        expect(knightMoves).toContain('23M');
        expect(knightMoves).toContain('25M');
        expect(knightMoves).toContain('63M');
        expect(knightMoves).toContain('65M');
    });

    it('Should generate all possible captures for a knight', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT;
        board[2][3] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[2][5] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[3][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[3][6] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[5][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[5][6] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[6][3] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[6][5] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;

        const knightMoves = generateKnightMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT);

        expect(knightMoves.length).toBe(8);
        expect(knightMoves).toContain('23C');
        expect(knightMoves).toContain('25C');
        expect(knightMoves).toContain('63C');
        expect(knightMoves).toContain('65C');
        expect(knightMoves).toContain('23C');
        expect(knightMoves).toContain('25C');
        expect(knightMoves).toContain('63C');
        expect(knightMoves).toContain('65C');
    });

    it('Should not generate moves for knights that are blocked by other pieces', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT;
        board[2][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[2][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[3][2] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[3][6] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][2] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][6] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[6][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[6][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;

        const knightMoves = generateKnightMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT);

        expect(knightMoves.length).toBe(0);
    });

    it('Should not generate moves outside of the board', () => {
        const board = createInitialBoard();
        board[0][0] = PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT;
        board[0][7] = PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT;
        board[7][0] = PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT;
        board[7][7] = PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT;

        const knightMoves1 = generateKnightMoves(board, [0, 0], PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT);
        const knightMoves2 = generateKnightMoves(board, [0, 7], PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT);
        const knightMoves3 = generateKnightMoves(board, [7, 0], PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT);
        const knightMoves4 = generateKnightMoves(board, [7, 7], PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT);

        expect(knightMoves1.length).toBe(2);
        expect(knightMoves1).toContain('12M');
        expect(knightMoves1).toContain('21M');

        expect(knightMoves2.length).toBe(2);
        expect(knightMoves2).toContain('15M');
        expect(knightMoves2).toContain('26M');

        expect(knightMoves3.length).toBe(2);
        expect(knightMoves3).toContain('51M');
        expect(knightMoves3).toContain('62M');

        expect(knightMoves4.length).toBe(2);
        expect(knightMoves4).toContain('56M');
        expect(knightMoves4).toContain('65M');
    });
});

describe('Tests the generateBishopMoves function', () => {
    it('Should generate all possible movements for a bishop', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP;

        const bishopMoves = generateBishopMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP);

        expect(bishopMoves.length).toBe(13);
        expect(bishopMoves).toContain('00M');
        expect(bishopMoves).toContain('11M');
        expect(bishopMoves).toContain('22M');
        expect(bishopMoves).toContain('33M');
        expect(bishopMoves).toContain('55M');
        expect(bishopMoves).toContain('66M');
        expect(bishopMoves).toContain('77M');
        expect(bishopMoves).toContain('17M');
        expect(bishopMoves).toContain('26M');
        expect(bishopMoves).toContain('35M');
        expect(bishopMoves).toContain('53M');
        expect(bishopMoves).toContain('62M');
        expect(bishopMoves).toContain('71M');
    });

    it('Should not generate moves for bishops that are blocked by ally pieces', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP;
        board[3][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[3][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;

        const bishopMoves = generateBishopMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP);

        expect(bishopMoves.length).toBe(0);
    });

    it('Should generate captures for bishops that have enemies in their path', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP;
        board[2][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[2][6] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[6][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[6][6] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;

        const bishopMoves = generateBishopMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP);

        expect(bishopMoves.length).toBe(8);
        expect(bishopMoves).toContain('22C');
        expect(bishopMoves).toContain('33M');
        expect(bishopMoves).toContain('55M');
        expect(bishopMoves).toContain('66C');
        expect(bishopMoves).toContain('26C');
        expect(bishopMoves).toContain('62C');
        expect(bishopMoves).toContain('53M');
        expect(bishopMoves).toContain('35M');
    });
});

describe('Tests the generateQueenMoves function', () => {
    it('Should generate all possible movements for a queen', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.QUEEN;

        const queenMoves = generateQueenMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.QUEEN);

        expect(queenMoves.length).toBe(27);
        expect(queenMoves).toContain('00M');
        expect(queenMoves).toContain('11M');
        expect(queenMoves).toContain('22M');
        expect(queenMoves).toContain('33M');
        expect(queenMoves).toContain('55M');
        expect(queenMoves).toContain('66M');
        expect(queenMoves).toContain('77M');
        expect(queenMoves).toContain('17M');
        expect(queenMoves).toContain('26M');
        expect(queenMoves).toContain('35M');
        expect(queenMoves).toContain('53M');
        expect(queenMoves).toContain('62M');
        expect(queenMoves).toContain('71M');
        expect(queenMoves).toContain('40M');
        expect(queenMoves).toContain('41M');
        expect(queenMoves).toContain('42M');
        expect(queenMoves).toContain('43M');
        expect(queenMoves).toContain('45M');
        expect(queenMoves).toContain('46M');
        expect(queenMoves).toContain('47M');
        expect(queenMoves).toContain('04M');
        expect(queenMoves).toContain('14M');
        expect(queenMoves).toContain('24M');
        expect(queenMoves).toContain('34M');
        expect(queenMoves).toContain('54M');
        expect(queenMoves).toContain('64M');
        expect(queenMoves).toContain('74M');
    });

    it('Should not generate moves for queens that are blocked by ally pieces', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.QUEEN;
        board[3][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[3][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[4][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][4] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[4][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[3][4] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;

        const queenMoves = generateQueenMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.QUEEN);

        expect(queenMoves.length).toBe(0);
    });

    it('Should generate captures for queens that have enemies in their path', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.QUEEN;
        board[2][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[2][6] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[6][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[6][6] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[4][6] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[6][4] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[4][2] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;
        board[2][4] = PIECE_COLORS.BLACK + PIECE_VALUES.PAWN;

        const queenMoves = generateQueenMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.QUEEN);

        expect(queenMoves.length).toBe(16);
        expect(queenMoves).toContain('22C');
        expect(queenMoves).toContain('33M');
        expect(queenMoves).toContain('55M');
        expect(queenMoves).toContain('66C');
        expect(queenMoves).toContain('26C');
        expect(queenMoves).toContain('62C');
        expect(queenMoves).toContain('53M');
        expect(queenMoves).toContain('35M');
        expect(queenMoves).toContain('46C');
        expect(queenMoves).toContain('64C');
        expect(queenMoves).toContain('42C');
        expect(queenMoves).toContain('24C');
        expect(queenMoves).toContain('45M');
        expect(queenMoves).toContain('43M');
        expect(queenMoves).toContain('54M');
        expect(queenMoves).toContain('34M');
    });
});

describe('Tests the generateKingMoves function', () => {
    it('Should generate all possible movements for a king', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.KING;

        const kingMoves = generateKingMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.KING);

        expect(kingMoves.length).toBe(8);
        expect(kingMoves).toContain('33M');
        expect(kingMoves).toContain('34M');
        expect(kingMoves).toContain('35M');
        expect(kingMoves).toContain('43M');
        expect(kingMoves).toContain('45M');
        expect(kingMoves).toContain('53M');
        expect(kingMoves).toContain('54M');
        expect(kingMoves).toContain('55M');
    });

    it('Should generate all possible horizontal and vertical captures for a king', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.KING;
        board[3][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[3][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[4][5] = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;
        board[5][4] = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;
        board[4][3] = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;
        board[3][4] = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;

        const kingMoves = generateKingMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.KING);

        expect(kingMoves.length).toBe(4);
        expect(kingMoves).toContain('34C');
        expect(kingMoves).toContain('43C');
        expect(kingMoves).toContain('45C');
        expect(kingMoves).toContain('54C');
    });

    it('Should generate all possible diagonal captures for a king', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.KING;
        board[3][3] = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;
        board[3][5] = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;
        board[5][3] = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;
        board[5][5] = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;
        board[4][5] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[5][4] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[4][3] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        board[3][4] = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;

        const kingMoves = generateKingMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.KING);

        expect(kingMoves.length).toBe(4);
        expect(kingMoves).toContain('33C');
        expect(kingMoves).toContain('35C');
        expect(kingMoves).toContain('53C');
        expect(kingMoves).toContain('55C');
    });

    it('Should not generate any moves for a king that are dangerous', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.KING;
        board[0][3] = PIECE_COLORS.BLACK + PIECE_VALUES.QUEEN;
        board[0][5] = PIECE_COLORS.BLACK + PIECE_VALUES.QUEEN;
        board[3][0] = PIECE_COLORS.BLACK + PIECE_VALUES.QUEEN;
        board[5][0] = PIECE_COLORS.BLACK + PIECE_VALUES.QUEEN;

        const kingMoves = generateKingMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.KING);

        expect(kingMoves.length).toBe(0);
    });

    it('Should not generate any captures for a king that are dangerous', () => {
        const board = createInitialBoard();
        board[4][4] = PIECE_COLORS.WHITE + PIECE_VALUES.KING;
        board[0][3] = PIECE_COLORS.BLACK + PIECE_VALUES.QUEEN;
        board[0][5] = PIECE_COLORS.BLACK + PIECE_VALUES.QUEEN;
        board[3][0] = PIECE_COLORS.BLACK + PIECE_VALUES.QUEEN;
        board[5][0] = PIECE_COLORS.BLACK + PIECE_VALUES.QUEEN;
        board[4][5] = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;
        board[5][4] = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;
        board[4][3] = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;
        board[3][4] = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;

        const kingMoves = generateKingMoves(board, [4, 4], PIECE_COLORS.WHITE + PIECE_VALUES.KING);

        expect(kingMoves.length).toBe(0);
    });
});
