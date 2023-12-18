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

    getPieceAt(x, y) {
        return this.board[x][y];
    }

    generateMovesForPieceAt([x, y]) {
        const piece = this.getPieceAt(x, y);

        if (piece !== null) {
            return generateMoves(this.board, piece, x, y);
        }

        return [];
    }

    isActivePiece([x, y]) {
        return this.selectedPiece[0] === x && this.selectedPiece[1] === y;
    }

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

    toggleActivePiece([x, y], setFunction) {
        if (this.isActivePiece([x, y], this.selectedPiece)) {
            setFunction(undefined);
        } else {
            setFunction([x, y]);
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
