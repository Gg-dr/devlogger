// app/api/health/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Test bcrypt
    const testPassword = 'test123';
    const hash = await bcrypt.hash(testPassword, 10);
    const match = await bcrypt.compare(testPassword, hash);
    
    // Test DB connection
    await connectDB();
    
    return NextResponse.json({
      status: 'healthy',
      bcrypt: {
        canHash: true,
        canCompare: match,
      },
      database: {
        connected: true,
      },
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}