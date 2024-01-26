import { createContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export const GameContext = createContext();

function FindGame({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [state] = useState(location.state || {});
    const { color, hash, opponent, convo, firstLastMove, firstCurrMove } = state;
    const [initLastMove, setInitLastMove] = useState(firstLastMove);
    const [initCurrMove, setInitCurrMove] = useState(firstCurrMove);

    useEffect(() => {
        navigate('.', { replace: true, state: { ...state, firstLastMove: undefined, firstCurrMove: undefined } })
    }, [navigate])

    if ([color, hash, opponent, convo].includes(undefined)) {
        return <Navigate to="/" />
    }

    return (
        <GameContext.Provider value={{ ...state, initLastMove, initCurrMove }}>
            {children}
        </GameContext.Provider>
    )
}

export default FindGame;
