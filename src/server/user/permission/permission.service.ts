import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class PermissionService {

  constructor (
    // @InjectRepository()
  ) {
  }

  permissionByUser(userId: number) {



  }

}
