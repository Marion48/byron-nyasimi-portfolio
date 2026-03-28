import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET() {
  try {
    // Check what Vercel sees
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    console.log('Cloudinary check:', {
      cloudName,
      apiKeyExists: !!apiKey,
      apiSecretExists: !!apiSecret,
    });
    
    // Configure
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    
    // Test connection
    const result = await cloudinary.api.ping();
    
    return NextResponse.json({
      success: true,
      cloud_name: cloudinary.config().cloud_name,
      ping: result,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key_exists: !!process.env.CLOUDINARY_API_KEY,
      api_secret_exists: !!process.env.CLOUDINARY_API_SECRET,
    });
  }
}