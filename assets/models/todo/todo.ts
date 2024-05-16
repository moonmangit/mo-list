import { object, string, type InferType } from "yup";
import { createBaseRecord, type BaseRecord } from "~/assets/libs/model";

// Saved
type Saved = {
  name: string;
} & BaseRecord;

// Got
const gotSchema = object({
  name: string().required(),
});
type Got = InferType<typeof gotSchema>;

// Convert
function gotToSaved(got: Got, bypass?: Partial<Saved>): Saved {
  return {
    ...createBaseRecord(),
    ...got,
    ...bypass,
  };
}
function savedToGot(saved: Saved, bypass?: Partial<Got>): Got {
  return {
    ...saved,
    ...bypass,
  };
}

// Model
const model = {
  create() {},
  update() {},
  delete() {},
};

export {
  model as todoModel,
  gotSchema as todoGotSchema,
  gotToSaved as todoGotToSaved,
  savedToGot as todoSavedToGot,
};
export type { Saved as TodoSaved, Got as TodoGot };
