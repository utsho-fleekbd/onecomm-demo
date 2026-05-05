import * as bcrypt from "bcryptjs";

bcrypt.hash("Admin@8080", 10).then(console.log);
