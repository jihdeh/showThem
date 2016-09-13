import koa from "koa";
import forward from "koa-forward-request";
import mount from "koa-mount";
import log from "../util/log";
import Api from "./api";

import Frontend from "./frontend";

function App() {
  const app = koa();

  forward(app);
  app
    .use(mount("/", Frontend()))
    .use(mount("/api", Api()))

  return app;
}
export default App;
