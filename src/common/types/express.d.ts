import { RequestUser } from './request-user.type';

declare module 'express-serve-static-core' {
  interface Request {
    user?: RequestUser;
  }
}
