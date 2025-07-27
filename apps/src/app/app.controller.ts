import { Controller, Post, Body, UnauthorizedException, UseGuards, Req, Get } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, AuthResponse } from '@minimal-mean-app/libs';
import { AuthGuard } from './auth.guard';

const USERS_FILE = path.join(__dirname, '../../assets/users.json');
const JWT_SECRET = 'secret';
const JWT_EXPIRES_IN = 8 * 60 * 60; // 8 hours in seconds

function readUsers(): User[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function writeUsers(users: User[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

@Controller()
export class AppController {
  @Post('signup')
  signup(@Body() body: { name: string; email: string; password: string }) {
    const users = readUsers();
    if (users.find(u => u.email === body.email)) {
      throw new UnauthorizedException('Email already exists');
    }
    const id = Date.now().toString();
    const hashed = bcrypt.hashSync(body.password, 10);
    const user: User = { id, name: body.name, email: body.email, password: hashed };
    users.push(user);
    writeUsers(users);
    return { message: 'Signup successful' };
  }

  @Post('signin')
  signin(@Body() body: { email: string; password: string }): AuthResponse {
    const users = readUsers();
    const user = users.find(u => u.email === body.email);
    if (!user || !bcrypt.compareSync(body.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const expiresAt = Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN;
    const token = jwt.sign({ sub: user.id, name: user.name, email: user.email, exp: expiresAt }, JWT_SECRET);
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
      expiresAt: expiresAt * 1000,
    };
  }

  @Post('forgot-password')
  forgot(@Body() body: { email: string }) {
    const users = readUsers();
    const user = users.find(u => u.email === body.email);
    if (user) {
      const resetLink = `https://example.com/reset-password?email=${encodeURIComponent(body.email)}&token=reset-token`;
      console.log('Password reset link:', resetLink);
    }
    return { message: 'If the email exists, a reset link was sent.' };
  }

  @Post('signout')
  signout() {
    return { message: 'Signout simulated. Client should clear token.' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return { id: req.user.sub, name: req.user.name, email: req.user.email, exp: req.user.exp };
  }
}
