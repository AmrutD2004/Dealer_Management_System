declare namespace Express {
  export interface Request {
    user: {
      puId: number;
      puRole: string;
      // tenantId : number
    };
  }
}