/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com',
      'vroomvroom-rents3.s3.amazonaws.com', // <-- Add this line
      'avatar.iran.liara.run'
    ],
  }
};

export default nextConfig;
