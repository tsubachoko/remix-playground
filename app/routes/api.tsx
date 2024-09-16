
import type {
  LoaderFunctionArgs,
} from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno

async function getUser(request: Request) {
  return {
    displayName: 'test user',
    email: 'test@example.com',
  }
}

export async function loader({
  request,
}: LoaderFunctionArgs) {
  console.log('loader /server-account');

  const user = await getUser(request);
  return json({
    displayName: user.displayName,
    email: user.email,
  });
}
