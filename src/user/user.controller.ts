import { Controller, Get, Put } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Controller('api/user')
export class UserController {

  constructor(private readonly usersService: UsersService) {}

  @Get()
  currentUser(){
    return this.usersService.currentUser();
  }

  @Put()
  updateUser() {
    return this.usersService.updateUser();
  }
}
