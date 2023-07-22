import { Request, Response, NextFunction, Router } from 'express';
import MessageService from './message.service';
import authenticatedMiddleware from '../../middlewares/authenticated.middleware';
import Controller from '../../utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptations/http.exception';

class MessageController implements Controller {
    public path = '/messages';
    public router = Router();
    private MessageService = new MessageService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.post(
            `${this.path}/new-message`,
            authenticatedMiddleware,
            this.newMessage
        );
    }

    private newMessage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { receiverId, message } = req.body;
            const response = await this.MessageService.sendMessage(
                req.user.id,
                receiverId,
                message
            );
            res.status(201).json(response);
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };
}

export default MessageController;
