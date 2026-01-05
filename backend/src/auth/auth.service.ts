import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signup(dto: SignupDto) {
    const user = await this.usersService.create(dto);

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(user.email, user.verificationToken);
    } catch (error) {
      console.log('Email sending failed:', error.message);
    }

    const token = this.generateToken(user._id.toString(), user.email);

    return {
      user: { id: user._id, name: user.name, email: user.email, isEmailVerified: false },
      accessToken: token,
      message: 'Please check your email to verify your account',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.usersService.comparePassword(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user._id.toString(), user.email);

    return {
      user: { id: user._id, name: user.name, email: user.email, isEmailVerified: user.isEmailVerified },
      accessToken: token,
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.verifyEmail(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    return { message: 'Email verified successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { id: user._id, name: user.name, email: user.email, isEmailVerified: user.isEmailVerified };
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
