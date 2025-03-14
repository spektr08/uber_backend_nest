import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ClerkMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    return ClerkExpressWithAuth()(req  as any, res  as any, next);
  }
}
