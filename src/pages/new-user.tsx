import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";
import { redirect, type SetType } from "../lib";

export const newUser = new Elysia()
  .use(ctx)
  .get("/new-user", async ({ html, session, set, headers }) => {
    if (!session) {
      redirect(
        {
          set: set as SetType,
          headers,
        },
        "/login",
      );

      return;
    }

    return html(() => (
      <BaseHtml>
        <div>
          <h1 safe>New User</h1>
          <p>Do you want to join or create an Org?</p>
        </div>
      </BaseHtml>
    ));
  });
