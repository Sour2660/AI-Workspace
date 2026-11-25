import userRepository from "./user.repository";
import AppError from "../../errors/AppError";

class UserService {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}

export default new UserService();