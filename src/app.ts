import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import Controller from './utils/interfaces/controller.interface';
import errorMiddleware from './middlewares/error.middleware';
import { createServer } from 'http';
import Websocket from './utils/Websocket/websocket';
import MessagesSocket from './utils/Websocket/message.websocket';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initialiseDatabaseConnection();
        this.initialiseMiddlewares();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseMiddlewares(): void {
        this.express.use(cors());
        this.express.use(helmet());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(cookieParser());
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private async initialiseDatabaseConnection(): Promise<void> {
        //initialise MONGODB
        const { MONGO_URL } = process.env;
        mongoose.connect(`${MONGO_URL}`);
        const db = mongoose.connection;
        db.on('error', (err) => {
            console.log(err);
        });
        db.once('connected', () => {
            console.log('----Database Connected----\n');
        });
    }

    private initialiseErrorHandling(): void {
        this.express.use(errorMiddleware);
    }

    public listen(): void {
        const server = createServer(this.express);
        const io = Websocket.getInstance(server);
        io.initialiseHandlers([
            { path: 'api/messages', handler: new MessagesSocket() },
        ]);
        server.listen(this.port, () => {
            console.log(`Server running on port -> ${this.port}`);
        });
    }
}

export default App;
