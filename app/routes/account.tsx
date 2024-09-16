// 参考元: https://remix.run/docs/en/main/discussion/data-flow

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, Form } from "@remix-run/react";

async function getUser(request: Request) {
  return {
    displayName: 'test user',
    email: 'test@example.com',
  }
}

export async function loader({
  request,
}: LoaderFunctionArgs) {
  console.log('loader /account');

  const user = await getUser(request);
  return json({
    displayName: user.displayName,
    email: user.email,
  });
}

export default function Component() {
  console.log('component /account');

  const user = useLoaderData<typeof loader>();
  return (
    <Form method="post" action="/account" className="p-8">
      <h1>Settings for {user.displayName}</h1>

      <input
        name="displayName"
        defaultValue={user.displayName}
        className="rounded-md border border-gray-200 p-2"
      />
      <input
        name="email"
        defaultValue={user.email}
        className="rounded-md border border-gray-200 p-2 ml-2"
      />

      <button
        type="submit"
        className="rounded-md bg-gray-500 p-2 ml-2"
      >Save</button>
    </Form>
  );
}

export async function action({
  request,
}: ActionFunctionArgs) {
  console.log('action /account');

  const formData = await request.formData();
  const user = await getUser(request);

  // await updateUser(user.id, {
  //   email: formData.get("email"),
  //   displayName: formData.get("displayName"),
  // });

  return json({ ok: true });
}
