import { doc, runTransaction } from "firebase/firestore";
import { array, object, string, type InferType } from "yup";
import { createBaseRecord, type BaseRecord } from "~/assets/libs/model";
import type { UserDoc } from "~/assets/libs/user";

// Saved
type Saved = {
  name: string;
  projectId: string;
  dueDate: string;
  labelIds: string[];
} & BaseRecord;

// Got
const gotSchema = object({
  name: string().required(),
  projectId: string(),
  dueDate: string(),
  labelIds: array().of(string().required()),
});
type Got = InferType<typeof gotSchema>;

// Convert
function gotToSaved(got: Got, bypass?: Partial<Saved>): Saved {
  return {
    labelIds: got.labelIds || [],
    dueDate: got.dueDate || "",
    projectId: got.projectId || "",
    name: got.name,
    ...createBaseRecord(),
    ...bypass,
  };
}
function savedToGot(saved: Saved, bypass?: Partial<Got>): Got {
  return {
    labelIds: saved.labelIds,
    name: saved.name,
    dueDate: saved.dueDate,
    projectId: saved.projectId,
    ...bypass,
  };
}

// Model
const model = {
  async create(got: Got) {
    const { db } = useNuxtApp().$fb;
    const toSaved = gotToSaved(got);
    // Write doc
    await runTransaction(db, async (tsc) => {
      const userDocRef = doc(db, `users/${useAuthStore().$state.data?.uid}`);
      const userDoc = (await tsc.get(userDocRef)).data() as UserDoc;
      userDoc.todos.push(toSaved);
      tsc.set(userDocRef, userDoc);
    });
  },
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
