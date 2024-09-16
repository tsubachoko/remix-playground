// NOTE: clientLoaderのみでは正常に動作しないためエラーになる

import { ClientLoaderFunction } from "@remix-run/react";

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
