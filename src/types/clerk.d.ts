import 'express';
import { AuthObject } from '@clerk/clerk-sdk-node';

declare module 'express' {
  interface Request {
    auth?: AuthObject;
  }
}
