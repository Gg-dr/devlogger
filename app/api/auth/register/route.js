import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, password } = body;
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create and save user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    
    // Return response without password
    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}