import { EntityRepository, Repository } from "typeorm";
import { Auth } from "@/auth/entities/auth.entity";
import { AuthDto } from "@/auth/dto/auth.dto";

@EntityRepository(Auth)
export class AuthRepository extends Repository<Auth> {
  findUserByEmail(email: string): Promise<Auth> {
    return this.findOne({ where: { email } });
  }

  findUserById(userId: number): Promise<Auth> {
    return this.findOne(userId);
  }

  createUser(dto: AuthDto) {
    const user = this.create(dto);
    return this.save(user);
  }
}
