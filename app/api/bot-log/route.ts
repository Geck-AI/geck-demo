import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface BotLogEntry {
  ip: string;
  userAgent: string;
  path: string;
  method?: string;
  createdAt: string;
}

const BOT_LOGS_FILE = path.join(process.cwd(), 'data', 'bot-logs.json');

function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readBotLogs(): BotLogEntry[] {
  ensureDataDirectory();
  if (!fs.existsSync(BOT_LOGS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(BOT_LOGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[bot-log] Error reading file:', error);
    return [];
  }
}

function writeBotLogs(logs: BotLogEntry[]) {
  try {
    ensureDataDirectory();
    const recent = logs.slice(-10000);
    fs.writeFileSync(BOT_LOGS_FILE, JSON.stringify(recent, null, 2));
  } catch (error) {
    console.warn('[bot-log] Failed to write file:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ip = typeof body.ip === 'string' ? body.ip.trim() : '';
    const userAgent = typeof body.userAgent === 'string' ? body.userAgent.trim() : '';
    const pathname = typeof body.path === 'string' ? body.path.trim() : '';
    const method = typeof body.method === 'string' ? body.method.trim().toUpperCase() || 'GET' : 'GET';

    if (!ip || !userAgent || !pathname) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: ip, userAgent, path' },
        { status: 400 }
      );
    }

    const logs = readBotLogs();
    logs.push({
      ip,
      userAgent,
      path: pathname,
      method,
      createdAt: new Date().toISOString(),
    });
    writeBotLogs(logs);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[bot-log] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const limit = Math.min(
      Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || '100', 10)),
      1000
    );
    const logs = readBotLogs();
    const recent = logs.slice(-limit).reverse();
    return NextResponse.json({ total: logs.length, logs: recent });
  } catch (error) {
    console.error('[bot-log] Error reading:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
