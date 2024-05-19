import { doc, runTransaction } from "firebase/firestore";
import { array, object, string, type InferType } from "yup";
import { createBaseRecord, type BaseRecord } from "~/assets/libs/model";
import type { UserDoc } from "~/assets/libs/user";
import type { UpdateJob } from "~/components/part/page/list/ToolsBar.vue";

// Saved
type Saved = {
  name: string;
  projectId: string;
  dueDate: string;
  labelIds: string[];
  status: "todo" | "doing" | "done";
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
    status: "todo",
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
  async updateStatus(jobs: UpdateJob[]) {
    const { db } = useNuxtApp().$fb;
    await runTransaction(db, async (tsc) => {
      const userDocRef = doc(db, `users/${useAuthStore().$state.data?.uid}`);
      const userDoc = (await tsc.get(userDocRef)).data() as UserDoc;
      const todos = userDoc.todos;
      jobs.forEach((job) => {
        const todo = todos.find((todo) => todo.id === job.tid);
        if (todo) todo.status = job.to;
      });
      tsc.set(userDocRef, userDoc);
    });
  },
  async clear(projectId?: string) {
    // if projectId is undefined, clear 'done' in all projects
    const { db } = useNuxtApp().$fb;
    await runTransaction(db, async (tsc) => {
      const userDocRef = doc(db, `users/${useAuthStore().$state.data?.uid}`);
      const userDoc = (await tsc.get(userDocRef)).data() as UserDoc;
      const todos = userDoc.todos;
      userDoc.todos = todos.filter((todo) => {
        if (projectId) {
          return todo.projectId !== projectId || todo.status !== "done";
        } else {
          return todo.status !== "done";
        }
      });
      tsc.set(userDocRef, userDoc);
    });
  },
};

export {
  model as todoModel,
  gotSchema as todoGotSchema,
  gotToSaved as todoGotToSaved,
  savedToGot as todoSavedToGot,
};
export type { Saved as TodoSaved, Got as TodoGot };
