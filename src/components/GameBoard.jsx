import { useState } from 'react';

import { getImageClass, isAlly, isEnemy } from '../tools/tools/piece';
import { BOARD_ROW_LABELS, BOARD_COL_LABELS, PIECE_COLORS } from '../tools/enums';
import { generateMoves } from '../tools/tools/moves';
import GameSquare from './GameSquare';
import BoardManager from '../tools/managers/BoardManager';

function Board({ board, setBoard, player }) {
    const [selectedPiece, setSelectedPiece] = useState(undefined);
    const moves = selectedPiece ? generateMoves(board, selectedPiece, board[selectedPiece[0]][selectedPiece[1]]) : [];
    const boardManager = new BoardManager(board, player, selectedPiece, moves);
    const squares = [];
    const rowLabelOrder = player === PIECE_COLORS.BLACK ? BOARD_ROW_LABELS : BOARD_ROW_LABELS.slice().reverse();
    const colLabelOrder = player === PIECE_COLORS.WHITE ? BOARD_COL_LABELS : BOARD_COL_LABELS.slice().reverse();

    board.forEach((row, rowIndex) => {
        row.forEach((square, colIndex) => {
            const bgColor = (rowIndex + colIndex) % 2 === 0 ? 'bg-checker1' : 'bg-checker2';

            squares.push(
                <GameSquare
                    position={[rowIndex, colIndex]}
                    key={`${rowIndex}${colIndex}`}
                    style={boardManager.getStyle([rowIndex, colIndex])}
                    action={boardManager.getAction([rowIndex, colIndex], setSelectedPiece, setBoard)}
                />
            );
        });
    });
    if (player === PIECE_COLORS.WHITE) {
        squares.reverse();
    }

    return (
        <div className='w-full'>
            <div className='w-full bg-[#65a92d] rounded-xl'>
                <div className='grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] text-center'>
                    <div className='invisible px-2'>X</div>
                    {colLabelOrder.map((label) => <div className='py-2'>{label}</div>)}
                    <div className='invisible px-2'>X</div>
                </div>
                <div className='flex w-full'>
                    <div>
                        <div className='h-full grid grid-rows-[8] text-center'>
                            {rowLabelOrder.map((label) => <div className='px-2 flex items-center'>{label}</div>)}
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className='game_board grid grid-cols-8 aspect-square rounded-md'>
                            {...squares}
                        </div>
                    </div>
                    <div>
                        <div className='h-full grid grid-rows-[8] text-center'>
                            {rowLabelOrder.map((label) => <div className='px-2 flex items-center'>{label}</div>)}
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] text-center'>
                    <div className='invisible px-2'>X</div>
                    {colLabelOrder.map((label) => <div className='py-2'>{label}</div>)}
                    <div className='invisible px-2'>X</div>
                </div>
            </div>
        </div>
    );
}

export default Board
