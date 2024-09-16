// 参考元: https://remix.run/docs/en/main/discussion/data-flow

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, Form, ClientLoaderFunction, ClientActionFunctionArgs } from "@remix-run/react";

async function getUser(request: Request) {
  return {
    displayName: 'test user',
    email: 'test@example.com',
  }
}

// SSR時、clientLoaderでserverLoaderを実行する場合に呼ばれる
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

// フロント側のナビゲーション時、action/clientAction実行後に呼ばれる
export const clientLoader: ClientLoaderFunction = async ({
  request,
  params,
  serverLoader,
}) => {
  console.log('clientLoader /account');

  // const user = await getUser(request);
  const user: any = await serverLoader(); // serverLoaderでloaderをサーバー側で実行する
  return {
    displayName: `${user.displayName} (client)`,
    email: `${user.email} (client)`,
  }
};

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

// フォーム送信時に呼ばれる
// clientAction定義時はserverActionを実行しなければ呼び出されない(直接POSTリクエストを送信すると呼ばれる)
export async function action({
  request,
}: ActionFunctionArgs) {
  console.log('action /account');

  const formData = await request.formData();
  console.log(Object.fromEntries(formData));

  return json({ ok: true });
}

// フォーム送信時に呼ばれる、actionよりも優先される
export async function clientAction({
  request,
  params,
  serverAction,
}: ClientActionFunctionArgs) {
  console.log('clientAction /client-account');

  const data = await serverAction();
  console.log(data);

  return data;
}
