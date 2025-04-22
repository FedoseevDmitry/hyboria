import Discord from 'next-auth/providers/discord'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default {
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord.default({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
  
    async jwt({ token, user }) {
      // В token храним только id пользователя
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  
    async session({ session, token }) {
      // Извлекаем информацию о пользователе из базы данных при каждом запросе сессии
      const user = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { id: true, name: true, email: true, role: true, created_at: true }
      });
  
      if (session.user && user) {
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.role = user.role || 'user';  // Обновляем роль
        session.user.created_at = user.created_at;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.AUTH_SECRET
}
