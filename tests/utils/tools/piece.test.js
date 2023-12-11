import {
    isKing, isAlly, isBishop, isBlack, isEnemy, isIdentical,
    isKnight, isMatchingPiece, isPawn, isQueen, isRook, isWhite,
} from "../../../src/tools/tools/piece";
import { PIECE_COLORS, PIECE_VALUES } from "../../../src/tools/enums";

describe('Tests the isKing function', () => {
    it('Should return true only if the piece is a king', () => {
        Object.entries(PIECE_VALUES).forEach(([key, value]) => {
            const piece = PIECE_COLORS.WHITE + value;
            const result = isKing(piece);

            if (key === 'KING') {
                expect(result).toBe(true);
            } else {
                expect(result).toBe(false);
            }
        });
    });
});

describe('Tests the isBishop function', () => {
    it('Should return true only if the piece is a bishop', () => {
        Object.entries(PIECE_VALUES).forEach(([key, value]) => {
            const piece = PIECE_COLORS.WHITE + value;
            const result = isBishop(piece);

            if (key === 'BISHOP') {
                expect(result).toBe(true);
            } else {
                expect(result).toBe(false);
            }
        });
    });
});

describe('Tests the isKnight function', () => {
    it('Should return true only if the piece is a knight', () => {
        Object.entries(PIECE_VALUES).forEach(([key, value]) => {
            const piece = PIECE_COLORS.WHITE + value;
            const result = isKnight(piece);

            if (key === 'KNIGHT') {
                expect(result).toBe(true);
            } else {
                expect(result).toBe(false);
            }
        });
    });
});

describe('Tests the isPawn function', () => {
    it('Should return true only if the piece is a pawn', () => {
        Object.entries(PIECE_VALUES).forEach(([key, value]) => {
            const piece = PIECE_COLORS.WHITE + value;
            const result = isPawn(piece);

            if (key === 'PAWN') {
                expect(result).toBe(true);
            } else {
                expect(result).toBe(false);
            }
        });
    });
});

describe('Tests the isQueen function', () => {
    it('Should return true only if the piece is a queen', () => {
        Object.entries(PIECE_VALUES).forEach(([key, value]) => {
            const piece = PIECE_COLORS.WHITE + value;
            const result = isQueen(piece);

            if (key === 'QUEEN') {
                expect(result).toBe(true);
            } else {
                expect(result).toBe(false);
            }
        });
    });
});

describe('Tests the isRook function', () => {
    it('Should return true only if the piece is a rook', () => {
        Object.entries(PIECE_VALUES).forEach(([key, value]) => {
            const piece = PIECE_COLORS.WHITE + value;
            const result = isRook(piece);

            if (key === 'ROOK') {
                expect(result).toBe(true);
            } else {
                expect(result).toBe(false);
            }
        });
    });
});

describe('Tests the isWhite function', () => {
    it('Should return true only if the piece is white', () => {
        Object.entries(PIECE_COLORS).forEach(([key, value]) => {
            const piece = value + PIECE_VALUES.PAWN;
            const result = isWhite(piece);

            if (key === 'WHITE') {
                expect(result).toBe(true);
            } else {
                expect(result).toBe(false);
            }
        });
    });
});

describe('Tests the isBlack function', () => {
    it('Should return true only if the piece is black', () => {
        Object.entries(PIECE_COLORS).forEach(([key, value]) => {
            const piece = value + PIECE_VALUES.PAWN;
            const result = isBlack(piece);

            if (key === 'BLACK') {
                expect(result).toBe(true);
            } else {
                expect(result).toBe(false);
            }
        });
    });
});

describe('Tests the isAlly function', () => {
    it('Should return true only if the pieces are the same color', () => {
        Object.entries(PIECE_COLORS).forEach(([key, value]) => {
            const piece1 = value + PIECE_VALUES.PAWN;
            const piece2 = value + PIECE_VALUES.KNIGHT;
            const result = isAlly(piece1, piece2);

            expect(result).toBe(true);
        });
    });

    it('Should return false only if the pieces are different colors', () => {
        const piece1 = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        const piece2 = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;
        const result = isAlly(piece1, piece2);

        expect(result).toBe(false);
    });
});

describe('Tests the isEnemy function', () => {
    it('Should return true only if the pieces are different colors', () => {
        const piece1 = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;
        const piece2 = PIECE_COLORS.BLACK + PIECE_VALUES.KNIGHT;
        const result = isEnemy(piece1, piece2);

        expect(result).toBe(true);
    });

    it('Should return false only if the pieces are the same color', () => {
        Object.entries(PIECE_COLORS).forEach(([key, value]) => {
            const piece1 = value + PIECE_VALUES.PAWN;
            const piece2 = value + PIECE_VALUES.KNIGHT;
            const result = isEnemy(piece1, piece2);

            expect(result).toBe(false);
        });
    });
});

describe('Tests the isIdentical function', () => {
    it('Should return true only if the pieces are the same', () => {
        Object.entries(PIECE_VALUES).forEach(([key, value]) => {
            const piece1 = PIECE_COLORS.WHITE + value;
            const piece2 = PIECE_COLORS.WHITE + value;
            const result = isIdentical(piece1, piece2);

            expect(result).toBe(true);
        });
    });

    it('Should return false only if the pieces are different', () => {
        Object.entries(PIECE_VALUES).forEach(([key1, value1]) => {
            Object.entries(PIECE_VALUES).forEach(([key2, value2]) => {
                if (key1 !== key2) {
                    const piece1 = PIECE_COLORS.WHITE + value1;
                    const piece2 = PIECE_COLORS.WHITE + value2;
                    const result = isIdentical(piece1, piece2);

                    expect(result).toBe(false);
                }
            });
        });
    });
});

describe('Tests the isMatchingPiece function', () => {
    it('Should return true only if the piece is one of the provided pieces', () => {
        const piece = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;

        const result = isMatchingPiece(piece, PIECE_VALUES.PAWN, PIECE_VALUES.KNIGHT, PIECE_VALUES.BISHOP, PIECE_VALUES.ROOK, PIECE_VALUES.QUEEN, PIECE_VALUES.KING);

        expect(result).toBe(true);
    });

    it('Should return false only if the piece is not one of the provided pieces', () => {
        const piece = PIECE_COLORS.WHITE + PIECE_VALUES.PAWN;

        const result = isMatchingPiece(piece, PIECE_VALUES.KNIGHT, PIECE_VALUES.BISHOP, PIECE_VALUES.ROOK, PIECE_VALUES.QUEEN, PIECE_VALUES.KING);

        expect(result).toBe(false);
    });
});
