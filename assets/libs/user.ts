import type { LabelSaved } from "../models/label";
import type { ProjectSaved } from "../models/project";
import type { TodoSaved } from "../models/todo/todo";

type UserDoc = {
  projects: ProjectSaved[];
  labels: LabelSaved[];
  todos: TodoSaved[];
};

const DefaultUserDoc: UserDoc = {
  projects: [],
  labels: [],
  todos: [],
};

export { DefaultUserDoc };
export type { UserDoc };
