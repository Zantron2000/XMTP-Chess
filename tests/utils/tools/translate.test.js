import { PIECE_COLORS, PIECE_ORDER, PIECE_POSITIONS, PIECE_VALUES } from "../../../src/tools/enums";

import {
    translateMessageBoard,
    createMessageBoard,
    validateBoardMessage,
    validateLastMoveMessage,
} from "../../../src/tools/tools/translate";

const createValidMoveMessage = () => 'A1B2C3D4XXXXXXXX'.repeat(4);

describe('Test thevalidateBoardMessage function', () => {
    it('Should return false if the hash is not 5 characters long', () => {
        const message = `123456-${createValidMoveMessage()}`;

        const result = validateBoardMessage(message);

        expect(result).toBe(false);
    });

    it('Should return false if the hash is not alphanumeric', () => {
        const message = `$$&*^-${createValidMoveMessage()}`;

        const result = validateBoardMessage(message);

        expect(result).toBe(false);
    });

    it('Should return false if the board is not 64 characters long', () => {
        const message = `12345-${createValidMoveMessage()}1`;

        const result = validateBoardMessage(message);

        expect(result).toBe(false);
    });

    it('Should return false if a dead piece uses a letter other than X', () => {
        const message = `12345-${createValidMoveMessage().replace('X', 'Y')}`;

        const result = validateBoardMessage(message);

        expect(result).toBe(false);
    });

    it('Should return false if a piece has a letter other than A-H', () => {
        const message = `12345-${createValidMoveMessage().replace('A', 'I')}`;

        const result = validateBoardMessage(message);

        expect(result).toBe(false);
    });

    it('Should return false if a piece has a number other than 1-8', () => {
        const message = `12345-${createValidMoveMessage().replace('1', '0')}`;

        const result = validateBoardMessage(message);

        expect(result).toBe(false);
    });

    it('Should return true if the message is valid', () => {
        const message = `12345-${createValidMoveMessage()}`;

        const result = validateBoardMessage(message);

        expect(result).toBe(true);
    });
});

describe('Tests the translateMessageBoard function', () => {
    it('Should translate an empty board message to an empty board', () => {
        const message = `12345-${'XX'.repeat(64)}`;
        const empty = PIECE_VALUES.EMPTY;

        const result = translateMessageBoard(message);

        expect(result).toEqual([
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
        ]);
    });

    it('Should translate a board message to a board', () => {
        const message = `12345-A1B1C1D1E1F1G1H1A2B2C2D2E2F2G2H2A3B3C3D3E3F3G3H3A4B4C4D4E4F4G4H4`;

        const result = translateMessageBoard(message);

        result.forEach((row, rowIndex) => {
            row.forEach((piece, colIndex) => {
                const expectedPiece = Object.entries(PIECE_ORDER).reduce((acc, [piece, index]) => {
                    if (acc) return acc;

                    if (index === rowIndex * 8 + colIndex) return piece;
                }, undefined) || PIECE_VALUES.EMPTY;

                expect(piece).toBe(expectedPiece);
            });
        });
    });
});


describe('Tests the createMessageBoard function', () => {
    it('Should create an empty board message', () => {
        const empty = PIECE_VALUES.EMPTY;
        const emptyBoard = [
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty],
        ];

        const result = createMessageBoard('12345', emptyBoard);

        expect(result).toBe(`12345-${'XX'.repeat(32)}`);
    });

    it('Should create a message with pieces in their place', () => {
        const empty = PIECE_VALUES.EMPTY;
        const fullBoard = [
            [PIECE_COLORS.WHITE + PIECE_VALUES.KING, empty, empty, empty, empty, empty, empty, empty],
            [empty, PIECE_COLORS.WHITE + PIECE_VALUES.QUEEN, empty, empty, empty, empty, empty, empty],
            [empty, empty, PIECE_COLORS.WHITE + PIECE_VALUES.ROOK + '1', empty, empty, empty, empty, empty],
            [empty, empty, empty, PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP + '1', empty, empty, empty, empty],
            [empty, empty, empty, empty, PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT + '1', empty, empty, empty],
            [empty, empty, empty, empty, empty, PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '2', empty, empty],
            [empty, empty, empty, empty, empty, empty, PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1', empty],
            [empty, empty, empty, empty, empty, empty, empty, PIECE_COLORS.BLACK + PIECE_VALUES.KING],
        ];

        const result = createMessageBoard('12345', fullBoard);

        const boardString = result.split('-')[1];
        const wkIndex = PIECE_ORDER[PIECE_COLORS.WHITE + PIECE_VALUES.KING];
        const wqIndex = PIECE_ORDER[PIECE_COLORS.WHITE + PIECE_VALUES.QUEEN];
        const wrIndex = PIECE_ORDER[PIECE_COLORS.WHITE + PIECE_VALUES.ROOK + '1'];
        const wbIndex = PIECE_ORDER[PIECE_COLORS.WHITE + PIECE_VALUES.BISHOP + '1'];
        const wnIndex = PIECE_ORDER[PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT + '1'];
        const wpIndex = PIECE_ORDER[PIECE_COLORS.WHITE + PIECE_VALUES.PAWN + '2'];
        const bpIndex = PIECE_ORDER[PIECE_COLORS.BLACK + PIECE_VALUES.PAWN + '1'];
        const bkIndex = PIECE_ORDER[PIECE_COLORS.BLACK + PIECE_VALUES.KING];

        expect(boardString.substring(wkIndex * 2, wkIndex * 2 + 2)).toBe('A1');
        expect(boardString.substring(wqIndex * 2, wqIndex * 2 + 2)).toBe('B2');
        expect(boardString.substring(wrIndex * 2, wrIndex * 2 + 2)).toBe('C3');
        expect(boardString.substring(wbIndex * 2, wbIndex * 2 + 2)).toBe('D4');
        expect(boardString.substring(wnIndex * 2, wnIndex * 2 + 2)).toBe('E5');
        expect(boardString.substring(wpIndex * 2, wpIndex * 2 + 2)).toBe('F6');
        expect(boardString.substring(bpIndex * 2, bpIndex * 2 + 2)).toBe('G7');
        expect(boardString.substring(bkIndex * 2, bkIndex * 2 + 2)).toBe('H8');
    });
});

describe('Tests the validateLastMoveMessage function', () => {
    it('Should fail if no move was made', () => {
        const lastEnemyMove = `12345-${'XX'.repeat(32)}`;
        const lastUserMove = `12345-${'XX'.repeat(32)}`;

        const result = validateLastMoveMessage(lastEnemyMove, lastUserMove);

        expect(result).toBe(undefined);
    });

    it('Should fail if two moves were made', () => {
        const lastEnemyMove = `12345-${'XX'.repeat(30)}1122`;
        const lastUserMove = `12345-${'XX'.repeat(32)}`;

        const result = validateLastMoveMessage(lastEnemyMove, lastUserMove);

        expect(result).toBe(undefined);
    });

    it('Should fail if the enemy moved their opponent\'s piece', () => {
        const lastEnemyMove = `12345-${'XX'.repeat(30)}1133`;
        const lastUserMove = `12345-${'XX'.repeat(30)}1122`;

        const result = validateLastMoveMessage(lastEnemyMove, lastUserMove, PIECE_COLORS.BLACK);

        expect(result).toBe(undefined);
    });
});
