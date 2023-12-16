import { useEnsName, useEnsAvatar } from "wagmi"
import { useEffect, useState } from "react";
import { useMessages } from "@xmtp/react-sdk";

import { isGameMessage } from "../tools/tools/message"

function GameCard({ conversation }) {
    const cardData = {
        primaryName: conversation.peerAddress,
        secondaryName: '',
        avatar: `https://noun-api.com/beta/pfp?name=${conversation.peerAddress}`,
    }
    const { data: ensNameData, isFetched: ensNameIsLoaded } = useEnsName({ address: conversation.peerAddress });
    const { data: ensAvatarData, isFetched: ensAvatarIsLoaded } = useEnsAvatar({ name: cardData.primaryName.includes('.eth') ? cardData.primaryName : undefined });
    const { messages, isLoaded: messagesIsLoaded } = useMessages(conversation);
    const [gameFound, setGameFound] = useState(false);

    useEffect(() => {
        if (messagesIsLoaded) {
            const possibleGame = messages.some(m => isGameMessage(m.content));
            console.log(possibleGame)
            setGameFound(possibleGame);
        }

    }, [messagesIsLoaded])

    useEffect(() => {
        if (ensNameIsLoaded && ensNameData) {
            cardData.secondaryName = cardData.primaryName;
            cardData.primaryName = ensNameData;
        }
    }, [ensNameIsLoaded]);

    useEffect(() => {
        if (ensAvatarIsLoaded && ensAvatarData) {
            cardData.avatar = ensAvatarData;
        }
    }, [ensAvatarIsLoaded]);

    return (
        <div
            className="bg-input rounded-lg text-xl px-4 py-4 w-full my-2 flex justify-between items-center"
        >
            <div className="flex items-center">
                <div>
                    <img
                        className="w-[75px] h-[75px] rounded-full border border-black mr-4"
                        src={cardData.avatar}
                        alt="avatar"
                    />
                </div>
                <div className="grid grid-rows-[1fr_auto] h-[75px]">
                    <div className="flex items-center">
                        {cardData.primaryName}
                    </div>
                    <div className="text-sm">{cardData.secondaryName}</div>
                </div>
            </div>
            <div>
                <button
                    className="bg-primary-button text-2xl p-4 rounded-lg hover:bg-primary-button-hover transition duration-300 ease-in-out mx-2"
                    disabled={!gameFound}
                    hidden={!gameFound}
                >
                    Load Game
                </button>
                <button
                    className="bg-primary-button text-2xl p-4 rounded-lg hover:bg-primary-button-hover transition duration-300 ease-in-out mx-2"
                >
                    New Game
                </button>
            </div>
        </div>
    )
}

export default GameCard
