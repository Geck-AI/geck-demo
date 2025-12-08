import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface CorrectionSubmission {
  type: string;
  url: string;
  description: string;
  correctInformation?: string;
  name?: string;
  email?: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

const CORRECTIONS_FILE = path.join(process.cwd(), 'data', 'corrections.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read corrections from file
function readCorrections(): CorrectionSubmission[] {
  ensureDataDirectory();
  if (!fs.existsSync(CORRECTIONS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(CORRECTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading corrections file:', error);
    return [];
  }
}

// Write corrections to file
function writeCorrections(corrections: CorrectionSubmission[]) {
  ensureDataDirectory();
  fs.writeFileSync(CORRECTIONS_FILE, JSON.stringify(corrections, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, url, description, correctInformation, name, email } = body;

    // Validate required fields
    if (!type || !url || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: type, url, and description are required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Create correction submission
    const correction: CorrectionSubmission = {
      type,
      url,
      description,
      correctInformation: correctInformation || '',
      name: name || '',
      email: email || '',
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    // Read existing corrections
    const corrections = readCorrections();
    
    // Add new correction
    corrections.push(correction);
    
    // Write back to file
    writeCorrections(corrections);

    return NextResponse.json({
      success: true,
      message: 'Correction submitted successfully',
      id: corrections.length - 1,
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing correction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const corrections = readCorrections();
    
    // Return only pending and reviewed corrections (not resolved ones for privacy)
    const activeCorrections = corrections.filter(c => c.status !== 'resolved');
    
    return NextResponse.json({
      corrections: activeCorrections,
      total: activeCorrections.length,
    });
  } catch (error) {
    console.error('Error reading corrections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

