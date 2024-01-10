import PlayerMessage from './PlayerMessage';
import OpponentMessage from './OpponentMessage';
import MessageInput from './MessageInput';
import MessageManager from '../utils/managers/MessageManager';

function MessageBoard({ conversation, playerAddr, hash }) {
    const sendMessageFn = (content) => console.log(content);
    const messages = [{ content: 'Hello', senderAddress: 'player' }, { content: 'Hi', senderAddress: 'opponent' }, { content: 'Want to play', senderAddress: 'opponent' }];

    const manager = new MessageManager(conversation, messages, playerAddr, hash);
    const displayDetails = manager.getDisplayDetails();

    return (
        <div className="w-[85%] md:w-[85%] xl:w-[75%] h-full mx-auto flex flex-col justify-around items-center bg-[#68a239] rounded-xl">
            <div className="bg-[#70c729] h-[80%] w-[95%] rounded-xl px-4 py-2">
                <div className="border-b border-white mb-4 flex justify-center items-center text-2xl h-[10%]">
                    Opponent.eth
                </div>
                <div className="overflow-y-scroll flex justify-start flex-col h-[85%] textbar space-y-2">
                    {
                        displayDetails.map((details, index) => {
                            if (details.isPlayer) {
                                return (
                                    <PlayerMessage
                                        key={index}
                                        message={details.content}
                                        newThread={details.includeImage}
                                        profileSrc={'https://noun-api.com/beta/pfp?name=B'}
                                    />
                                );
                            } else {
                                return (
                                    <OpponentMessage
                                        key={index}
                                        message={details.content}
                                        newThread={details.includeImage}
                                        profileSrc={'https://noun-api.com/beta/pfp?name=A'}
                                    />
                                );
                            }
                        })
                    }
                </div>
            </div>
            <MessageInput sendMessage={(content) => manager.sendMessage(sendMessageFn, content)} />
        </div>
    );
}

export default MessageBoard;
