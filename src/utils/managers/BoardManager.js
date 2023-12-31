import { ACTION_TYPES, BOARD_COL_LABELS, BOARD_ROW_LABELS } from "../../tools/enums";
import { PIECE_COLORS, PIECE_VALUES, GAME_STATUS, INDEX_TO_ROW, INDEX_TO_COL, ROW_TO_INDEX, COL_TO_INDEX } from "../enum";
import { executeAction, isAction, isTurn, noMoreActions, validateAction } from "../game/action";
import { getPieceAtChessCoords, getTurnInfo, isSafeMove, validateMove } from "../game/board";
import { getNextTurn, getPlayerFromMessage, validateTurnContinuity } from "../game/message";
import { getEnemyColor, isPiece, ownsPiece } from "../game/piece";
import { translateMessageToBoard, translateTurnToMessage } from "../game/translate";

class BoardManager {
    constructor(lastMove, currentMove, selectedTile, status, player) {
        this.lastMove = lastMove;
        this.currentMove = currentMove;
        this.selectedTile = selectedTile;
        this.status = status;
        this.player = player;
        this.actions = {};
    }

    validatePlayerMove(playerColor) {
        const { error: cError, data: cData } = validateTurnContinuity(this.lastMove, this.currentMove);
        if (cError) {
            return cError;
        }

        const { error: pError, data: pData } = validateAction(cData);
        if (pError) {
            return pError;
        }

        const lastBoard = translateMessageToBoard(this.lastMove);
        const { error: mError } = validateMove(
            lastBoard,
            pData,
            cData.last.canCastle[playerColor],
            cData.last.pawnRegistry,
            cData.last.positions[playerColor + PIECE_VALUES.KING]
        );

        if (mError) {
            return mError;
        }

        this.board = translateMessageToBoard(this.currentMove);
        this.positions = cData.curr.positions;
        this.pawnRegistry = cData.curr.pawnRegistry;
        this.canCastle = cData.curr.canCastle;
    }

    validateOpponentMove(opponentColor) {
        const error = this.validatePlayerMove(opponentColor);

        if (error) {
            return error;
        }

        if (!isSafeMove(this.board, this.positions[opponentColor + PIECE_VALUES.KING])) {
            return GAME_VALIDATION_MESSAGES.formatMessage(GAME_VALIDATION_MESSAGES.CHECKMATE, this.player);
        }
    }

    getStatus(setStatus, setMessage) {
        // 1. Get who made the current move
        // 2. If it was the player
        // 2a. Check the validity of the move, if it's not valid, the status is CHEAT
        // 2b. If it is valid, the status is the opponent's turn
        // 3. If it was the opponent
        // 3a. Check the validity of the move, if it's not valid, the status is CHEAT
        // 3b. Generate all possible moves for the player
        // 3c. If the player has no moves, and the king is in danger, the status is CHECKMATE
        // 3d. If the player has no moves, and the king is not in danger, the status is STALEMATE
        // 3e. If the player has moves, the status is the player's turn
        const currentMoveMaker = getPlayerFromMessage(this.currentMove);
        const nextMoveMaker = getEnemyColor(currentMoveMaker);
        const nextTurn = getNextTurn(this.currentMove);

        if (currentMoveMaker === this.player) {
            const error = this.validatePlayerMove(currentMoveMaker);

            if (error) {
                setMessage(error)
                this.status = GAME_STATUS.CHEAT;
                return setStatus(GAME_STATUS.CHEAT);
            }

            const { actions, isKingSafe } = getTurnInfo(this.board, nextMoveMaker, this.positions, this.pawnRegistry, this.canCastle[nextMoveMaker]);

            if (noMoreActions(actions) && !isKingSafe) {
                this.status = GAME_STATUS.CHECKMATE;
                return setStatus(GAME_STATUS.CHECKMATE);
            } else if (noMoreActions(actions) && isKingSafe) {
                this.status = GAME_STATUS.STALEMATE;
                return setStatus(GAME_STATUS.STALEMATE);
            } else {
                this.status = nextTurn;
                return setStatus(nextTurn);
            }
        } else {
            const error = this.validateOpponentMove(currentMoveMaker);
            if (error) {
                setMessage(error)
                this.status = GAME_STATUS.CHEAT;
                return setStatus(GAME_STATUS.CHEAT);
            }

            const { actions, isKingSafe } = getTurnInfo(this.board, this.player, this.positions, this.pawnRegistry, this.canCastle[this.player]);
            this.actions = actions;

            if (noMoreActions(actions) && !isKingSafe) {
                this.status = GAME_STATUS.CHECKMATE;
                return setStatus(GAME_STATUS.CHECKMATE);
            } else if (noMoreActions(actions) && isKingSafe) {
                this.status = GAME_STATUS.STALEMATE;
                return setStatus(GAME_STATUS.STALEMATE);
            } else {
                this.status = nextTurn;
                return setStatus(nextTurn);
            }
        }
    }

    getTileDetails(chessPos) {
        const details = {};
        const piece = getPieceAtChessCoords(this.board, chessPos);

        if (!isTurn(this.player, this.status)) {
            return { piece, selectable: false };
        }

        if (piece) {
            details.piece = piece;
            details.selectable = ownsPiece(this.player, piece);
        }

        if (this.selectedTile) {
            const actionPiece = getPieceAtChessCoords(this.board, this.selectedTile);
            const action = this.actions[actionPiece].find((action) => action.includes(chessPos))
            if (action) {
                details.action = action;
                details.selectable = true;
            }
        }

        details.selectable ??= false;

        return details;
    }

    translateTurn() {
        return translateTurnToMessage(this.positions, this.pawnRegistry, this.player, this.canCastle);
    }

    toggleTile(tile, setSelected) {
        if (this.selectedTile === tile) {
            setSelected(undefined);
            this.selectedTile = undefined;
        } else {
            setSelected(tile);
            this.selectedTile = tile;
        }
    }

    updateRegistry(pawn, to) {
        if (isPiece(pawn, PIECE_VALUES.PAWN) && ownsPiece(this.player, pawn)) {
            if (this.pawnRegistry[pawn] === undefined) {
                this.pawnRegistry[pawn] = to;
            }
        }
    }

    executeAction(action, toggleTransformModal, makeMove) {
        executeAction(this.board, this.selectedTile, action, this.positions);

        if (isAction(action, ACTION_TYPES.TRANSFORM)) {
            toggleTransformModal();
        } else if (isAction(action, ACTION_TYPES.CASTLE)) {
            this.canCastle[this.player] = { 1: false, 2: false };
        }

        console.log(this.board)
        makeMove(this.translateTurn());
    }

    getLabelOrder() {
        const rowLabels = this.player === PIECE_COLORS.BLACK ? BOARD_ROW_LABELS : BOARD_ROW_LABELS.slice().reverse();
        const colLabels = this.player === PIECE_COLORS.BLACK ? BOARD_COL_LABELS.slice().reverse() : BOARD_COL_LABELS;

        return { rowLabels, colLabels }
    }

    getBoardDetails() {
        const tiles = {};

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const chessRow = INDEX_TO_ROW[row];
                const chessCol = INDEX_TO_COL[col];
                const chessPos = chessCol + chessRow;

                tiles[chessPos] = this.getTileDetails(chessPos);
            }
        }

        return tiles;
    }

    getTileBackground(chessPos) {
        const row = ROW_TO_INDEX[chessPos[1]];
        const col = COL_TO_INDEX[chessPos[0]];

        if ((row + col) % 2 === 0) {
            return 1;
        } else {
            return 2;
        }
    }

    isSelectedPiece(chessPos) {
        return this.selectedTile === chessPos;
    }

    getPieceAt(chessPos) {
        return getPieceAtChessCoords(this.board, chessPos);
    }
}

export default BoardManager;
