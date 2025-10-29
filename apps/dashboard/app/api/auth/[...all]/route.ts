import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  return auth.handler(req);
};

export const POST = async (req: NextRequest) => {
  return auth.handler(req);
};

