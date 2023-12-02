import { useSSX } from "@spruceid/ssx-react"
import { } from "@web3modal/wagmi"

function SSXLogin() {
    const { ssx } = useSSX();



    return (
        <div className="min-w-screen min-h-screen bg-[#4a752c] flex justify-center items-center">
            <div className="min-w-[90vw] min-h-[90vh] bg-[#578a34] rounded-lg">
                <div className="w-full p-8 flex items-center justify-between flex-col">
                    <div className="mb-24">
                        <h1 className="text-black text-3xl">Play chess with your friends</h1>
                    </div>
                    <div className="text-lg">
                        <div>To start, please connect your wallet</div>
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SSXLogin
