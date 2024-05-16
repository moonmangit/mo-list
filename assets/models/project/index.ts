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
  model as projectModel,
  gotSchema as projectGotSchema,
  gotToSaved as projectGotToSaved,
  savedToGot as projectSavedToGot,
};
export type { Saved as ProjectSaved, Got as ProjectGot };
