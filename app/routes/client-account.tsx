// 参考元: https://remix.run/docs/en/main/discussion/data-flow

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, Form, ClientLoaderFunction } from "@remix-run/react";

async function getUser(request: Request) {
  return {
    displayName: 'test user',
    email: 'test@example.com',
  }
}

export const clientLoader: ClientLoaderFunction = async ({
  request,
  params,
  serverLoader,
}) => {
  console.log('clientLoader /client-account');

  const user = await getUser(request);
  return {
    displayName: `${user.displayName} (client)`,
    email: `${user.email} (client)`,
  }
};

clientLoader.hydrate = true;

export function HydrateFallback() {
  return <p>Skeleton rendered during SSR</p>;
}

export default function Component() {
  console.log('component /client-account');

  const user = useLoaderData<typeof clientLoader>();
  return (
    <Form method="post" action="/client-account" className="p-8">
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

export async function clientAction({
  request,
}: ActionFunctionArgs) {
  console.log('clientAction /client-account');

  const formData = await request.formData();
  console.log(Object.fromEntries(formData));

  return { ok: true };
}
