import { eventHandler, getRouterParam, sendStream, createError } from 'h3';
import { createReadStream, existsSync } from 'node:fs';
import { join } from 'node:path';
import { stat } from 'node:fs/promises';

/**
 * Serve attachment files from local storage
 * GET/HEAD /api/attachment/[id].[extension]
 *
 * HEAD requests are used by Slack to validate images before downloading
 */
export default eventHandler(async (event) => {
  let path = getRouterParam(event, 'path');

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path parameter is required',
    });
  }

  // Decode URL-encoded characters (spaces, special chars, etc.)
  // getRouterParam may not fully decode catch-all routes
  path = decodeURIComponent(path);

  console.log(`[ATTACHMENT] 📎 Request for: ${path}`);

  // Get the file path from .data/attachments
  const attachmentPath = join(process.cwd(), '.data', 'attachments', path);
  console.log(`[ATTACHMENT] 📂 Full path: ${attachmentPath}`);

  // Check if file exists
  if (!existsSync(attachmentPath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Attachment not found',
    });
  }

  // Get file stats for content-length
  const fileStat = await stat(attachmentPath);

  // Determine content type based on extension
  const extension = path.split('.').pop()?.toLowerCase();
  const contentTypeMap: Record<string, string> = {
    // Images
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text
    txt: 'text/plain',
    csv: 'text/csv',
    // Archives
    zip: 'application/zip',
    tar: 'application/x-tar',
    gz: 'application/gzip',
  };

  const contentType = extension ? contentTypeMap[extension] || 'application/octet-stream' : 'application/octet-stream';

  // Set response headers
  event.node.res.setHeader('Content-Type', contentType);
  event.node.res.setHeader('Content-Length', fileStat.size);
  event.node.res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  event.node.res.setHeader('Accept-Ranges', 'bytes');

  // Handle HEAD requests (Slack validates images with HEAD before downloading)
  if (event.method === 'HEAD') {
    event.node.res.statusCode = 200;
    event.node.res.end();
    return;
  }

  // Stream the file for GET requests
  const fileStream = createReadStream(attachmentPath);
  return sendStream(event, fileStream);
});
