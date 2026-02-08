import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Log from '@/lib/models/Log';

// PUT - Full update
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // AWAIT params
    const { id } = await params;
    
    const log = await Log.findOne({
      _id: id,
      user: session.user.id,
    });

    if (!log) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    const body = await request.json();
    Object.assign(log, body);
    await log.save();
    
    await log.populate('project');

    return NextResponse.json(log);
  } catch (error) {
    console.error('Error updating log:', error);
    return NextResponse.json(
      { error: 'Failed to update log' },
      { status: 500 }
    );
  }
}

// PATCH - Partial update
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // AWAIT params
    const { id } = await params;
    const body = await request.json();
    
    const log = await Log.findOneAndUpdate(
      {
        _id: id,
        user: session.user.id,
      },
      { $set: body },
      { new: true }
    ).populate('project');

    if (!log) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    return NextResponse.json(log);
  } catch (error) {
    console.error('Error patching log:', error);
    return NextResponse.json(
      { error: 'Failed to update log' },
      { status: 500 }
    );
  }
}

// DELETE log
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // AWAIT params
    const { id } = await params;
    
    const log = await Log.findOneAndDelete({
      _id: id,
      user: session.user.id,
    });

    if (!log) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error('Error deleting log:', error);
    return NextResponse.json(
      { error: 'Failed to delete log' },
      { status: 500 }
    );
  }
}