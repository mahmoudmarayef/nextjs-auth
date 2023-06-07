import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../utils/mongo";
import User from "../../models/User";

export default async function handler(req, res) {
  await connectToDatabase();
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        // Get the token from the cookie
        const token = req.cookies.token;

        // If token is not found, throw an error
        if (!token) {
          throw new Error("Not authorized");
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID
        const user = await User.findById(decoded.userId).select("-password");

        // If user not found, throw an error
        if (!user) {
          throw new Error("Not authorized");
        }

        res.status(200).json({ success: true, user: user });
      } catch (error) {
        res.status(401).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
