import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb';
import User from './models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password required');
          }

          await connectDB();
          
          // Find user
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('No user found');
          }

          // Compare password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid password');
          }

          // Return user object
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Auth error:', error.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
};