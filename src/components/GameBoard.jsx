import { useState, useEffect } from 'react';

import GameSquare from './GameSquare';
import BoardManager from '../utils/managers/BoardManager';
import { INDEX_TO_COL, INDEX_TO_ROW, PIECE_COLORS } from '../utils/enum';

function Board({ player, status, setStatus, lastMove, currMove, sendMove }) {
    const [selectedTile, setSelectedTile] = useState(undefined);
    const boardManager = new BoardManager(lastMove, currMove, selectedTile, status, player);

    boardManager.getStatus(setStatus, (data) => console.log(data));
    const squares = [];
    const { rowLabels, colLabels } = boardManager.getLabelOrder();
    const makeMove = (nextMove) => {
        setSelectedTile(undefined);

        sendMove(nextMove);
    }

    useEffect(() => {
        boardManager.getStatus(setStatus, (data) => console.log(data));
    }, [currMove]);

    const boardDetails = boardManager.getBoardDetails();

    for (let row = 0; row < 8; row += 1) {
        for (let col = 7; col > -1; col -= 1) {
            const chessRow = INDEX_TO_ROW[row];
            const chessCol = INDEX_TO_COL[col];
            const chessPos = chessCol + chessRow;

            squares.push(<GameSquare
                details={boardDetails[chessPos]}
                key={chessPos}
                manager={boardManager}
                position={chessPos}
                makeMove={makeMove}
                setSelected={setSelectedTile}
            />)
        }
    }

    if (player === PIECE_COLORS.WHITE) {
        squares.reverse();
    }

    return (
        <div className='w-full'>
            <div className='w-full bg-[#65a92d] rounded-xl'>
                <div className='grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] text-center'>
                    <div className='invisible px-2'>X</div>
                    {colLabels.map((label) => <div className='py-2'>{label}</div>)}
                    <div className='invisible px-2'>X</div>
                </div>
                <div className='flex w-full'>
                    <div>
                        <div className='h-full grid grid-rows-[8] text-center'>
                            {rowLabels.map((label) => <div className='px-2 flex items-center'>{label}</div>)}
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className='game_board grid grid-cols-8 aspect-square rounded-md'>
                            {...squares}
                        </div>
                    </div>
                    <div>
                        <div className='h-full grid grid-rows-[8] text-center'>
                            {rowLabels.map((label) => <div className='px-2 flex items-center'>{label}</div>)}
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] text-center'>
                    <div className='invisible px-2'>X</div>
                    {colLabels.map((label) => <div className='py-2'>{label}</div>)}
                    <div className='invisible px-2'>X</div>
                </div>
            </div>
        </div>
    );
}

export default Board
