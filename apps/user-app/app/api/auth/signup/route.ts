import { NextResponse } from 'next/server';
import { prisma } from '@repo/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, number } = body;

    // Validate input
    if (!email || !name || !number) {
      return NextResponse.json(
        { error: 'Email, name, and phone number are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        number,
      },
    });

    // Return success without exposing sensitive user data
    return NextResponse.json(
      { success: true, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}