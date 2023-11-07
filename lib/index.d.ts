import { DefaultSession } from "next-auth";

declare module "ms" {
  export default function (val: number): number;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
}
