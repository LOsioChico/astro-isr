/// <reference types="astro/client" />

declare namespace App {
  interface Locals extends Runtime {
    runtime: {
      env: Env;
      cf: CfProperties;
      ctx: ExecutionContext;
      caches: {
        default: Cache;
      };
    };
  }
}
