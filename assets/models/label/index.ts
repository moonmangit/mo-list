import { doc, runTransaction } from "firebase/firestore";
import { object, string, type InferType } from "yup";
import { createBaseRecord, type BaseRecord } from "~/assets/libs/model";
import type { UserDoc } from "~/assets/libs/user";

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
  async create(got: Got) {
    const { db } = useNuxtApp().$fb;
    const toSaved = gotToSaved(got);
    // Write doc
    await runTransaction(db, async (tsc) => {
      const userDocRef = doc(db, `users/${useAuthStore().$state.data?.uid}`);
      const userDoc = (await tsc.get(userDocRef)).data() as UserDoc;
      userDoc.labels.push(toSaved);
      tsc.set(userDocRef, userDoc);
    });
  },
  update() {},
  async delete(saved: Saved) {
    const { db } = useNuxtApp().$fb;
    // Write doc
    await runTransaction(db, async (tsc) => {
      const userDocRef = doc(db, `users/${useAuthStore().$state.data?.uid}`);
      const userDoc = (await tsc.get(userDocRef)).data() as UserDoc;
      const labelIndex = userDoc.labels.findIndex((p) => p.id === saved.id);
      if (labelIndex === -1) {
        throw new Error("Label not found");
      }
      // Delete label-key from todos
      userDoc.todos.map((t) => {
        return {
          ...t,
          labelIds: t.labelIds.filter((l) => l !== saved.id),
        };
      });
      // Delete label
      userDoc.labels.splice(labelIndex, 1);
      tsc.set(userDocRef, userDoc);
    });
  },
};

export {
  model as labelModel,
  gotSchema as labelGotSchema,
  gotToSaved as labelGotToSaved,
  savedToGot as labelSavedToGot,
};
export type { Saved as LabelSaved, Got as LabelGot };
