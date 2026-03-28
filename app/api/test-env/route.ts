import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ADMIN_EMAIL_exists: !!process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD_HASH_exists: !!process.env.ADMIN_PASSWORD_HASH,
    ADMIN_EMAIL_value: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD_HASH_length: process.env.ADMIN_PASSWORD_HASH?.length,
    NODE_ENV: process.env.NODE_ENV
  });
}