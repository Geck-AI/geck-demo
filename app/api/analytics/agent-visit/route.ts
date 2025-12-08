import { NextRequest, NextResponse } from 'next/server';
import { detectAgent } from '@/lib/agentDetection';
import fs from 'fs';
import path from 'path';

interface AgentVisit {
  timestamp: string;
  agentName: string;
  agentType: string;
  userAgent: string;
  url: string;
  ip?: string;
  referer?: string;
  country?: string;
}

const AGENT_VISITS_FILE = path.join(process.cwd(), 'data', 'agent-visits.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read agent visits from file
function readAgentVisits(): AgentVisit[] {
  ensureDataDirectory();
  if (!fs.existsSync(AGENT_VISITS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(AGENT_VISITS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading agent visits file:', error);
    return [];
  }
}

// Write agent visits to file
function writeAgentVisits(visits: AgentVisit[]) {
  ensureDataDirectory();
  // Keep only last 10,000 visits to prevent file from growing too large
  const recentVisits = visits.slice(-10000);
  fs.writeFileSync(AGENT_VISITS_FILE, JSON.stringify(recentVisits, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, userAgent, referer, ip, country } = body;

    if (!userAgent || !url) {
      return NextResponse.json(
        { error: 'Missing required fields: userAgent and url are required' },
        { status: 400 }
      );
    }

    const agent = detectAgent(userAgent);

    // Only log if it's an agent (not human)
    if (!agent.isAgent) {
      return NextResponse.json({
        success: true,
        message: 'Not an agent, not logged',
        agent: agent.name,
      });
    }

    const visit: AgentVisit = {
      timestamp: new Date().toISOString(),
      agentName: agent.name,
      agentType: agent.type,
      userAgent,
      url,
      ip: ip || undefined,
      referer: referer || undefined,
      country: country || undefined,
    };

    // Read existing visits
    const visits = readAgentVisits();
    
    // Add new visit
    visits.push(visit);
    
    // Write back to file
    writeAgentVisits(visits);

    return NextResponse.json({
      success: true,
      message: 'Agent visit logged',
      agent: {
        name: agent.name,
        type: agent.type,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing agent visit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const visits = readAgentVisits();
    const searchParams = request.nextUrl.searchParams;
    const agentName = searchParams.get('agent');
    const agentType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    let filteredVisits = visits;

    // Filter by agent name
    if (agentName) {
      filteredVisits = filteredVisits.filter(v => v.agentName === agentName);
    }

    // Filter by agent type
    if (agentType) {
      filteredVisits = filteredVisits.filter(v => v.agentType === agentType);
    }

    // Get statistics
    const stats = {
      total: visits.length,
      filtered: filteredVisits.length,
      byAgent: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      recent: filteredVisits.slice(-limit),
    };

    // Count by agent
    visits.forEach(visit => {
      stats.byAgent[visit.agentName] = (stats.byAgent[visit.agentName] || 0) + 1;
    });

    // Count by type
    visits.forEach(visit => {
      stats.byType[visit.agentType] = (stats.byType[visit.agentType] || 0) + 1;
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error reading agent visits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

