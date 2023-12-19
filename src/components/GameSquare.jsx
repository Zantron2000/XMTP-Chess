function GameSquare({ position, style, action }) {
    return (
        <button
            className={`border ${style?.button} flex items-center justify-center`}
            disabled={action ? false : true}
            onClick={() => action(position)}
        >
            <div className={`rounded-full w-1/2 h-1/2 ${style?.div}`}></div>
        </button>
    )
}

export default GameSquare;
