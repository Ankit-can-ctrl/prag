import { Controller, Post, Body, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // Mock Google login - uses predefined test user
  @Get('google')
  async googleLogin() {
    return this.authService.mockOAuthLogin('google');
  }

  // Mock Facebook login - uses predefined test user
  @Get('facebook')
  async facebookLogin() {
    return this.authService.mockOAuthLogin('facebook');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.userId);
  }
}
