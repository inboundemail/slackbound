import { createHandler } from '@vercel/slack-bolt';
import { eventHandler, readRawBody, getRequestURL } from 'h3';
import { app, receiver } from '../../../bolt/app';

const handler = createHandler(app, receiver);

export default eventHandler(async (event) => {
  // Get the raw body buffer for signature verification
  const rawBody = await readRawBody(event, false);
  
  // Get the full URL from the request
  const url = getRequestURL(event);
  
  // Create a Web Request with the raw body
  const request = new Request(url, {
    method: event.node.req.method,
    headers: event.node.req.headers as HeadersInit,
    body: rawBody,
  });
  
  return await handler(request);
});
