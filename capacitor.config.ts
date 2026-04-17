import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.serviko.app",
  appName: "Serviko",
  webDir: "public",
  server: {
    url: "https://serviko.dev",
    cleartext: true,
  },
};

export default config;
