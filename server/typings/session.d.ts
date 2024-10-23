import { Document, Model, ObjectId } from "mongoose";

import { UserDocumentInterface } from "./user";

export interface SessionInterface {
  id: string;
  user_id: string;
  updated_at: Date;
  created_at: Date;
  access_token: string;
  refresh_token: string;
  user: UserDocumentInterface;
}

export interface SessionDocumentInterface extends Omit<SessionInterface, "user_id">, Document {
  _id: ObjectId;
  user_id: ObjectId;
}

export interface SessionModelInterface extends Model<SessionDocumentInterface> {}
