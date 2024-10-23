import { Document, Model, ObjectId } from "mongoose";

export interface LocationInterface {
  id: string;
  city: string;
  state: string;
  street: string;
  country: string;
  zipCode: string;
  address: string;
  created_at: Date;
  updated_at: Date;
}

export interface LocationDocumentInterface extends Omit<LocationInterface, "id">, Document {
  _id: ObjectId;
}

export interface LocationModelInterface extends Model<LocationDocumentInterface> {
  getRandomLocation: () => Promise<LocationDocumentInterface>;
}
