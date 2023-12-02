import { useAccount } from "wagmi";
import { useClient, Client, useStartConversation, useCanMessage, useConversations } from "@xmtp/react-sdk";
import { useSSX } from "@spruceid/ssx-react";
import { useEffect, useState } from "react";

function Tester({ wallet }) {
    const { ssx } = useSSX();
    const [keys, setKeys] = useState(undefined);
    const [ready, setReady] = useState(false);
    const { client, error, isLoading, initialize } = useClient();
    const { address, isConnecting, isDisconnected } = useAccount();
    const { canMessage, canMessageStatic } = useCanMessage();
    const { startConversation } = useStartConversation();
    const { conversations } = useConversations();

    useEffect(() => {
        const exec = async () => {
            if (ssx?.session()) {
                /**
                 * @type {import("@xmtp/react-sdk").ClientOptions}
                 */
                const options = { env: 'production' };
                let tempKeys = await Client.getKeys(wallet, {
                    ...options,
                    skipContactPublishing: true,
                    persistConversations: false,
                });
                setKeys(tempKeys);

                await initialize({ tempKeys, options, signer: wallet })
                setReady(true)
            }
        }

        exec();
    }, [ssx?.session()])

    useEffect(() => {
        const exec = async () => {
            const results = await canMessageStatic('0x99FD46b167B0FBB8aC6f79E6f575A6199c2cb536');
            console.log(results);

            const convo = await startConversation('0x99FD46b167B0FBB8aC6f79E6f575A6199c2cb536', 'Hi there!');
            console.log(convo);

            console.log(conversations)
        }

        exec();
    }, [startConversation, client, ready])

    console.log(client, initialize)

    return (
        <div>
            <p>HI</p>
            <w3m-button />
            <p>HI</p>
        </div>
    )
}

export default Tester
