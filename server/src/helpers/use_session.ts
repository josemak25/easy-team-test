import httpContext from "express-http-context";

import { UserTokenType } from "typings/user";
import { SessionInterface } from "typings/session";

type SessionReturnType = UserTokenType &
  SessionInterface & {
    session: SessionInterface;
    setSession: (record: Record<string, any>) => void;
  };

/**
 *
 * @description A function that helps get user session
 * @function useSession
 * @returns SessionReturnType
 */

let payload = {};

export const useSession = (): SessionReturnType => {
  const session = httpContext.get("session");

  const setSession = (record: Record<string, any>) => {
    httpContext.set("session", record);
    payload = { ...session, ...record };
  };

  return { ...session, ...payload, setSession };
};
