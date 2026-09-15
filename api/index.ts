import app, { setupPromise } from "../server/index";

export default async function handler(req: any, res: any) {
  await setupPromise;
  app(req, res);
}
