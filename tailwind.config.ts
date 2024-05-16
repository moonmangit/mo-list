import type { Config } from "tailwindcss";
import type { Config as DaisyUiConf } from "daisyui";
import daisyui from "daisyui";

export default <Partial<Config>>{
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [daisyui],
  daisyui: {
    themes: ["emerald"],
  } as DaisyUiConf,
};
