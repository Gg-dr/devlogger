import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Skill from '@/lib/models/Skill';

// PATCH update skill level
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
    
    const skill = await Skill.findOneAndUpdate(
      {
        _id: id,
        user: session.user.id,
      },
      { $set: body },
      { new: true }
    );

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE skill
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // AWAIT params
    const { id } = await params;
    
    const skill = await Skill.findOneAndDelete({
      _id: id,
      user: session.user.id,
    });

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}