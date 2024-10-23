import { Schema, model } from "mongoose";
import { faker } from "@faker-js/faker";

import { LocationDocumentInterface, LocationModelInterface } from "typings/location";

const LocationSchema = new Schema<LocationDocumentInterface>(
  {
    city: {
      trim: true,
      minlength: 1,
      required: true,
      lowercase: true,
      type: Schema.Types.String,
    },

    state: {
      trim: true,
      minlength: 1,
      required: true,
      lowercase: true,
      type: Schema.Types.String,
    },

    street: {
      trim: true,
      minlength: 1,
      required: true,
      lowercase: true,
      type: Schema.Types.String,
    },

    country: {
      trim: true,
      minlength: 1,
      required: true,
      lowercase: true,
      type: Schema.Types.String,
    },

    zipCode: {
      trim: true,
      minlength: 1,
      required: true,
      lowercase: true,
      type: Schema.Types.String,
    },

    address: {
      trim: true,
      minlength: 1,
      required: true,
      lowercase: true,
      type: Schema.Types.String,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

/**
 * statics
 */
LocationSchema.statics = {
  async getRandomLocation() {
    // Get a random location on user signup
    let [location] = await this.aggregate<LocationDocumentInterface>([{ $sample: { size: 1 } }]);

    // If no locations available create 2 location
    if (!location) {
      const payloads = [{}, {}].map(() => ({
        city: faker.location.city(),
        state: faker.location.state(),
        street: faker.location.street(),
        country: faker.location.country(),
        zipCode: faker.location.zipCode(),
        address: faker.location.streetAddress(),
      }));

      const locations = await this.create(...payloads);

      // assign a the first new location to the random empty location
      location = locations[0];
    }

    return location;
  },
};

export default <LocationModelInterface>model<LocationDocumentInterface>("location", LocationSchema);
