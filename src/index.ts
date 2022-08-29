import express from 'express';
import bodyParser from 'body-parser';
import { initLog, logFactory } from './log-config.js';
import { SERVER_PORT } from './config.js';
import compression from "compression";
import { Octokit } from '@octokit/core';
const log = logFactory("startup");

const start =() => {
    initLog();
    const app = express();
    
    app.use(bodyParser.json());
    app.use(compression());

    app.use('/authenticate', async (req, res, next) => {
        const octokit = new Octokit({ auth: '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'});
        log.info('request::', req.headers);
        try {
            const {data: {name}} = await octokit.request("/user");
            log.info('Success get userinfo from github', name);
            res.send({
                "apiVersion": "authentication.k8s.io/v1beta1",
                "kind":       "TokenReview",
                "status":     {
                    'Authenticated': true,
                    'User': {
                        'Username': name,
                        'UID': name
                    }
                },
         
            });
            next();
        } catch(e) {
            log.error('failed to get userinfo form github %s', e);
            res.json({
                "apiVersion": "authentication.k8s.io/v1beta1",
				"kind":       "TokenReview",
				"status": {
					"Authenticated": false
				},
            });
        }
    })


    app.listen(SERVER_PORT, () => {
        log.info(`server is running on http://localhost:${SERVER_PORT}`);
      });
}

start();