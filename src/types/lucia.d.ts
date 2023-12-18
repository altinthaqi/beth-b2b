/// <reference types="lucia" />
declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Auth = import("../auth/index").Auth;
  interface DatabaseUserAttributes {
    name: string;
    picture: string;
    email?: string | null;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DatabaseSessionAttributes {}
}
