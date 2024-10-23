import omit from "lodash/omit";
import { model, Schema } from "mongoose";

import config from "@app/config";
import { SessionDocumentInterface, SessionModelInterface } from "typings/session";

const SessionSchema = new Schema<SessionDocumentInterface>(
  {
    access_token: { type: Schema.Types.String, default: null },

    refresh_token: { type: Schema.Types.String, default: null },

    user_id: { type: Schema.Types.ObjectId, unique: true, required: true, ref: "user" },

    created_at: {
      default: Date.now(),
      type: Schema.Types.Date,
      expires: config.REFRESH_TOKEN_EXPIRY,
    },
  },

  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

/**
 * methods
 */
SessionSchema.methods = {
  toJSON() {
    const { _id: id, ...rest } = omit(this.toObject(), "__v");
    return { ...rest, id: String(id) };
  },
};

export default <SessionModelInterface>model<SessionDocumentInterface>("session", SessionSchema);
