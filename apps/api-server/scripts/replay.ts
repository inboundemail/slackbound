import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Replay saved inbound webhook requests for testing
 *
 * Usage:
 *   pnpm tsx scripts/replay.ts                    # Replay the most recent request
 *   pnpm tsx scripts/replay.ts request-xyz.json   # Replay a specific request
 *   pnpm tsx scripts/replay.ts --list             # List all saved requests
 */

const REQUESTS_DIR = join(process.cwd(), '.data', 'requests');
const SERVER_URL = process.env.PUBLIC_URL || 'http://localhost:3000';

async function listRequests() {
  try {
    const files = await readdir(REQUESTS_DIR);
    const jsonFiles = files.filter((f) => f.endsWith('.json')).sort().reverse();

    if (jsonFiles.length === 0) {
      console.log('No saved requests found in .data/requests/');
      console.log('Set LOCAL_DEV=true in inbound.post.ts to start saving requests.');
      return;
    }

    console.log(`\n📁 Found ${jsonFiles.length} saved request(s):\n`);
    for (const file of jsonFiles) {
      console.log(`  ${file}`);
    }
    console.log('');
  } catch (error) {
    console.error('Error listing requests:', error);
    process.exit(1);
  }
}

async function getLatestRequest(): Promise<string | null> {
  try {
    const files = await readdir(REQUESTS_DIR);
    const jsonFiles = files.filter((f) => f.endsWith('.json')).sort().reverse();

    if (jsonFiles.length === 0) {
      return null;
    }

    return jsonFiles[0];
  } catch (error) {
    return null;
  }
}

async function replayRequest(filename: string) {
  try {
    const filepath = join(REQUESTS_DIR, filename);
    const content = await readFile(filepath, 'utf-8');
    const payload = JSON.parse(content);

    console.log(`\n🔄 Replaying request: ${filename}`);
    console.log(`📧 Email ID: ${payload.email?.id || 'unknown'}`);
    console.log(`📬 Subject: ${payload.email?.subject || '(No Subject)'}`);
    console.log(`👤 From: ${payload.email?.from?.addresses?.[0]?.name || payload.email?.from?.addresses?.[0]?.address || 'unknown'}\n`);

    const url = `${SERVER_URL}/api/inbound`;
    console.log(`📤 Sending POST to: ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`\n📡 Response status: ${response.status} ${response.statusText}`);

    const responseData = await response.json();
    console.log('\n📦 Response data:');
    console.log(JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('\n✅ Request replayed successfully!');
    } else {
      console.error('\n❌ Request failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error replaying request:', error);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);

  // Handle --list flag
  if (args.includes('--list') || args.includes('-l')) {
    await listRequests();
    return;
  }

  // Get filename from args or use latest
  let filename = args[0];

  if (!filename) {
    console.log('No filename provided, using most recent request...');
    filename = await getLatestRequest();

    if (!filename) {
      console.error('\n❌ No saved requests found in .data/requests/');
      console.error('Set LOCAL_DEV=true in inbound.post.ts to start saving requests.\n');
      process.exit(1);
    }
  }

  // Ensure filename has .json extension
  if (!filename.endsWith('.json')) {
    filename = `${filename}.json`;
  }

  await replayRequest(filename);
}

main();
