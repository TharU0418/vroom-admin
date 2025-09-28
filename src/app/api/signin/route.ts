// src/app/api/signin/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Simple hardcoded check
    if (email === 'adminvroomvroom@gmail.com' && password === 'Qwer4321@') {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        email,
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
