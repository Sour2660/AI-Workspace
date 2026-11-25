import User from "../../models/user.model";
import { RegisterInput } from "./auth.validation";

class AuthRepository {
  async findByEmail(email: string) {
    return User.findOne({
      email,
    });
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async create(data: RegisterInput & { password: string }) {
    return User.create(data);
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string
  ) {
    return User.findByIdAndUpdate(
      id,
      {
        refreshToken,
      },
      {
        new: true,
      }
    );
  }
}

export default new AuthRepository();