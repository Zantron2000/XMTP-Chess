import { PIECE_COLORS } from "../../../src/tools/enums";
import { GAME_VALIDATION_MESSAGES, MESSAGE } from "../../../src/utils/enum";
import { validateAction } from "../../../src/utils/game/action";
import { validateTurnContinuity } from "../../../src/utils/game/message";

const createMove = (board, player, canCastle) => {
    return [board, player, canCastle].join(MESSAGE.GAME_DELIMITER);
}

describe("Tests validateAction", () => {
    describe("Tests validateAction with a move action", () => {
        it('Should return an error if the player does not own the piece', async () => {
            const player = PIECE_COLORS.WHITE;
            const castled = false;
            const differences = {
                'BR1': ['A8', 'A7'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.error).toBeDefined();
            expect(result.error).toEqual(GAME_VALIDATION_MESSAGES.MOVE_OPPONENT_PIECE)
        });

        it('Should return the original location and the move action when valid', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = false;
            const differences = {
                'WP1': ['A2', 'A3'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.data).toBeDefined();
            expect(result.data).toEqual({
                action: 'A3M',
                piecePos: 'A2',
            })
        })

        it('Should take a processed move message, and return the original location and the move action when valid', () => {
            const lastMove = createMove('A1B1C1D1E1F1G1H1A2B2C2D2E2F2G2H2A8B8C8D8E8F8G8H8A7B7C7D7E7F7G7H7', PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.FALSE + MESSAGE.TRUE + MESSAGE.FALSE);
            const currMove = createMove('A1B1C1D1E1F1G1H1A3B2C2D2E2F2G2H2A8B8C8D8E8F8G8H8A7B7C7D7E7F7G7H7', PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.FALSE + MESSAGE.TRUE + MESSAGE.FALSE);

            const messageResults = validateTurnContinuity(lastMove, currMove);
            const actionResults = validateAction(messageResults.data);
            const expectedLastPos = {
                'WR1': 'A1', 'WN1': 'B1', 'WB1': 'C1', 'WQ': 'D1',
                'WK': 'E1', 'WB2': 'F1', 'WN2': 'G1', 'WR2': 'H1',
                'WP1': 'A2', 'WP2': 'B2', 'WP3': 'C2', 'WP4': 'D2',
                'WP5': 'E2', 'WP6': 'F2', 'WP7': 'G2', 'WP8': 'H2',
                'BR1': 'A8', 'BN1': 'B8', 'BB1': 'C8', 'BQ': 'D8',
                'BK': 'E8', 'BB2': 'F8', 'BN2': 'G8', 'BR2': 'H8',
                'BP1': 'A7', 'BP2': 'B7', 'BP3': 'C7', 'BP4': 'D7',
                'BP5': 'E7', 'BP6': 'F7', 'BP7': 'G7', 'BP8': 'H7',
            }
            const expectedCurrPos = {
                'WR1': 'A1', 'WN1': 'B1', 'WB1': 'C1', 'WQ': 'D1',
                'WK': 'E1', 'WB2': 'F1', 'WN2': 'G1', 'WR2': 'H1',
                'WP1': 'A3', 'WP2': 'B2', 'WP3': 'C2', 'WP4': 'D2',
                'WP5': 'E2', 'WP6': 'F2', 'WP7': 'G2', 'WP8': 'H2',
                'BR1': 'A8', 'BN1': 'B8', 'BB1': 'C8', 'BQ': 'D8',
                'BK': 'E8', 'BB2': 'F8', 'BN2': 'G8', 'BR2': 'H8',
                'BP1': 'A7', 'BP2': 'B7', 'BP3': 'C7', 'BP4': 'D7',
                'BP5': 'E7', 'BP6': 'F7', 'BP7': 'G7', 'BP8': 'H7',
            }

            expect(messageResults.data).toBeDefined();
            expect(messageResults.data).not.toBeNull();
            expect(messageResults.data.castled).toBe(false);
            expect(messageResults.data.player).toBe(PIECE_COLORS.WHITE);
            expect(Object.keys(messageResults.data.lastPositions).length).toBe(32);
            expect(Object.keys(messageResults.data.currPositions).length).toBe(32);
            expect(Object.keys(messageResults.data.differences).length).toBe(1);
            expect(messageResults.data.differences['WP1'][0]).toBe('A2');
            expect(messageResults.data.differences['WP1'][1]).toBe('A3');
            Object.keys(expectedLastPos).forEach((key) => {
                const expectedLast = expectedLastPos[key];
                const recievedLast = messageResults.data.lastPositions[key];

                expect(recievedLast).toBe(expectedLast);
            });
            Object.keys(expectedCurrPos).forEach((key) => {
                const expectedCurr = expectedCurrPos[key];
                const recievedCurr = messageResults.data.currPositions[key];

                expect(recievedCurr).toBe(expectedCurr);
            });

            expect(actionResults.data).toBeDefined();
            expect(actionResults.data).not.toBeNull();
            expect(actionResults.data).toEqual({
                action: 'A3M',
                piecePos: 'A2',
            });
        });

        it('Should take a processed move message, and return an error when the player moves a piece they do not own', () => {
            const lastMove = createMove('A1B1C1D1E1F1G1H1A2B2C2D2E2F2G2H2A8B8C8D8E8F8G8H8A7B7C7D7E7F7G7H7', PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.FALSE + MESSAGE.TRUE + MESSAGE.FALSE);
            const currMove = createMove('A1B1C1D1E1F1G1H1A3B2C2D2E2F2G2H2A8B8C8D8E8F8G8H8A7B7C7D7E7F7G7H7', PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.FALSE + MESSAGE.TRUE + MESSAGE.FALSE);

            const messageResults = validateTurnContinuity(lastMove, currMove);
            const actionResults = validateAction(messageResults.data);
            const expectedLastPos = {
                'WR1': 'A1', 'WN1': 'B1', 'WB1': 'C1', 'WQ': 'D1',
                'WK': 'E1', 'WB2': 'F1', 'WN2': 'G1', 'WR2': 'H1',
                'WP1': 'A2', 'WP2': 'B2', 'WP3': 'C2', 'WP4': 'D2',
                'WP5': 'E2', 'WP6': 'F2', 'WP7': 'G2', 'WP8': 'H2',
                'BR1': 'A8', 'BN1': 'B8', 'BB1': 'C8', 'BQ': 'D8',
                'BK': 'E8', 'BB2': 'F8', 'BN2': 'G8', 'BR2': 'H8',
                'BP1': 'A7', 'BP2': 'B7', 'BP3': 'C7', 'BP4': 'D7',
                'BP5': 'E7', 'BP6': 'F7', 'BP7': 'G7', 'BP8': 'H7',
            }
            const expectedCurrPos = {
                'WR1': 'A1', 'WN1': 'B1', 'WB1': 'C1', 'WQ': 'D1',
                'WK': 'E1', 'WB2': 'F1', 'WN2': 'G1', 'WR2': 'H1',
                'WP1': 'A3', 'WP2': 'B2', 'WP3': 'C2', 'WP4': 'D2',
                'WP5': 'E2', 'WP6': 'F2', 'WP7': 'G2', 'WP8': 'H2',
                'BR1': 'A8', 'BN1': 'B8', 'BB1': 'C8', 'BQ': 'D8',
                'BK': 'E8', 'BB2': 'F8', 'BN2': 'G8', 'BR2': 'H8',
                'BP1': 'A7', 'BP2': 'B7', 'BP3': 'C7', 'BP4': 'D7',
                'BP5': 'E7', 'BP6': 'F7', 'BP7': 'G7', 'BP8': 'H7',
            }

            expect(messageResults.data).toBeDefined();
            expect(messageResults.data).not.toBeNull();
            expect(messageResults.data.castled).toBe(false);
            expect(messageResults.data.player).toBe(PIECE_COLORS.BLACK);
            expect(Object.keys(messageResults.data.lastPositions).length).toBe(32);
            expect(Object.keys(messageResults.data.currPositions).length).toBe(32);
            expect(Object.keys(messageResults.data.differences).length).toBe(1);
            expect(messageResults.data.differences['WP1'][0]).toBe('A2');
            expect(messageResults.data.differences['WP1'][1]).toBe('A3');
            Object.keys(expectedLastPos).forEach((key) => {
                const expectedLast = expectedLastPos[key];
                const recievedLast = messageResults.data.lastPositions[key];

                expect(recievedLast).toBe(expectedLast);
            });
            Object.keys(expectedCurrPos).forEach((key) => {
                const expectedCurr = expectedCurrPos[key];
                const recievedCurr = messageResults.data.currPositions[key];

                expect(recievedCurr).toBe(expectedCurr);
            });

            expect(actionResults.error).toBeDefined();
            expect(actionResults.error).not.toBeNull();
            expect(actionResults.error).toEqual(GAME_VALIDATION_MESSAGES.MOVE_OPPONENT_PIECE);
        });
    });

    describe("Tests validateAction with a capture action", () => {
        it('Should return an error if the player does not own the capterer', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = false;
            const differences = {
                'BR1': ['A8', 'A7'],
                'BR2': ['B2', 'XX'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.error).toBeDefined();
            expect(result.error).toEqual(GAME_VALIDATION_MESSAGES.CAPTURE_WITH_OPPONENT_PIECE)
        })

        it('Should return an error if the player owns the captured', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = false;
            const differences = {
                'WR1': ['A8', 'A7'],
                'WR2': ['B2', 'XX'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.error).toBeDefined();
            expect(result.error).toEqual(GAME_VALIDATION_MESSAGES.CAPTURE_FRIENDLY_PIECE)
        })

        it('Should return an error if the capterer died', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = false;
            const differences = {
                'BR2': ['B2', 'XX'],
                'WR1': ['XX', 'B2'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.error).toBeDefined();
            expect(result.error).toEqual(GAME_VALIDATION_MESSAGES.CAPTURE_WITH_DEAD_PIECE)
        });

        it('Should generate the capterer starting location and actin when it is valid', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = false;
            const differences = {
                'BR2': ['B2', 'XX'],
                'WR1': ['A8', 'B2'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.data).toBeDefined();
            expect(result.data).toEqual({
                action: 'B2C',
                piecePos: 'A8',
            })
        })

        it('Should generate the capterer starting location and actin when it is valid against a transformed pawn', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = false;
            const differences = {
                'BP2': ['QB2', 'XX'],
                'WR1': ['A8', 'B2'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.data).toBeDefined();
            expect(result.data).toEqual({
                action: 'B2C',
                piecePos: 'A8',
            })
        })

        it('Should generate a capture action from a capture message', () => {
            const lastMove = createMove('A1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXA7XXXXXXXXXXXXXX', PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.TRUE + MESSAGE.TRUE + MESSAGE.TRUE);
            const currMove = createMove('A7XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.TRUE + MESSAGE.TRUE + MESSAGE.TRUE);

            const messageResults = validateTurnContinuity(lastMove, currMove);
            const actionResults = validateAction(messageResults.data);

            expect(actionResults.data).toBeDefined();
            expect(actionResults.data).toEqual({
                action: 'A7C',
                piecePos: 'A1',
            })
        })
    });

    describe("Tests validateAction with a transform action", () => {
        it('Should generate the right moves when a pawn is transformed', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = false;
            const differences = {
                'WP1': ['A7', 'QA8'],
            }
            const transformed = true;

            const result = validateAction({ player, castled, differences, transformed });

            expect(result.data).toBeDefined();
            expect(result.data).toEqual({
                action: 'A8T',
                piecePos: 'A7',
            })
        })

        it('Should generate an error if the player does not own the pawn', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = false;
            const differences = {
                'BP1': ['A7', 'A8'],
            }
            const transformed = true;

            const result = validateAction({ player, castled, differences, transformed });

            expect(result.error).toBeDefined();
            expect(result.error).toEqual(GAME_VALIDATION_MESSAGES.OPPONENT_TRANSFORM)
        })

        it('Should generate a transform action from a message', () => {
            const lastMove = createMove('XXXXXXXXXXXXXXXXA7QB2QC2QD2QE2QF2QG2QH2XXXXXXXXXXXXXXXXQA1QB1QC1QD1QE1QF1QG1QH1', PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.TRUE + MESSAGE.TRUE + MESSAGE.TRUE);
            const currMove = createMove('XXXXXXXXXXXXXXXXQA8QB2QC2QD2QE2QF2QG2QH2XXXXXXXXXXXXXXXXQA1QB1QC1QD1QE1QF1QG1QH1', PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.TRUE + MESSAGE.TRUE + MESSAGE.TRUE);

            const messageResults = validateTurnContinuity(lastMove, currMove);
            const actionResults = validateAction(messageResults.data);

            expect(actionResults.data).toBeDefined();
            expect(actionResults.data).toEqual({
                action: 'A8T',
                piecePos: 'A7',
            })
        });
    });

    describe("Tests validateAction with a castle action", () => {
        it('Should generate the right moves when a castle is made', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = true;
            const differences = {
                'WK': ['E1', 'G1'],
                'WR2': ['H1', 'F1'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.data).toBeDefined();
            expect(result.data).toEqual({
                action: 'G1S',
                piecePos: 'E1',
            })
        })

        it('Should generate an error if the player does not own the king', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = true;
            const differences = {
                'WB2': ['E1', 'G1'],
                'WR2': ['H1', 'F1'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.error).toBeDefined();
            expect(result.error).toEqual(GAME_VALIDATION_MESSAGES.CASTLED_NON_KING)
        })

        it('Should generate an error if the player does not own the rook', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = true;
            const differences = {
                'WK': ['E1', 'G1'],
                'WB2': ['H1', 'F1'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.error).toBeDefined();
            expect(result.error).toEqual(GAME_VALIDATION_MESSAGES.CASTLED_NON_ROOK)
        })

        it('Should generate an error if the player does not own the king or rook', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = true;
            const differences = {
                'BK': ['E1', 'G1'],
                'BR2': ['H1', 'F1'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.error).toBeDefined();
            expect(result.error).toEqual(GAME_VALIDATION_MESSAGES.CASTLED_ENEMY_PIECE)
        })

        it('Should generate an error if the king is dead', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = true;
            const differences = {
                'WK': ['XX', 'G1'],
                'WR2': ['H1', 'F1'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.error).toBeDefined();
            expect(result.error).toEqual(GAME_VALIDATION_MESSAGES.CASTLED_DEAD_PIECE)
        })

        it('Should generate an error if the rook is dead', () => {
            const player = PIECE_COLORS.WHITE;
            const castled = true;
            const differences = {
                'WK': ['E1', 'G1'],
                'WR2': ['XX', 'F1'],
            }

            const result = validateAction({ player, castled, differences });

            expect(result.error).toBeDefined();
            expect(result.error).toEqual(GAME_VALIDATION_MESSAGES.CASTLED_DEAD_PIECE)
        });

        it('Should generate a castle action from a message', () => {
            const lastMove = createMove('A1XXXXXXE1XXXXXXA7QB2QC2QD2QE2QF2QG2QH2XXXXXXXXXXXXXXXXQA1QB1QC1QD1QE1QF1QG1QH1', PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.TRUE + MESSAGE.TRUE + MESSAGE.TRUE);
            const currMove = createMove('D1XXXXXXC1XXXXXXA7QB2QC2QD2QE2QF2QG2QH2XXXXXXXXXXXXXXXXQA1QB1QC1QD1QE1QF1QG1QH1', PIECE_COLORS.WHITE, MESSAGE.FALSE + MESSAGE.TRUE + MESSAGE.TRUE + MESSAGE.TRUE);

            const messageResults = validateTurnContinuity(lastMove, currMove);
            const actionResults = validateAction(messageResults.data);

            expect(actionResults.data).toBeDefined();
            expect(actionResults.data).toEqual({
                action: 'C1S',
                piecePos: 'E1',
            })
        });
    });
});
