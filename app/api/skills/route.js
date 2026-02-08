import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Skill from '@/lib/models/Skill';

// GET all skills
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const skills = await Skill.find({ user: session.user.id });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST create skill
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const skill = new Skill({
      ...body,
      user: session.user.id,
    });
    await skill.save();
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}