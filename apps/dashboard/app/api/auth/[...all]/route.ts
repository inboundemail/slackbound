import { getAuth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  return getAuth().handler(req);
};

export const POST = async (req: NextRequest) => {
  return getAuth().handler(req);
};

