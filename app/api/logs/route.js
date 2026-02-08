import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Log from '@/lib/models/Log';

// GET all logs
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const project = searchParams.get('project');
    const limit = searchParams.get('limit');

    const filter = { user: session.user.id };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    if (project) {
      filter.project = project;
    }

    const query = Log.find(filter).sort({ date: -1 });

    if (limit) {
      query.limit(parseInt(limit));
    }

    const logs = await query.populate('project');
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

// POST create new log
// POST create new log
export async function POST(request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      await connectDB();
  
      const body = await request.json();
      
      // Handle project field - if empty string, set to null/undefined
      let projectId = body.project;
      if (projectId === '' || projectId === null || projectId === undefined) {
        projectId = null; // Set to null instead of empty string
      }
  
      const logData = {
        user: session.user.id,
        date: body.date ? new Date(body.date) : new Date(),
        hours: parseFloat(body.hours) || 0,
        description: body.description || '',
        project: projectId, // Use the cleaned projectId
        mood: body.mood || 'productive',
        tags: body.tags || [],
      };
  
      const log = new Log(logData);
      await log.save();
      
      // Only populate if project exists
      if (projectId) {
        await log.populate('project');
      }
  
      return NextResponse.json(log, { status: 201 });
    } catch (error) {
      console.error('Error creating log:', error);
      return NextResponse.json(
        { error: 'Failed to create log: ' + error.message },
        { status: 500 }
      );
    }
  }