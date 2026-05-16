import { Injectable } from "@nestjs/common";

import { apiResponse } from "./common/utils/api-response.util";

@Injectable()
export class AppService {
  ping() {
    return apiResponse(null, "Server is up and running");
  }
}
