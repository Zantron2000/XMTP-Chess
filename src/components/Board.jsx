import { getImageClass } from '../tools/tools/piece';

function Board({ board }) {
    const squares = [];

    board.forEach((row, rowIndex) => {
        row.forEach((square, colIndex) => {
            const bgColor = (rowIndex + colIndex) % 2 === 0 ? 'bg-checker1' : 'bg-checker2';

            const image = getImageClass(square);

            squares.push(
                <div
                    className={`${bgColor} ${image}`}
                />
            );
        });
    });

    return (
        <div className='board grid grid-cols-8 aspect-square rounded-md'>
            {...squares}
        </div>
    );
}

export default Board
