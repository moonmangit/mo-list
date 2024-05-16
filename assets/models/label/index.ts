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
  model as labelModel,
  gotSchema as labelGotSchema,
  gotToSaved as labelGotToSaved,
  savedToGot as labelSavedToGot,
};
export type { Saved as LabelSaved, Got as LabelGot };
