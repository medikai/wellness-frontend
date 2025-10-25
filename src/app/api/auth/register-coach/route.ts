import { registerWithRole } from "../lib/registerWithRole";
export async function POST(req: Request) {
  return registerWithRole(req, 'coach');
}
