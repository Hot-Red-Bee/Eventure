import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

//  protected route
router.get("/me", protect, (req, res) => {
  res.json({ message: "Profile fetched successfully", user: req.user });
});

//  admin-only route
router.post("/admin-only", protect, requireRole("admin"), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

export default router;