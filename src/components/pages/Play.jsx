import { useState } from "react"

import Header from "../Header"
import Footer from "../Footer"
import Board from "../GameBoard"
import { createInitialBoard } from '../../tools/tools/board'
import { PIECE_COLORS } from "../../tools/enums"

function Play() {
    const [board, setBoard] = useState(createInitialBoard())

    return (
        <div className="min-h-screen bg-foreground grid grid-rows-[auto_1fr_auto]">
            <Header />
            <div className="mt-4">
                <div className="flex h-full flex-col xl:flex-row space-y-4 xl:space-y-0">
                    <div className="w-[100%] md:w-[75%] xl:w-1/2 bg-foreground mx-auto">
                        <div className="w-[85%] md:w-[85%] xl:w-[75%] h-full mx-auto">
                            <Board board={board} player={PIECE_COLORS.BLACK} setBoard={setBoard} />
                        </div>
                    </div>
                    <div className="w-[100%] md:w-[75%] xl:w-1/2 bg-gray-900 mx-auto h-[450px] md:h-[600px] xl:h-[90%]">
                        <div className="w-[85%] md:w-[85%] xl:w-[75%] h-full mx-auto flex flex-col justify-around items-center bg-gray-800 rounded-xl">
                            <div className="bg-gray-700 h-[80%] w-[95%] rounded-xl px-4 py-2">
                                <div className="border-b border-white mb-4 flex justify-center items-center text-lg h-[10%]">
                                    Opponent.eth
                                </div>
                                <div className="overflow-y-scroll flex justify-start flex-col h-[85%] textbar space-y-2">
                                    <div className="w-full bg-black flex">
                                        <div className="w-[10%]">
                                            <img src="https://noun-api.com/beta/pfp?name=A" className="rounded-full max-w-[60px]" />
                                        </div>
                                        <div className="w-[80%] px-2 flex justify-start">
                                            <div className="bg-gray-600 px-4 max-w-[75%] min-h-[45px] py-2 rounded-lg break-all">
                                                A
                                            </div>
                                        </div>
                                        <div className="w-[10%]"></div>
                                    </div>
                                    <div className="w-full bg-black flex">
                                        <div className="w-[10%]"></div>
                                        <div className="w-[80%] px-2 flex justify-end">
                                            <div className="bg-gray-600 px-4 max-w-[75%] min-h-[45px] py-2 rounded-lg break-all">
                                                ABCDEFG ABCDEFG ABCDEFG ABCDEFG
                                            </div>
                                        </div>
                                        <div className="w-[10%]">
                                            <img src="https://noun-api.com/beta/pfp?name=B" className="rounded-full max-w-[60px]" />
                                        </div>
                                    </div>
                                    <div className="w-full bg-black flex">
                                        <div className="w-[10%]">
                                            <img src="https://noun-api.com/beta/pfp?name=A" className="rounded-full max-w-[60px]" />
                                        </div>
                                        <div className="w-[80%] px-2 flex justify-start">
                                            <div className="bg-gray-600 px-4 max-w-[75%] min-h-[45px]py-2 rounded-lg break-all">
                                                ABCDEFG ABCDEFG ABCDEFG ABCDEFG ABCDEFG ABCDEFG ABCDEFG ABCDEFG ABCDEFG
                                            </div>
                                        </div>
                                        <div className="w-[10%]"></div>
                                    </div>
                                    <div className="w-full bg-black flex">
                                        <div className="w-[10%]"></div>
                                        <div className="w-[80%] px-2 flex justify-start">
                                            <div className="bg-gray-600 px-4 max-w-[75%] min-h-[45px]py-2 rounded-lg break-all">
                                                ABCDEFG ABCDEFG ABCDEFG ABCDEFG ABCDEFG ABCDEFG ABCDEFG ABCDEFG ABCDEFG
                                            </div>
                                        </div>
                                        <div className="w-[10%]"></div>
                                    </div>
                                    <div className="w-full bg-black flex">
                                        <div className="w-[10%]"></div>
                                        <div className="w-[80%] px-2 flex justify-end">
                                            <div className="bg-gray-600 px-4 max-w-[75%] min-h-[45px] py-2 rounded-lg break-all">
                                                ABCDEFG ABCDEFG ABCDEFG ABCDEFG
                                            </div>
                                        </div>
                                        <div className="w-[10%]">
                                            <img src="https://noun-api.com/beta/pfp?name=B" className="rounded-full max-w-[60px]" />
                                        </div>
                                    </div>
                                    <div className="w-full bg-black flex">
                                        <div className="w-[10%]"></div>
                                        <div className="w-[80%] px-2 flex justify-end">
                                            <div className="bg-gray-600 px-4 max-w-[75%] min-h-[45px] py-2 rounded-lg break-all">
                                                ABCDEFG ABCDEFG ABCDEFG ABCDEFG
                                            </div>
                                        </div>
                                        <div className="w-[10%]"></div>
                                    </div>
                                    <div className="w-full bg-black flex">
                                        <div className="w-[10%]"></div>
                                        <div className="w-[80%] px-2 flex justify-end">
                                            <div className="bg-gray-600 px-4 max-w-[75%] min-h-[45px] py-2 rounded-lg break-all">
                                                ABCDEFG ABCDEFG ABCDEFG ABCDEFG
                                            </div>
                                        </div>
                                        <div className="w-[10%]"></div>
                                    </div>
                                    <div className="w-full bg-black flex">
                                        <div className="w-[10%]"></div>
                                        <div className="w-[80%] px-2 flex justify-end">
                                            <div className="bg-gray-600 px-4 max-w-[75%] min-h-[45px] py-2 rounded-lg break-all">
                                                ABCDEFG ABCDEFG ABCDEFG ABCDEFG
                                            </div>
                                        </div>
                                        <div className="w-[10%]"></div>
                                    </div>
                                </div>
                            </div>
                            <form className="h-[13%] w-[95%] px-4 py-2 bg-gray-700 rounded-xl">
                                <textarea className=" w-full h-full textbar bg-gray-700">
                                    Text input
                                </textarea>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Play
