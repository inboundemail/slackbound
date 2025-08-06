import { defineNitroConfig } from 'nitropack/config';

// https://nitro.build/config
export default defineNitroConfig({
  compatibilityDate: 'latest',
  srcDir: 'app/server',
  imports: false,
});
