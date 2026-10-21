export {};

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string | null;
      first_name: string | null;
      last_name: string | null;
    }
  }
}
