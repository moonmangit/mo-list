const appDocPath = "apps/setting"; // filestore path

type AppSettingDoc = {
  todo: {
    maxItem: number;
    maxChars: number;
  };
  project: {
    maxItem: number;
    maxTodo: number;
    maxChars: number;
  };
  label: {
    maxItem: number;
    maxChars: number;
  };
};

const defaultAppSettingDoc: AppSettingDoc = {
  label: {
    maxChars: 20,
    maxItem: 10,
  },
  project: {
    maxChars: 20,
    maxItem: 10,
    maxTodo: 10,
  },
  todo: {
    maxChars: 20,
    maxItem: 10,
  },
};

export { appDocPath, defaultAppSettingDoc };
export type { AppSettingDoc };
