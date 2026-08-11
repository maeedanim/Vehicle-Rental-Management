import { comparePassword } from '../utils/password.js';
import { generateAccessToken } from '../utils/jwt.js';
import type {
  LoginRequest,
  LoginResponse,
} from '../types/auth.types.js';
import type { StaffRepository } from '../repositories/staff.repository.js';

export class AuthService {
  constructor(private readonly staffRepository: StaffRepository) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const staff = await this.staffRepository.findByEmail(credentials.email);

    if (!staff) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const passwordMatches = await comparePassword(
      credentials.password,
      staff.password_hash,
    );

    if (!passwordMatches) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const accessToken = generateAccessToken({
      sub: staff.id,
      email: staff.email,
      name: staff.name,
    });

    return {
      accessToken,
    };
  }
}