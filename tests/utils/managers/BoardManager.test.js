import { jest } from '@jest/globals';
import { createActions, createBoard, createMessage, createPositions, createStarterMessage, createTestBoard } from '../../tools';

import { GAME_STATUS, GAME_VALIDATION_MESSAGES, PIECE_COLORS, PIECES } from "../../../src/utils/enum";
import BoardManager from "../../../src/utils/managers/BoardManager";
import { movePiece } from '../../../src/utils/game/board';

describe('Tests the getStatus method', () => {
    const setStatusFunc = jest.fn();
    const setMessageFunc = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('Should set the status as CHEAT if both moves are made by the same player', () => {
        const lastMove = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX,B,TTTT';
        const currMove = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX,B,TTTT';
        const manager = new BoardManager(lastMove, currMove, undefined, undefined, PIECE_COLORS.WHITE);

        manager.getStatus(setStatusFunc, setMessageFunc);

        expect(setStatusFunc).toHaveBeenCalledTimes(1);
        expect(setStatusFunc).toHaveBeenCalledWith(GAME_STATUS.CHEAT);
        expect(setMessageFunc).toHaveBeenCalledTimes(1);
        expect(setMessageFunc).toHaveBeenCalledWith(GAME_VALIDATION_MESSAGES.SAME_MESSAGE_COLOR);
    });

    it('Should set the status as CHEAT if castling is re-enabled', () => {
        const lastMove = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX,W,FFFF';
        const currMove = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX,B,TTTT';
        const manager = new BoardManager(lastMove, currMove, undefined, undefined, PIECE_COLORS.WHITE);

        manager.getStatus(setStatusFunc, setMessageFunc);

        expect(setStatusFunc).toHaveBeenCalledTimes(1);
        expect(setStatusFunc).toHaveBeenCalledWith(GAME_STATUS.CHEAT);
        expect(setMessageFunc).toHaveBeenCalledTimes(1);
        expect(setMessageFunc).toHaveBeenCalledWith(GAME_VALIDATION_MESSAGES.REENABLE_CASTLING);
    });

    describe('Tests different scenarios for statuses', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        })

        test('Scenario 1', () => {
            let board = createBoard();
            const turn1 = createStarterMessage();

            const turn2 = createMessage({
                [PIECES.WHITE_KNIGHT_1]: 'C3',
            }, 'W');
            const turn2Positions = createPositions({
                [PIECES.WHITE_KNIGHT_1]: 'C3',
            });

            const turn3 = createMessage({
                [PIECES.WHITE_KNIGHT_1]: 'C3',
                [PIECES.BLACK_PAWN_4]: 'D5',
            }, 'B')
            const turn3Positions = createPositions({
                [PIECES.WHITE_KNIGHT_1]: 'C3',
                [PIECES.BLACK_PAWN_4]: 'D5',
            });
            const turn3Actions = createActions(PIECE_COLORS.WHITE, {
                [PIECES.WHITE_KNIGHT_1]: ['B1M', 'A4M', 'E4M', 'B5M', 'D5C'],
                [PIECES.WHITE_KNIGHT_2]: ['F3M', 'H3M'],
                [PIECES.WHITE_PAWN_1]: ['A3M', 'A4M'],
                [PIECES.WHITE_PAWN_2]: ['B3M', 'B4M'],
                [PIECES.WHITE_PAWN_4]: ['D3M', 'D4M'],
                [PIECES.WHITE_PAWN_5]: ['E3M', 'E4M'],
                [PIECES.WHITE_PAWN_6]: ['F3M', 'F4M'],
                [PIECES.WHITE_PAWN_7]: ['G3M', 'G4M'],
                [PIECES.WHITE_PAWN_8]: ['H3M', 'H4M'],
                [PIECES.WHITE_ROOK_1]: ['B1M'],
            });

            const turn4 = createMessage({
                [PIECES.WHITE_KNIGHT_1]: 'D5',
                [PIECES.BLACK_PAWN_4]: 'XX',
            }, PIECE_COLORS.WHITE);
            const turn4Positions = createPositions({
                [PIECES.WHITE_KNIGHT_1]: 'D5',
                [PIECES.BLACK_PAWN_4]: 'XX',
            });

            const turn5 = createMessage({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'D5',
            }, PIECE_COLORS.BLACK);
            const turn5Positions = createPositions({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'D5',
            });
            const turn5Actions = createActions(PIECE_COLORS.WHITE, {
                [PIECES.WHITE_KNIGHT_2]: ['F3M', 'H3M'],
                [PIECES.WHITE_PAWN_1]: ['A3M', 'A4M'],
                [PIECES.WHITE_PAWN_2]: ['B3M', 'B4M'],
                [PIECES.WHITE_PAWN_3]: ['C3M', 'C4M'],
                [PIECES.WHITE_PAWN_4]: ['D3M', 'D4M'],
                [PIECES.WHITE_PAWN_5]: ['E3M', 'E4M'],
                [PIECES.WHITE_PAWN_6]: ['F3M', 'F4M'],
                [PIECES.WHITE_PAWN_7]: ['G3M', 'G4M'],
                [PIECES.WHITE_PAWN_8]: ['H3M', 'H4M'],
                [PIECES.WHITE_ROOK_1]: ['B1M'],
            });

            const turn6 = createMessage({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'D5',
                [PIECES.WHITE_KNIGHT_2]: 'F3',
            }, PIECE_COLORS.WHITE);
            const turn6Positions = createPositions({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'D5',
                [PIECES.WHITE_KNIGHT_2]: 'F3',
            });

            const turn7 = createMessage({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'F3',
                [PIECES.WHITE_KNIGHT_2]: 'XX',
            }, PIECE_COLORS.BLACK);
            const turn7Positions = createPositions({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'F3',
                [PIECES.WHITE_KNIGHT_2]: 'XX',
            });
            const turn7Actions = createActions(PIECE_COLORS.WHITE, {
                [PIECES.WHITE_PAWN_1]: ['A3M', 'A4M'],
                [PIECES.WHITE_PAWN_2]: ['B3M', 'B4M'],
                [PIECES.WHITE_PAWN_3]: ['C3M', 'C4M'],
                [PIECES.WHITE_PAWN_4]: ['D3M', 'D4M'],
                [PIECES.WHITE_PAWN_5]: ['E3M', 'E4M', 'F3C'],
                [PIECES.WHITE_PAWN_7]: ['G3M', 'G4M', 'F3C'],
                [PIECES.WHITE_PAWN_8]: ['H3M', 'H4M'],
                [PIECES.WHITE_ROOK_1]: ['B1M'],
                [PIECES.WHITE_ROOK_2]: ['G1M'],
            });

            const turn8 = createMessage({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'F3',
                [PIECES.WHITE_KNIGHT_2]: 'XX',
                [PIECES.WHITE_PAWN_5]: 'E4',
            }, PIECE_COLORS.WHITE);
            const turn8Positions = createPositions({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'F3',
                [PIECES.WHITE_KNIGHT_2]: 'XX',
                [PIECES.WHITE_PAWN_5]: 'E4',
            });

            const turn9 = createMessage({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'F2',
                [PIECES.WHITE_KNIGHT_2]: 'XX',
                [PIECES.WHITE_PAWN_5]: 'E4',
                [PIECES.WHITE_PAWN_6]: 'XX',
            }, PIECE_COLORS.BLACK);
            const turn9Positions = createPositions({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'F2',
                [PIECES.WHITE_KNIGHT_2]: 'XX',
                [PIECES.WHITE_PAWN_5]: 'E4',
                [PIECES.WHITE_PAWN_6]: 'XX',
            });
            const turn9Actions = createActions(PIECE_COLORS.WHITE, {
                [PIECES.WHITE_KING]: ['F2C'],
            });

            const turn10 = createMessage({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'XX',
                [PIECES.WHITE_KNIGHT_2]: 'XX',
                [PIECES.WHITE_PAWN_5]: 'E4',
                [PIECES.WHITE_PAWN_6]: 'XX',
                [PIECES.WHITE_KING]: 'F2',
            }, PIECE_COLORS.WHITE);
            const turn10Positions = createPositions({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'XX',
                [PIECES.WHITE_KNIGHT_2]: 'XX',
                [PIECES.WHITE_PAWN_5]: 'E4',
                [PIECES.WHITE_PAWN_6]: 'XX',
                [PIECES.WHITE_KING]: 'F2',
            });

            const turn11 = createMessage({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'XX',
                [PIECES.WHITE_KNIGHT_2]: 'XX',
                [PIECES.WHITE_PAWN_5]: 'E4',
                [PIECES.WHITE_PAWN_6]: 'XX',
                [PIECES.WHITE_KING]: 'F2',
                [PIECES.BLACK_PAWN_5]: 'E5'
            }, PIECE_COLORS.BLACK);
            const turn11Positions = createPositions({
                [PIECES.WHITE_KNIGHT_1]: 'XX',
                [PIECES.BLACK_PAWN_4]: 'XX',
                [PIECES.BLACK_QUEEN]: 'XX',
                [PIECES.WHITE_KNIGHT_2]: 'XX',
                [PIECES.WHITE_PAWN_5]: 'E4',
                [PIECES.WHITE_PAWN_6]: 'XX',
                [PIECES.WHITE_KING]: 'F2',
                [PIECES.BLACK_PAWN_5]: 'E5'
            });
            const turn11Actions = createActions(PIECE_COLORS.WHITE, {
                [PIECES.WHITE_PAWN_1]: ['A3M', 'A4M'],
                [PIECES.WHITE_PAWN_2]: ['B3M', 'B4M'],
                [PIECES.WHITE_PAWN_3]: ['C3M', 'C4M'],
                [PIECES.WHITE_PAWN_4]: ['D3M', 'D4M'],
                [PIECES.WHITE_PAWN_7]: ['G3M', 'G4M'],
                [PIECES.WHITE_PAWN_8]: ['H3M', 'H4M'],
                [PIECES.WHITE_ROOK_1]: ['B1M'],
                [PIECES.WHITE_ROOK_2]: ['G1M'],
                [PIECES.WHITE_KING]: ['E1M', 'G1M', 'E2M', 'E3M', 'F3M', 'G3M'],
                [PIECES.WHITE_QUEEN]: ['E1M', 'E2M', 'F3M', 'G4M', 'H5M'],
                [PIECES.WHITE_BISHOP_2]: ['E2M', 'D3M', 'C4M', 'B5M', 'A6M'],
            });

            const turnList = [
                turn1, turn2, turn3, turn4, turn5, turn6, turn7, turn8, turn9, turn10, turn11,
                createMessage({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                }, PIECE_COLORS.WHITE),
                createMessage({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'E7'
                }, PIECE_COLORS.BLACK),
                createMessage({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'E7',
                    [PIECES.WHITE_PAWN_4]: 'D4',
                }, PIECE_COLORS.WHITE),
                createMessage({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D4',
                }, PIECE_COLORS.BLACK),
                createMessage({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D4',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                }, PIECE_COLORS.WHITE, 'FFTT'),
                createMessage({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D4',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                }, PIECE_COLORS.BLACK, 'FFTT'),
                createMessage({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D5',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                }, PIECE_COLORS.WHITE, 'FFTT'),
                createMessage({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D5',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                    [PIECES.BLACK_KING]: 'G8',
                    [PIECES.BLACK_ROOK_2]: 'F8',
                }, PIECE_COLORS.BLACK, 'FFFF'),
                createMessage({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D6',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                    [PIECES.BLACK_KING]: 'G8',
                    [PIECES.BLACK_ROOK_2]: 'F8',
                }, PIECE_COLORS.WHITE, 'FFFF'),
                createMessage({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D6',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                    [PIECES.BLACK_KING]: 'G8',
                    [PIECES.BLACK_ROOK_2]: 'F8',
                    [PIECES.BLACK_PAWN_1]: 'A5',
                }, PIECE_COLORS.BLACK, 'FFFF'),
                createMessage({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D7',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                    [PIECES.BLACK_KING]: 'G8',
                    [PIECES.BLACK_ROOK_2]: 'F8',
                    [PIECES.BLACK_PAWN_1]: 'A5',
                }, PIECE_COLORS.WHITE, 'FFFF'),
                createMessage({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D7',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                    [PIECES.BLACK_KING]: 'H8',
                    [PIECES.BLACK_ROOK_2]: 'F8',
                    [PIECES.BLACK_PAWN_1]: 'A5',
                }, PIECE_COLORS.BLACK, 'FFFF'),
            ]
            const pawnRegistryList = [
                {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
            ]
            const positionsList = [
                createPositions(), turn2Positions, turn3Positions, turn4Positions, turn5Positions, 
                turn6Positions, turn7Positions, turn8Positions, turn9Positions, turn10Positions, 
                turn11Positions,
                createPositions({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                }),
                createPositions({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'E7'
                }),
                createPositions({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'E7',
                    [PIECES.WHITE_PAWN_4]: 'D4',
                }),
                createPositions({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D4',
                }),
                createPositions({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D4',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                }),
                createPositions({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D4',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                }),
                createPositions({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D5',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                }),
                createPositions({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D5',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                    [PIECES.BLACK_KING]: 'G8',
                    [PIECES.BLACK_ROOK_2]: 'F8',
                }),
                createPositions({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D6',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                    [PIECES.BLACK_KING]: 'G8',
                    [PIECES.BLACK_ROOK_2]: 'F8',
                }),
                createPositions({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D6',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                    [PIECES.BLACK_KING]: 'G8',
                    [PIECES.BLACK_ROOK_2]: 'F8',
                    [PIECES.BLACK_PAWN_1]: 'A5',
                }),
                createPositions({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D7',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                    [PIECES.BLACK_KING]: 'G8',
                    [PIECES.BLACK_ROOK_2]: 'F8',
                    [PIECES.BLACK_PAWN_1]: 'A5',
                }),
                createPositions({
                    [PIECES.WHITE_KNIGHT_1]: 'XX',
                    [PIECES.BLACK_PAWN_4]: 'XX',
                    [PIECES.BLACK_QUEEN]: 'XX',
                    [PIECES.WHITE_KNIGHT_2]: 'XX',
                    [PIECES.WHITE_PAWN_5]: 'E4',
                    [PIECES.WHITE_PAWN_6]: 'XX',
                    [PIECES.WHITE_KING]: 'F2',
                    [PIECES.BLACK_PAWN_5]: 'E5',
                    [PIECES.WHITE_BISHOP_2]: 'C4',
                    [PIECES.BLACK_BISHOP_2]: 'H4',
                    [PIECES.WHITE_PAWN_4]: 'D7',
                    [PIECES.WHITE_PAWN_7]: 'G3',
                    [PIECES.BLACK_KNIGHT_2]: 'H6',
                    [PIECES.BLACK_KING]: 'H8',
                    [PIECES.BLACK_ROOK_2]: 'F8',
                    [PIECES.BLACK_PAWN_1]: 'A5',
                }),
            ];
            const actionsList = [
                {}, {}, turn3Actions, {}, turn5Actions, {}, turn7Actions, {}, turn9Actions, {}, turn11Actions,
                {},
                createActions(PIECE_COLORS.WHITE, {
                    [PIECES.WHITE_PAWN_1]: ['A3M', 'A4M'],
                    [PIECES.WHITE_PAWN_2]: ['B3M', 'B4M'],
                    [PIECES.WHITE_PAWN_3]: ['C3M'],
                    [PIECES.WHITE_PAWN_4]: ['D3M', 'D4M'],
                    [PIECES.WHITE_PAWN_7]: ['G3M', 'G4M'],
                    [PIECES.WHITE_PAWN_8]: ['H3M', 'H4M'],
                    [PIECES.WHITE_ROOK_1]: ['B1M'],
                    [PIECES.WHITE_ROOK_2]: ['G1M', 'F1M', 'E1M'],
                    [PIECES.WHITE_KING]: ['E1M', 'F1M', 'G1M', 'E2M', 'E3M', 'F3M', 'G3M'],
                    [PIECES.WHITE_QUEEN]: ['E1M', 'F1M', 'G1M', 'E2M', 'F3M', 'G4M', 'H5M'],
                    [PIECES.WHITE_BISHOP_2]: ['D3M', 'E2M', 'F1M', 'D5M', 'E6M', 'F7C', 'B5M', 'A6M', 'B3M'],
                }),
                {},
                createActions(PIECE_COLORS.WHITE, {
                    [PIECES.WHITE_PAWN_7]: ['G3M'],
                    [PIECES.WHITE_KING]: ['F1M', 'G1M', 'E2M', 'E3M', 'F3M'],
                }),
                {},
                createActions(PIECE_COLORS.WHITE, {
                    [PIECES.WHITE_PAWN_1]: ['A3M', 'A4M'],
                    [PIECES.WHITE_PAWN_2]: ['B3M', 'B4M'],
                    [PIECES.WHITE_PAWN_3]: ['C3M'],
                    [PIECES.WHITE_PAWN_4]: ['D5M', 'E5C'],
                    [PIECES.WHITE_PAWN_7]: ['H4C'],
                    [PIECES.WHITE_PAWN_8]: ['H3M'],
                    [PIECES.WHITE_ROOK_1]: ['B1M'],
                    [PIECES.WHITE_ROOK_2]: ['G1M', 'F1M', 'E1M'],
                    [PIECES.WHITE_KING]: ['E1M', 'F1M', 'G1M', 'E2M', 'G2M', 'E3M', 'F3M'],
                    [PIECES.WHITE_QUEEN]: ['E1M', 'F1M', 'G1M', 'D2M', 'D3M', 'E2M', 'F3M', 'G4M', 'H5M'],
                    [PIECES.WHITE_BISHOP_2]: ['D3M', 'E2M', 'F1M', 'D5M', 'E6M', 'F7C', 'B5M', 'A6M', 'B3M'],
                    [PIECES.WHITE_BISHOP_1]: ['D2M', 'E3M', 'F4M', 'G5M', 'H6C'],
                }),
                {},
                createActions(PIECE_COLORS.WHITE, {
                    [PIECES.WHITE_PAWN_1]: ['A3M', 'A4M'],
                    [PIECES.WHITE_PAWN_2]: ['B3M', 'B4M'],
                    [PIECES.WHITE_PAWN_3]: ['C3M'],
                    [PIECES.WHITE_PAWN_4]: ['D6M'],
                    [PIECES.WHITE_PAWN_7]: ['H4C'],
                    [PIECES.WHITE_PAWN_8]: ['H3M'],
                    [PIECES.WHITE_ROOK_1]: ['B1M'],
                    [PIECES.WHITE_ROOK_2]: ['G1M', 'F1M', 'E1M'],
                    [PIECES.WHITE_KING]: ['E1M', 'F1M', 'G1M', 'E2M', 'G2M', 'E3M', 'F3M'],
                    [PIECES.WHITE_QUEEN]: ['E1M', 'F1M', 'G1M', 'D2M', 'D3M', 'D4M', 'E2M', 'F3M', 'G4M', 'H5M'],
                    [PIECES.WHITE_BISHOP_2]: ['D3M', 'E2M', 'F1M', 'B5M', 'A6M', 'B3M'],
                    [PIECES.WHITE_BISHOP_1]: ['D2M', 'E3M', 'F4M', 'G5M', 'H6C'],
                }),
                {},
                createActions(PIECE_COLORS.WHITE, {
                    [PIECES.WHITE_PAWN_1]: ['A3M', 'A4M'],
                    [PIECES.WHITE_PAWN_2]: ['B3M', 'B4M'],
                    [PIECES.WHITE_PAWN_3]: ['C3M'],
                    [PIECES.WHITE_PAWN_4]: ['D7M', 'C7C'],
                    [PIECES.WHITE_PAWN_7]: ['H4C'],
                    [PIECES.WHITE_PAWN_8]: ['H3M'],
                    [PIECES.WHITE_ROOK_1]: ['B1M'],
                    [PIECES.WHITE_ROOK_2]: ['G1M', 'F1M', 'E1M'],
                    [PIECES.WHITE_KING]: ['E1M', 'F1M', 'G1M', 'E2M', 'G2M', 'E3M', 'F3M'],
                    [PIECES.WHITE_QUEEN]: ['E1M', 'F1M', 'G1M', 'D2M', 'D3M', 'D4M', 'D5M', 'E2M', 'F3M', 'G4M', 'H5M'],
                    [PIECES.WHITE_BISHOP_2]: ['D3M', 'E2M', 'F1M', 'D5M', 'E6M', 'F7C', 'B5M', 'A6M', 'B3M'],
                    [PIECES.WHITE_BISHOP_1]: ['D2M', 'E3M', 'F4M', 'G5M', 'H6C'],
                }),
                {},
                createActions(PIECE_COLORS.WHITE, {
                    [PIECES.WHITE_PAWN_1]: ['A3M', 'A4M'],
                    [PIECES.WHITE_PAWN_2]: ['B3M', 'B4M'],
                    [PIECES.WHITE_PAWN_3]: ['C3M'],
                    [PIECES.WHITE_PAWN_4]: ['D8T', 'C8T'],
                    [PIECES.WHITE_PAWN_7]: ['H4C'],
                    [PIECES.WHITE_PAWN_8]: ['H3M'],
                    [PIECES.WHITE_ROOK_1]: ['B1M'],
                    [PIECES.WHITE_ROOK_2]: ['G1M', 'F1M', 'E1M'],
                    [PIECES.WHITE_KING]: ['E1M', 'F1M', 'G1M', 'E2M', 'G2M', 'E3M', 'F3M'],
                    [PIECES.WHITE_QUEEN]: ['E1M', 'F1M', 'G1M', 'D2M', 'D3M', 'D4M', 'D5M', 'D6M', 'E2M', 'F3M', 'G4M', 'H5M'],
                    [PIECES.WHITE_BISHOP_2]: ['D3M', 'E2M', 'F1M', 'D5M', 'E6M', 'F7C', 'B5M', 'A6M', 'B3M'],
                    [PIECES.WHITE_BISHOP_1]: ['D2M', 'E3M', 'F4M', 'G5M', 'H6C'],
                }),
            ];
            const movementList = [
                ['A1', 'A1'],
                ['B1', 'C3'],
                ['D7', 'D5'],
                ['C3', 'D5'],
                ['D8', 'D5'],
                ['G1', 'F3'],
                ['D5', 'F3'],
                ['E2', 'E4'],
                ['F3', 'F2'],
                ['E1', 'F2'],
                ['E7', 'E5'],
                ['F1', 'C4'],
                ['F8', 'E7'],
                ['D2', 'D4'],
                ['E7', 'H4'],
                ['G2', 'G3'],
                ['G8', 'H6'],
                ['D4', 'D5'],
                ['E8', 'G8', 'H8', 'F8'],
                ['D5', 'D6'],
                ['A7', 'A5'],
                ['D6', 'D7'],
                ['G8', 'H8'],
            ]

            turnList.forEach((turn, index) => {
                if (index === 0) {
                    return;
                }

                jest.clearAllMocks();
                const movement = movementList[index];
                if (movement.length === 4) {
                    board = movePiece(board, movement[0], movement[1]);
                    board = movePiece(board, movement[2], movement[3]);
                } else {
                    board = movePiece(board, movement[0], movement[1]);
                }
                
                const manager = new BoardManager(turnList[index - 1], turn, undefined, undefined, PIECE_COLORS.WHITE);
                manager.getStatus(setStatusFunc, setMessageFunc);

                const pawnRegistry = pawnRegistryList[index];
                const positions = positionsList[index];
                const actions = actionsList[index];
                const expectedNextTurn = index % 2 === 0 ? GAME_STATUS.WHITE_TURN : GAME_STATUS.BLACK_TURN;

                expect(setStatusFunc).toHaveBeenCalledTimes(1);
                expect(setStatusFunc).toHaveBeenCalledWith(expectedNextTurn);
                expect(manager.actions).toEqual(actions);
                expect(manager.pawnRegistry).toEqual(pawnRegistry);
                expect(manager.positions).toEqual(positions);
                expect(manager.board).toEqual(board);
            });
        });
    });
});