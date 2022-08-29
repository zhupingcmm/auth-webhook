import express from 'express';
import bodyParser from 'body-parser';
import { initLog, logFactory } from './log-config.js';
import { SERVER_PORT } from './config.js';
import compression from "compression";
import { Octokit } from '@octokit/core';
import fetch, {RequestInit} from 'node-fetch';
import { config } from 'process';

interface Config extends RequestInit {}
const log = logFactory("startup");
const octokit = new Octokit({ auth: `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`});
const start =() => {
    initLog();
    const app = express();
    
    app.use(bodyParser.json());
    app.use(compression());

    app.use('/', async (req, res, next) => {
        try {
            log.info('request info:', req.query, req.url, req.body);
            const customerConfig:Config = {
                method: 'GET',
                headers: {'Accept': 'application/vnd.github+json', 'Authorization': 'token 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'},
            }
            const response = await fetch('https://api.github.com/user', {...customerConfig});
            req.send(await response.json());
            next();
        } catch(e) {
            log.error('failed to get userinfo form github %s', e);
            res.status(500).send('failed to get userinfo form github')
        }
    })


    app.listen(SERVER_PORT, () => {
        log.info(`server is running on http://localhost:${SERVER_PORT}`);
      });
}

start();