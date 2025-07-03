// import { NextRequest, NextResponse } from 'next/server';
// import { dbConnect } from '@/lib/dbConnect';
// import AdminModel from '../../../../models/admin';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { serialize } from 'cookie';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use env var in production

// export async function POST(req: NextRequest) {
//  // await dbConnect();

//   const { email, password } = await req.json();

//   // 1. Validate credentials
//   if (!email || !password) {
//     return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
//   }

//   const admin = await AdminModel.findOne({ email });

//   if (!admin) {
//     return NextResponse.json({ error: 'Invalid email or passwordss' }, { status: 401 });
//   }

//   const isMatch = await bcrypt.compare(password, admin.password);
//   if (!isMatch) {
//     return NextResponse.json({ error: 'Invalid email or passwords 123' }, { status: 401 });
//   }

//   // 2. Generate JWT
//   const token = jwt.sign(
//     { id: admin._id, email: admin.email },
//     JWT_SECRET,
//     { expiresIn: '7d' }
//   );

//   // 3. Set Secure HTTP-only Cookie
//   const cookie = serialize('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     path: '/',
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//   });

//   const res = NextResponse.json({ success: true, message: 'Logged in successfully' });
//   res.headers.set('Set-Cookie', cookie);

//   return res;
// }
