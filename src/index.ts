import express from 'express';
import bodyParser from 'body-parser';
import { initLog, logFactory } from './log-config.js';
import { SERVER_PORT } from './config.js';
import compression from "compression";
import { Octokit } from '@octokit/core';
const log = logFactory("startup");
const octokit = new Octokit({ auth: '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'});
const start =() => {
    initLog();
    const app = express();
    
    app.use(bodyParser.json());
    app.use(compression());

    app.use('/', async (req, res, next) => {
        try {
            const {data} = await octokit.request("/user");
            log.info('Success get userinfo from github', data);
            req.send(data);
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