import { PIECE_VALUES } from "../enums";
import { isEmpty } from "../tools/board";
import { generateMoves, isCaptureAction, isMoveAction } from "../tools/moves";
import { getImageClass, isAlly } from "../tools/piece";

class BoardManager {
    constructor(board, playerColor, selectedPiece = [-1, -1], moves = []) {
        this.board = board;
        this.playerColor = playerColor;
        this.selectedPiece = selectedPiece;
        this.moves = moves;
    }

    /**
     * Returns the piece at the given position. If the position is out of bounds, returns null.
     * @param {Number} x The row of the piece
     * @param {Number} y The column of the piece
     * @returns {String?} The piece at the given position, or null if the position is out of bounds
     */
    getPieceAt(x, y) {
        if (0 <= x && x < this.board.length) {
            if (0 <= y && y < this.board[x].length) {
                return this.board[x][y];
            }
        }

        return null;
    }

    /**
     * Generates the moves for the piece at the given position. If the position is out of bounds, returns an empty array.
     * 
     * @param {Number[]} pos The position of the piece
     * @returns {String[]} The moves for the piece at the given position
     */
    generateMovesForPieceAt(pos) {
        const piece = this.getPieceAt(...pos);

        if (piece !== null) {
            return generateMoves(this.board, pos, piece);
        }

        return [];
    }

    /**
     * Generates the moves for the piece at the given position. If the position is out of bounds, returns an empty array.
     * 
     * @param {Number[]} pos The position of the piece
     * @return {Boolean} If the piece at the given position is selected
     */
    isActivePiece([x, y]) {
        return this.selectedPiece[0] === x && this.selectedPiece[1] === y;
    }

    /**
     * Finds the action for the given position. If the position is out of bounds, returns undefined.
     * 
     * @param {Number[]} pos The position of the piece
     * @returns {String | undefined} The action for the given position, or undefined if the position is out of bounds
     */
    findAction([x, y]) {
        return this.moves.find(move => move.startsWith(`${x}${y}`));
    }

    getStyle(pos) {
        const styles = {}
        const targetMove = this.findAction(pos)

        if (!targetMove) {
            styles.div = 'hidden'
        } else if (isMoveAction(targetMove)) {
            styles.div = 'bg-move-background'
        } else if (isCaptureAction(targetMove)) {
            styles.div = 'bg-capture-background'
        }

        if (this.isActivePiece(pos)) {
            styles.button = 'bg-selected-piece-background'
        } else {
            styles.button = 'border-white/0'
        }

        if ((pos[0] + pos[1]) % 2 === 0) {
            styles.button += ' bg-checker1'
        } else {
            styles.button += ' bg-checker2'
        }

        styles.button += ' ' + getImageClass(this.getPieceAt(pos[0], pos[1]));

        return styles
    }

    toggleActivePiece(pos, setFunction) {
        if (this.isActivePiece(pos, this.selectedPiece)) {
            setFunction(undefined);
        } else {
            setFunction(pos);
        }
    }

    isDisabled([x, y]) {
        const piece = this.getPieceAt(x, y);

        if (piece && isAlly(piece, this.playerColor)) {
            return false;
        }
        if (this.findAction([x, y])) {
            return false;
        }

        return true;
    }

    movePiece([newX, newY], setFunction) {
        const [oldX, oldY] = this.selectedPiece;
        const piece = this.getPieceAt(oldX, oldY);
        const targetMove = this.findAction([newX, newY]);

        if (targetMove) {
            this.board[this.selectedPiece[0]][this.selectedPiece[1]] = PIECE_VALUES.EMPTY;
            this.board[newX][newY] = piece;

            console.log(this.board)
            setFunction(this.board);
        }
    }

    getAction(pos, setSelect, setBoard) {
        const piece = this.getPieceAt(pos[0], pos[1]);
        const selectFunction = this.toggleActivePiece.bind(this);
        const moveFunction = this.movePiece.bind(this);

        if (piece && isAlly(piece, this.playerColor)) {
            return () => selectFunction(pos, setSelect);
        } else if (this.findAction(pos)) {
            return () => moveFunction(pos, setBoard);
        }

        return undefined;
    }
}

export default BoardManager;
