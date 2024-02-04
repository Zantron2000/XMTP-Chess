import { createStarterMessage, createTestXMTPMessage } from "../../tools";
import {
    hasHash,
    getHash,
    getContent,
    filterMessages,
    isHashContent,
    isConnectStatus,
    loadGameHistory,
} from "../../../src/utils/message/message";
import { CONNECT_STATUS, MESSAGE, PIECE_COLORS } from "../../../src/utils/enum";
import { generateInitalMoves } from "../../../src/utils/game/message";

const [moveNeg1, move0] = generateInitalMoves();

describe('Tests the hasHash function', () => {
    it('Should return true for a valid hash', () => {
        const message = createTestXMTPMessage('ABCDE-');

        const results = hasHash(message.content);

        expect(results).toBe(true);
    });

    it('Should return false for an invalid hash', () => {
        const message = createTestXMTPMessage('Hey thjere gusy how are you doing');

        const results = hasHash(message.content);

        expect(results).toBe(false);
    });
});

describe('Tests the getHash function', () => {
    it('Should return the hash', () => {
        const message = createTestXMTPMessage('ABCDE-ABCDEFGESFSDFSD');

        const results = getHash(message.content);

        expect(results).toBe('ABCDE');
    });
});

describe('Tests the getContent function', () => {
    it('Should return the content', () => {
        const message = createTestXMTPMessage('ABCDE-ABCDEFGESFSDFSD');

        const results = getContent(message.content);

        expect(results).toBe('ABCDEFGESFSDFSD');
    });
});

describe('Tests the isHashContent function', () => {
    it('Should return true if the message starts with the hash', () => {
        const message = createTestXMTPMessage('ABCDE-ABCDEFGESFSDFSD');

        const results = isHashContent(message.content, 'ABCDE');

        expect(results).toBe(true);
    });

    it('Should return false if the message does not start with the hash', () => {
        const message = createTestXMTPMessage('ABCDE-ABCDEFGESFSDFSD');

        const results = isHashContent(message.content, 'DEFGA');

        expect(results).toBe(false);
    });

    it('Should return false if the message does not have the hash delimiter', () => {
        const message = createTestXMTPMessage('ABCDEABCDEFGESFSDFSD');

        const results = isHashContent(message.content, 'ABCDE');

        expect(results).toBe(false);
    });
});

describe('Tests the filterMessages function', () => {
    it('Should filter game messages from regular messages', () => {
        const hash = 'ABCDE';
        const messages = [
            createTestXMTPMessage(hash + '-ABCDEFGESFSDFSD'),
            createTestXMTPMessage('Hey thjere gusy how are you doing'),
            createTestXMTPMessage(hash + '-ABCDEFGESFSDFSD'),
            createTestXMTPMessage('This is a test message'),
            createTestXMTPMessage(hash + '-ABCDEFGESFSDFSD'),
        ];

        const results = filterMessages(messages, hash);

        expect(results.gameMessages.length).toBe(3);
        expect(results.convoMessages.length).toBe(2);
        expect(results.gameMessages).toContainEqual(messages[0]);
        expect(results.gameMessages).toContainEqual(messages[2]);
        expect(results.gameMessages).toContainEqual(messages[4]);
        expect(results.convoMessages).toContainEqual(messages[1]);
        expect(results.convoMessages).toContainEqual(messages[3]);
    });
});

describe("Tests the isConnectStatus function", () => {
    it('Should return true when the content is a connect status', () => {
        const results = isConnectStatus('abcdp-O,C');

        expect(results).toBe(true);
    });
});

describe('Tests the loadGameHistory function', () => {
    it('Should find invitations without interference', () => {
        const messages = [
            createTestXMTPMessage('ABCDE' + MESSAGE.HASH_DELIMITER + CONNECT_STATUS.INVITE + MESSAGE.GAME_DELIMITER + PIECE_COLORS.WHITE, '0x123'),
            createTestXMTPMessage('FGHIJ' + MESSAGE.HASH_DELIMITER + CONNECT_STATUS.INVITE + MESSAGE.GAME_DELIMITER + PIECE_COLORS.WHITE, '0x456'),
        ];

        const results = loadGameHistory(messages, '0x123');

        expect(results.invite.hash).toBe('ABCDE');
        expect(results.invite.color).toBe(PIECE_COLORS.WHITE);
        expect(results.accept.hash).toBe('FGHIJ');
        expect(results.accept.color).toBe(PIECE_COLORS.BLACK);
    });

    it('Should reject invitations that have been declined', () => {
        const messages = [
            createTestXMTPMessage('ABCDE' + MESSAGE.HASH_DELIMITER + CONNECT_STATUS.INVITE + MESSAGE.GAME_DELIMITER + PIECE_COLORS.WHITE, '0x123'),
            createTestXMTPMessage('FGHIJ' + MESSAGE.HASH_DELIMITER + CONNECT_STATUS.INVITE + MESSAGE.GAME_DELIMITER + PIECE_COLORS.WHITE, '0x456'),
            createTestXMTPMessage('ABCDE' + MESSAGE.HASH_DELIMITER + CONNECT_STATUS.DECLINE + MESSAGE.GAME_DELIMITER + PIECE_COLORS.BLACK, '0x456'),
        ];

        const results = loadGameHistory(messages, '0x123');

        expect(results.accept.hash).toBe('FGHIJ');
        expect(results.accept.color).toBe(PIECE_COLORS.BLACK);
        expect(results.invite).toBe(null);
    });

    it('Should reject invitations that have been rejected', () => {
        const messages = [
            createTestXMTPMessage('ABCDE' + MESSAGE.HASH_DELIMITER + CONNECT_STATUS.INVITE + MESSAGE.GAME_DELIMITER + PIECE_COLORS.WHITE, '0x123'),
            createTestXMTPMessage('FGHIJ' + MESSAGE.HASH_DELIMITER + CONNECT_STATUS.INVITE + MESSAGE.GAME_DELIMITER + PIECE_COLORS.WHITE, '0x456'),
            createTestXMTPMessage('FGHIJ' + MESSAGE.HASH_DELIMITER + CONNECT_STATUS.DECLINE + MESSAGE.GAME_DELIMITER + PIECE_COLORS.BLACK, '0x123'),
        ];

        const results = loadGameHistory(messages, '0x123');

        expect(results.accept).toBe(null);
        expect(results.invite.hash).toBe('ABCDE');
        expect(results.invite.color).toBe(PIECE_COLORS.WHITE);
    });

    it('Should reject all invitations if a game has started', () => {
        const messages = [
            createTestXMTPMessage('ABCDE' + MESSAGE.HASH_DELIMITER + CONNECT_STATUS.INVITE + MESSAGE.GAME_DELIMITER + PIECE_COLORS.WHITE, '0x123'),
            createTestXMTPMessage('FGHIJ' + MESSAGE.HASH_DELIMITER + CONNECT_STATUS.INVITE + MESSAGE.GAME_DELIMITER + PIECE_COLORS.WHITE, '0x456'),
            createTestXMTPMessage('KLMNO' + MESSAGE.HASH_DELIMITER + CONNECT_STATUS.INVITE + MESSAGE.GAME_DELIMITER + PIECE_COLORS.BLACK, '0x456'),
            createTestXMTPMessage('KLMNO' + MESSAGE.HASH_DELIMITER + CONNECT_STATUS.ACCEPT + MESSAGE.GAME_DELIMITER + PIECE_COLORS.BLACK, '0x123'),
            createTestXMTPMessage('KLMNO' + MESSAGE.HASH_DELIMITER + createStarterMessage(), '0x456')
        ];

        const results = loadGameHistory(messages, '0x123');

        expect(results.accept).toBe(null);
        expect(results.invite).toBe(null);
    });

    it('Should keep note of invalid hashes and reject them', () => {
        const messages = [
            {
                "content": "oPVKq-A1B1C1D1E1F1XXG1A2B2C3D2E2F3G2H2A8B8C8D8E8F8G8H8A6B7C7D5F4F7G7H7,W,TTTT",
                "senderAddress": "0x1234",
            },
            {
                "content": "oPVKq-A1B1C1D1E1F1XXG1A2B2C3D2E2F3G2H2A8B8C8D8E8A3G8H8A6B7C7D5F4F7G7H7,B,TTTT",
                "senderAddress": "0x5678",
            },
            {
                "content": "oPVKq-A1B1C1D1E1F1XXG1A2B2C4D2E2F3G2H2A8B8C8D8E8A3G8H8A6B7C7D5F4F7G7H7,W,TTTT",
                "senderAddress": "0x1234",
            },
            {
                "content": "dYNsw-I,W",
                "senderAddress": "0x1234",
            },
            {
                "content": "dYNsw-A,W",
                "senderAddress": "0x1234",
            },
        ]

        const results = loadGameHistory(messages, '0x1234');

        expect(results.invite).toBe(null);
        expect(results.accept).toBe(null);
    })

    it('Should not recognize own invites as accepts', () => {
        const messages = [
            {
                "content": "oPVKq-A1B1C1D1E1F1XXG1A2B2C3D2E2F3G2H2A8B8C8D8E8A3G8H8A6B7C7D5F4F7G7H7,B,TTTT",
                "senderAddress": "0x5678",
            },
            {
                "content": "oPVKq-A1B1C1D1E1F1XXG1A2B2C4D2E2F3G2H2A8B8C8D8E8A3G8H8A6B7C7D5F4F7G7H7,W,TTTT",
                "senderAddress": "0x1234",
            },
            {
                "content": "dYNsw-I,W",
                "senderAddress": "0x1234",
            },
            {
                "content": "dYNsw-A,W",
                "senderAddress": "0x1234",
            },
            {
                "content": "2sDJW-I,B",
                "senderAddress": "0x1234",
            }
        ]

        const results = loadGameHistory(messages, '0x1234');

        expect(results.invite.hash).toBe('2sDJW');
        expect(results.invite.color).toBe(PIECE_COLORS.BLACK);
        expect(results.accept).toBe(null);
    });

    it('Should recognize an accepted game and intialize the moves', () => {
        const messages = [
            {
                "content": "oPVKq-A1B1C1D1E1F1XXG1A2B2C3D2E2F3G2H2A8B8C8D8E8A3G8H8A6B7C7D5F4F7G7H7,B,TTTT",
                "senderAddress": "0x5678",
            },
            {
                "content": "oPVKq-A1B1C1D1E1F1XXG1A2B2C4D2E2F3G2H2A8B8C8D8E8A3G8H8A6B7C7D5F4F7G7H7,W,TTTT",
                "senderAddress": "0x1234",
            },
            {
                "content": "dYNsw-I,B",
                "senderAddress": "0x1234",
            },
            {
                "content": "dYNsw-A,W",
                "senderAddress": "0x5678",
            },
            {
                "content": "2sDJW-I,B",
                "senderAddress": "0x1234",
            }
        ];

        const results = loadGameHistory(messages, '0x1234');

        expect(results.invite).not.toBe(null);
        expect(results.invite.hash).toBe('2sDJW');
        expect(results.invite.color).toBe(PIECE_COLORS.BLACK);
        expect(results.accept).toBe(null);
        expect(results.load).not.toBe(null);
        expect(results.load.hash).toBe('dYNsw');
        expect(results.load.color).toBe(PIECE_COLORS.BLACK);
        expect(results.load.lastMove).toBe(moveNeg1);
        expect(results.load.currMove).toBe(move0);
    });

    it('Should recognize that a player accepted their own invite and should not allow a new game to load', () => {
        const messages = [
            {
                "content": "abcde-I,B",
                "senderAddress": "0x1234",
            },
            {
                "content": "dYNsw-I,W",
                "senderAddress": "0x5678",
            },
            {
                "content": "dYNsw-A,B",
                "senderAddress": "0x5678",
            },
            {
                "content": "2sDJW-I,B",
                "senderAddress": "0x1234",
            },
        ];

        const results = loadGameHistory(messages, '0x1234');

        expect(results.invite).not.toBe(null);
        expect(results.invite.hash).toBe('2sDJW');
        expect(results.invite.color).toBe(PIECE_COLORS.BLACK);
        expect(results.accept).toBe(null);
        expect(results.load).toBe(null);
    });

    it('Should recognize that a player accepted their own invite and should not allow a new game to load', () => {
        const messages = [
            {
                "content": "abcde-I,B",
                "senderAddress": "0x1234",
            },
            {
                "content": "dYNsw-I,W",
                "senderAddress": "0x1234",
            },
            {
                "content": "dYNsw-A,W",
                "senderAddress": "0x5678",
            },
            {
                "content": "2sDJW-I,B",
                "senderAddress": "0x5678",
            }
        ];

        const results = loadGameHistory(messages, '0x1234');

        expect(results.accept).not.toBe(null);
        expect(results.accept.hash).toBe('2sDJW');
        expect(results.accept.color).toBe(PIECE_COLORS.WHITE);
        expect(results.invite).toBe(null);
        expect(results.load).toBe(null);
    });

    it('Should not allow a loaded game with no accept', () => {
        const messages = [
            {
                "content": "abcde-I,B",
                "senderAddress": "0x1234",
            },
            {
                "content": "dYNsw-I,W",
                "senderAddress": "0x1234",
            },
            {
                "content": "2sDJW-I,B",
                "senderAddress": "0x5678",
            },
            {
                "content": "dYNsw-A1B1C1D1E1F1XXG1A2B2C3D2E2F3G2H2A8B8C8D8E8A3G8H8A6B7C7D5F4F7G7H7,B,TTTT",
                "senderAddress": "0x5678",
            }
        ];

        const results = loadGameHistory(messages, '0x1234');

        expect(results.accept).toBe(null);
        expect(results.invite).toBe(null);
        expect(results.load).toBe(null);
    })
});
