import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import { fileURLToPath } from 'url'
const __filenameNew = fileURLToPath(import.meta.url)
const __dirnameNew = path.dirname(__filenameNew)

import express from 'express';
const app = express();
const server = app.listen('8080');
//import { getAllTweets } from './database/controllers/twitter.js'



describe("Pact Verification", () => {
    it("validates the expectations of ProductService", () => {
        const opts = {
            logLevel: "INFO",
            providerBaseUrl: "http://localhost:8080",
            provider: "MyProvider",
            providerVersion: "1.0.0",
            pactUrls: [
                path.resolve(__dirnameNew, '../pacts/MyConsumer-MyProvider.json')
            ]
        };

        return new Verifier(opts).verifyProvider().then(output => {
            console.log(output);
        }).finally(() => {
            server.close();
        });
    })
});