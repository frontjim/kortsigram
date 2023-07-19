import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import UserController from './resources/users/user.controller';
import PostController from './resources/posts/post.controller';
import CommentController from './resources/comments/comment.controller';
import ConversationController from './resources/conversations/conversation.controller';

validateEnv();

const app = new App(
    [
        new UserController(),
        new PostController(),
        new CommentController(),
        new ConversationController(),
    ],
    Number(process.env.PORT)
);
app.listen();
