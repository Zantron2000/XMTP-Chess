import { PIECE_COLORS, PIECE_VALUES } from "../../../src/tools/enums";
import BoardManager from "../../../src/tools/managers/BoardManager";

describe("Tests the getPieceAt method", () => {
    it('Should return the piece at the given position', () => {
        const board = [
            [null, null, null],
            [null, 'abc', null],
            [null, null, null]
        ];
        const boardManager = new BoardManager(board, 'white');
        const piece = boardManager.getPieceAt(1, 1);

        expect(piece).toBe('abc');
    });

    it('Should return null if the given position is out of bounds', () => {
        const board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        const boardManager = new BoardManager(board, 'white');
        const piece = boardManager.getPieceAt(3, 3);

        expect(piece).toBe(null);
    });
});

describe("Tests the generateMovesForPieceAt method", () => {
    it('Should return the moves for the piece at the given position', () => {
        const board = [
            [null, null, null],
            [null, PIECE_COLORS.WHITE + PIECE_VALUES.KING, null],
            [null, null, null],
        ];
        const boardManager = new BoardManager(board, PIECE_COLORS.WHITE);

        const moves = boardManager.generateMovesForPieceAt([1, 1]);

        expect(moves.length).toBe(8);
        expect(moves).toContain('00M');
        expect(moves).toContain('01M');
        expect(moves).toContain('02M');
        expect(moves).toContain('10M');
        expect(moves).toContain('12M');
        expect(moves).toContain('20M');
        expect(moves).toContain('21M');
        expect(moves).toContain('22M');
    });

    it('Should not generate any moves for a stuck piece', () => {
        const board = [
            [null, null, null],
            [null, PIECE_COLORS.WHITE + PIECE_VALUES.KNIGHT, null],
            [null, null, null],
        ];
        const boardManager = new BoardManager(board, PIECE_COLORS.WHITE);

        const moves = boardManager.generateMovesForPieceAt([0, 0]);

        expect(moves.length).toBe(0);
    });

    it('Should not generate any moves for a piece out of range', () => {
        const board = [
            [null, null, null],
            [null, PIECE_COLORS.WHITE + PIECE_VALUES.KING, null],
            [null, null, null],
        ];
        const boardManager = new BoardManager(board, PIECE_COLORS.WHITE);

        const moves = boardManager.generateMovesForPieceAt([3, 3]);

        expect(moves.length).toBe(0);
    })
});

describe("Tests the isActivePiece method", () => {
    it('Should return true if the given position is the selected piece', () => {
        const boardManager = new BoardManager([], PIECE_COLORS.WHITE, [1, 1]);

        expect(boardManager.isActivePiece([1, 1])).toBe(true);
    });

    it('Should return false if the given position is not the selected piece', () => {
        const boardManager = new BoardManager([], PIECE_COLORS.WHITE, [1, 1]);

        expect(boardManager.isActivePiece([0, 0])).toBe(false);
    });
});

describe("Tests the findAction method", () => {
    it('Should return the action if it exists', () => {
        const boardManager = new BoardManager([], PIECE_COLORS.WHITE, [], ['12M']);

        expect(boardManager.findAction([1, 2])).toBe('12M');
    });

    it('Should return undefined if the action does not exist', () => {
        const boardManager = new BoardManager([], PIECE_COLORS.WHITE, [], ['13M']);

        expect(boardManager.findAction([0, 0])).toBe(undefined);
    });
});

