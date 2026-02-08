import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';

// GET single project
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // AWAIT params
    const { id } = await params;
    
    const project = await Project.findOne({
      _id: id,
      user: session.user.id,
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT update project
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // AWAIT params
    const { id } = await params;
    const body = await request.json();
    
    const project = await Project.findOneAndUpdate(
      {
        _id: id,
        user: session.user.id,
      },
      body,
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE project
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // AWAIT params
    const { id } = await params;
    
    const project = await Project.findOneAndDelete({
      _id: id,
      user: session.user.id,
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}