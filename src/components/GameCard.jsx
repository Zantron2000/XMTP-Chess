import { useEnsName, useEnsAvatar } from "wagmi"
import { useEffect, useState } from "react";
import { useMessages } from "@xmtp/react-sdk";
import { useNavigate } from "react-router-dom";

import { isGameContent } from "../utils/message/message"
import { PIECE_COLORS } from "../utils/enum";

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
    const navigate = useNavigate();

    useEffect(() => {
        if (messagesIsLoaded) {
            const possibleGame = messages.some(m => isGameContent(m.content));
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

    const loadNewGame = (e) => {
        e.preventDefault();
        const profiles = {
            opponent: {
                name: cardData.secondaryName ? cardData.primaryName : undefined,
                img: cardData.avatar,
            }
        }

        const color = conversation.peerAddress === '0x99FD46b167B0FBB8aC6f79E6f575A6199c2cb536' ? PIECE_COLORS.BLACK : PIECE_COLORS.WHITE;
        navigate('/play', { state: { convo: conversation, opponent: conversation.peerAddress, hash: 'abcdp', color, profiles } })
    }

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
                    onClick={loadNewGame}
                >
                    New Game
                </button>
            </div>
        </div>
    )
}

export default GameCard
