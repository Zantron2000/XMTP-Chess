import { useState } from "react";

function MessageInput() {
    const [message, setMessage] = useState('');

    const submitMessage = (e) => {
        e.preventDefault();

        if (e.which === 13) {
            console.log('Submitting message...');
        }
    }

    const editMesssage = (e) => {
        e.preventDefault();

        setMessage(e.target.value);
    }

    return (
        <form className="h-[13%] w-[95%] px-4 py-2 bg-[#70c729] rounded-xl">
            <textarea
                className=" w-full h-full textbar bg-[#70c729] text-black placeholder:text-gray-900"
                placeholder="Message opponent here..."
                onChange={editMesssage}
                value={message}
                onKeyUp={submitMessage}
            >
            </textarea>
        </form>
    )
}

export default MessageInput
