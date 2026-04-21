"use server";

import configPromise from "@payload-config";
import { handleServerFunctions } from "@payloadcms/next/layouts";
import { importMap } from "./importMap.js";

import type { ServerFunctionArgs } from "payload";

export async function payloadServerFunction(
  args: ServerFunctionArgs,
): Promise<unknown> {
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  });
}
