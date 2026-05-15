import { storage } from "./server/storage";
import bcrypt from "bcryptjs";

async function updatePassword() {
  const user = await storage.getAdminUserByEmail("admin@japhazel.com");
  if (user) {
    const hashedPassword = await bcrypt.hash("Gimanwe%2311", 10);
    await storage.updateAdminUser(user.id, {
      email: user.email,
      name: user.name,
      hashedPassword
    });
    console.log("Password updated successfully for admin@japhazel.com");
  } else {
    console.log("User not found");
  }
  process.exit(0);
}

updatePassword();
