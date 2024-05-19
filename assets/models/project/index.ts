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
      userDoc.projects.push(toSaved);
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
      const projectIndex = userDoc.projects.findIndex((p) => p.id === saved.id);
      if (projectIndex === -1) {
        throw new Error("Project not found");
      }
      // Delete todo that belongs to this project
      userDoc.todos = userDoc.todos.filter(
        (todo) => todo.projectId !== saved.id,
      );
      // Delete project
      userDoc.projects.splice(projectIndex, 1);
      tsc.set(userDocRef, userDoc);
    });
  },
};

export {
  model as projectModel,
  gotSchema as projectGotSchema,
  gotToSaved as projectGotToSaved,
  savedToGot as projectSavedToGot,
};
export type { Saved as ProjectSaved, Got as ProjectGot };
