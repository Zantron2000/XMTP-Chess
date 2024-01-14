import { useEffect, useState } from "react"
import { useSendMessage, useStartConversation, useStreamAllMessages } from "@xmtp/react-sdk"
import { useSSX } from "@spruceid/ssx-react"

import Header from "../Header"
import Footer from "../Footer"
import { CONNECT_STATUS, GAME_STATUS, PIECE_COLORS } from "../../utils/enum"
import { generateInitalMoves } from "../../utils/game/message"
import MessageBoard from "../MessageBoard"
import GameContainer from "../GameContainer"
import { getContent } from "../../utils/message/message"
import GameManager from "../../utils/managers/GameManager"
import { useLocation } from "react-router-dom"

function Play() {
    const location = useLocation();
    const { opponent, hash, color, firstLastMove, firstCurrMove } = location.state;
    const { sendMessage } = useSendMessage();
    console.log("DATA", location.state)
    const [conversation, setConversation] = useState(location.state.convo);
    const { ssx } = useSSX();

    useStreamAllMessages((message) => console.log("NEW MESSAGE", message))

    const [moveNeg1, move0] = generateInitalMoves();
    const [status, setStatus] = useState(CONNECT_STATUS.ACCEPT);
    const [lastMove, setLastMove] = useState(firstLastMove ?? moveNeg1);
    const [currMove, setCurrMove] = useState(firstCurrMove ?? move0);
    const [sendData, setSendData] = useState('');
    const sets = { setStatus, setLastMove, setCurrMove, setSendData }
    const manager = new GameManager(lastMove, currMove, status, ssx.address(), color, hash);

    useEffect(() => {
        if (sendData.trim() !== '') {
            sendMessage(conversation, sendData.trim())
            setSendData('')
        }
    }, [sendData])

    const sendMove = (nextMove) => {
        setLastMove(currMove);
        setCurrMove(nextMove);

        sendMessage(conversation, `${hash}-${nextMove}`)
    }

    return (
        <div className="min-h-screen bg-foreground grid grid-rows-[auto_1fr_auto]">
            <Header />
            <div className="mt-4">
                <div className="flex h-full flex-col xl:flex-row space-y-4 xl:space-y-0">
                    <div className="w-[100%] md:w-[75%] xl:w-1/2 bg-foreground mx-auto">
                        <GameContainer
                            connectStatus={status}
                            currMove={currMove}
                            lastMove={lastMove}
                            player={color}
                            sendMove={sendMove}
                            gameOver={manager.isGameOver()}
                        />
                    </div>
                    <div className="w-[100%] md:w-[75%] xl:w-1/2 mx-auto h-[450px] md:h-[600px] xl:h-[90%]">
                        {conversation ? <MessageBoard
                            hash={hash}
                            conversation={conversation}
                            playerAddr={ssx.address()}
                            sendGameDetails={(first) => manager.updateStatus(sets, first)}
                        /> : null}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Play
