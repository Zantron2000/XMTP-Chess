import {
    extractMoveDetails,
    canCastle,
    getNextTurn,
    isOpponentMove,
    isPlayerMove,
    validateTurnContinuity,
} from '../../../src/utils/game/message';
import { MESSAGE, PIECE_COLORS, GAME_STATUS, GAME_VALIDATION_MESSAGES } from '../../../src/utils/enum';

const generateBasicBoard = () => {
    return 'XX'.repeat(32);
}

const createBasicMove = () => {
    const board = generateBasicBoard();
    const player = PIECE_COLORS.WHITE;
    const canCastle = MESSAGE.TRUE + MESSAGE.FALSE;

    return [board, player, canCastle].join(MESSAGE.GAME_DELIMITER);
}

const createMove = (board, player, canCastle) => {
    return [board, player, canCastle].join(MESSAGE.GAME_DELIMITER);
}

describe('Tests extractMoveDetails', () => {
    it('Should extract the board, player, and canCastle from a move', () => {
        const move = createBasicMove();

        const details = extractMoveDetails(move);

        expect(details.board).toBe(generateBasicBoard());
        expect(details.player).toBe(PIECE_COLORS.WHITE);
        expect(details.canCastle).toEqual([true, false]);
    });

    it('Should mark invalid canCastle values as undefined', () => {
        const move = createMove('abcdefg', PIECE_COLORS.WHITE, 'XX');

        const details = extractMoveDetails(move);

        expect(details.canCastle).toEqual([undefined, undefined]);
    });

    it('Should mark unprovided canCastle values as undefined', () => {
        const move = createMove('abcdefg', PIECE_COLORS.WHITE, '');

        const details = extractMoveDetails(move);

        expect(details.canCastle).toEqual([undefined, undefined]);
    });
});

describe('Tests canCastle', () => {
    it('Should return true if the player can castle', () => {
        const move = createBasicMove();

        const castle = canCastle(move, PIECE_COLORS.WHITE);

        expect(castle).toBe(true);
    });

    it('Should return false if the player cannot castle', () => {
        const move = createBasicMove();

        const castle = canCastle(move, PIECE_COLORS.BLACK);

        expect(castle).toBe(false);
    });
})

describe('Tests getNextTurn', () => {
    it('Should return the next turn', () => {
        const move = createBasicMove();

        const nextTurn = getNextTurn(move);

        expect(nextTurn).toBe(GAME_STATUS.BLACK_TURN);
    });

    it('Should return the next turn', () => {
        const move = createMove('abcdefg', PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.TRUE);

        const nextTurn = getNextTurn(move);

        expect(nextTurn).toBe(GAME_STATUS.WHITE_TURN);
    });
});

describe('Tests isPlayerMove', () => {
    it('Should return true if the move was made by the player', () => {
        const move = createBasicMove();

        const isMove = isPlayerMove(move, PIECE_COLORS.WHITE);

        expect(isMove).toBe(true);
    });

    it('Should return false if the move was not made by the player', () => {
        const move = createBasicMove();

        const isMove = isPlayerMove(move, PIECE_COLORS.BLACK);

        expect(isMove).toBe(false);
    });
});

describe('Tests isOpponentMove', () => {
    it('Should return true if the move was made by the opponent', () => {
        const move = createBasicMove();

        const isMove = isOpponentMove(move, PIECE_COLORS.BLACK);

        expect(isMove).toBe(true);
    });

    it('Should return false if the move was not made by the opponent', () => {
        const move = createBasicMove();

        const isMove = isOpponentMove(move, PIECE_COLORS.WHITE);

        expect(isMove).toBe(false);
    });
});

describe('Tests validateTurnContinuity', () => {
    it('Should return an error about no player being provided for the last move', () => {
        const lastMove = createMove('abc', '', MESSAGE.TRUE + MESSAGE.FALSE);
        const currentMove = createMove('def', PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.FALSE);

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.INVALID_MESSAGE });
    });

    it('Should return an error about no player being provided for the current move', () => {
        const lastMove = createMove('abc', PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.FALSE);
        const currentMove = createMove('def', '', MESSAGE.TRUE + MESSAGE.FALSE);

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.INVALID_MESSAGE });
    });

    it('Should return an error about the castle status not being provided for the last move', () => {
        const lastMove = createMove('abc', PIECE_COLORS.WHITE, '');
        const currentMove = createMove('def', PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.FALSE);

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.INVALID_MESSAGE });
    })

    it('Should return an error about the castle status not being provided for the current move', () => {
        const lastMove = createMove('abc', PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.FALSE);
        const currentMove = createMove('def', PIECE_COLORS.BLACK, '');

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.INVALID_MESSAGE });
    });

    it('Should return an error about no board being provided for the last move', () => {
        const lastMove = createMove('', PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.FALSE);
        const currentMove = createMove('def', PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.FALSE);

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.INVALID_MESSAGE });
    });

    it('Should return an error about no board being provided for the current move', () => {
        const lastMove = createMove('abc', PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.FALSE);
        const currentMove = createMove('', PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.FALSE);

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.INVALID_MESSAGE });
    });

    it('Should return an error for the board being less than 64 characters', () => {
        const lastMove = createBasicMove();
        const currentMove = createMove('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'W', 'TT');

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.INVALID_BOARD });
    });

    it('Should return an error for the board giving a rook 3 characters', () => {
        const lastMove = createBasicMove();
        const currentMove = createMove('RXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'W', 'TT');

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.INVALID_BOARD });
    })

    it('Should return an error for the board being greater than 80 characters', () => {
        const lastMove = createBasicMove();
        const currentMove = createMove('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'W', 'TT');

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.INVALID_BOARD });
    });

    it('Should return an error for the board using invalid characters', () => {
        const lastMove = createBasicMove();
        const currentMove = createMove('ZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'W', 'TT');

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.INVALID_BOARD });
    })

    it('Should return an error for both moves signed by the same player color', () => {
        const lastMove = createMove('X'.repeat(64), PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.FALSE);
        const currentMove = createMove('X'.repeat(64), PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.FALSE);

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.DOUBLE_MOVE, PIECE_COLORS.WHITE) });
    })

    it('Should return an error if the castle is re-enabled for a player', () => {
        const lastMove = createMove('X'.repeat(64), PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.FALSE);
        const currentMove = createMove('X'.repeat(64), PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.TRUE);

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.REENABLE_CASTLING, PIECE_COLORS.BLACK) });
    })

    it('Should return an error for having no difference between the moves', () => {
        const lastMove = createMove('X'.repeat(64), PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.FALSE);
        const currentMove = createMove('X'.repeat(64), PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.FALSE);

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.NO_MOVE, PIECE_COLORS.BLACK) });
    })

    it('Should return an error for having too many differences between the moves', () => {
        const lastMove = createMove('A1B2C3D4'.repeat(8), PIECE_COLORS.WHITE, MESSAGE.TRUE + MESSAGE.FALSE);
        const currentMove = createMove('C3D4A1B2'.repeat(8), PIECE_COLORS.BLACK, MESSAGE.TRUE + MESSAGE.FALSE);

        const error = validateTurnContinuity(lastMove, currentMove);

        expect(error).toEqual({ error: GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.MULTI_ACTION, PIECE_COLORS.BLACK) });
    })
});