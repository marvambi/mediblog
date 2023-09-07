import Res from "./responses";
import Codes from "./codes";
import Messages from "./messages";

const responses = new Res();
const messages = new Messages();
const codes = new Codes();

export const middlewares = {
  responses,
  messages,
  codes,
};