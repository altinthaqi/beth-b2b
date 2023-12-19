import { unlinkSync } from "fs";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export function getTenantDb({
  dbName,
  authToken,
}: {
  dbName: string;
  authToken: string;
}) {
  const fullUrl = `libsql://${dbName}-altinthaqi.turso.io`;

  const tenantClient = createClient({
    url: fullUrl,
    authToken,
  });

  const tenantDb = drizzle(tenantClient, { schema, logger: true });

  return {
    tenantClient,
    tenantDb,
  };
}

export async function pushToTenantDb({
  dbName,
  authToken,
  input,
}: {
  dbName: string;
  authToken: string;
  input?: boolean;
}) {
  const tempConfigPath = "./src/db/tenant/drizzle.config.ts";

  const configText = `
  export default {
    schema: "./src/db/tenant/schema/index.ts",
    driver: "turso",
    dbCredentials:{
      url: "libsql://${dbName}-altinthaqi.turso.io",
      authToken: "${authToken}",
    },
    },
    tablesFilter: ["!libsql_wasm_func_table"],
  } satisfies Config;
  `;

  await Bun.write(tempConfigPath, configText);

  return new Promise((resolve, reject) => {
    Bun.spawn(
      ["bunx", "drizzle-kit", "push-sqlite", `--config=${tempConfigPath}`],
      {
        stdiout: input ? "inherit" : undefined,
        stdin: input ? "inherit" : undefined,
        onExit(_, code, __, error) {
          unlinkSync(tempConfigPath);
          if (code === 0) {
            resolve(void 0);
          } else {
            console.error("error pushing to tenant db");
            reject(error);
          }
        },
      },
    );
  });
}
