import { createTestXMTPMessage } from "../../tools";
import { hasHash, getHash, getContent, filterMessages, isHashContent, isConnectStatus } from "../../../src/utils/message/message";

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
