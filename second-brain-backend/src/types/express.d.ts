import "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        userName: string;
      };
      user1:{
        id:string
      }
    }
  }
}

export {};
