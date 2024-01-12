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

function Play() {
    const { startConversation } = useStartConversation();
    const { sendMessage } = useSendMessage();
    const [conversation, setConversation] = useState(null);
    const { ssx } = useSSX();
    const opponent = ssx.address() === '0x99FD46b167B0FBB8aC6f79E6f575A6199c2cb536' ? '0x7b653a3BA395275c2e4cB55Dd45Fc041A4074747' : '0x99FD46b167B0FBB8aC6f79E6f575A6199c2cb536'
    const color = ssx.address() === '0x99FD46b167B0FBB8aC6f79E6f575A6199c2cb536' ? PIECE_COLORS.WHITE : PIECE_COLORS.BLACK;

    useStreamAllMessages((message) => console.log("NEW MESSAGE", message))

    const hash = 'abcdf'

    const loadConvo = async () => {
        const convo = await startConversation(opponent)

        console.log("CONVO:", convo)
        setConversation(convo.cachedConversation);
    }

    useEffect(() => {
        loadConvo();
    }, [])

    const [moveNeg1, move0] = generateInitalMoves();
    const [status, setStatus] = useState(CONNECT_STATUS.ACCEPT);
    const [lastMove, setLastMove] = useState(moveNeg1);
    const [currMove, setCurrMove] = useState(move0);
    const sendMove = (nextMove) => {
        setLastMove(currMove);
        setCurrMove(nextMove);

        console.log(currMove, nextMove)

        sendMessage(conversation, `${hash}-${nextMove}`)
    }

    const getOpponentMove = (first, second) => {
        console.log(first, second);
        const { content: fContent } = first;
        const ready = true;

        if (ready && getContent(fContent) !== currMove.content) {
            if (second) {
                const { content: sContent } = second;

                setLastMove(getContent(sContent));
                setCurrMove(getContent(fContent));
            } else {
                setLastMove(currMove);
                setCurrMove(getContent(fContent));
            }
        }
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
                        />
                    </div>
                    <div className="w-[100%] md:w-[75%] xl:w-1/2 mx-auto h-[450px] md:h-[600px] xl:h-[90%]">
                        {conversation ? <MessageBoard hash={hash} conversation={conversation} playerAddr={ssx.address()} sendGameDetails={getOpponentMove} /> : null}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Play
