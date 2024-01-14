import { redirect, useLocation } from "react-router-dom";

function FindGame({ children }) {
    const location = useLocation();
    const { color, hash, opponent, convo } = location.state;

    if ([color, hash, opponent, convo].includes(undefined)) {
        return redirect('/');
    }

    return (
        <>
            {children}
        </>
    )
}

export default FindGame
