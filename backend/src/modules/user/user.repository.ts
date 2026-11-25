import User from "../../models/user.model";

class UserRepository {
  async findById(id: string) {
    return User.findById(id).select("-password -refreshToken");
  }
}

export default new UserRepository();