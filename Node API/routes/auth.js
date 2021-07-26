const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../model/User");

// validation
const { registerValidation, loginValidation } = require("../validation");

// register route
router.post("/register", async (req, res) => {
  // validate the user
  const { error } = registerValidation(req.body);

  // throw validation errors
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const isEmailExist = await User.findOne({ email: req.body.email });

    // throw error when email already registered
    if (isEmailExist)
      return res.status(409).json({ status: false, error: "Email already exists, please try with diffrent email." });
  }
  catch (e) {

  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password,
  });

  try {
    const savedUser = await user.save();
    res.json({ error: null, data: { userId: savedUser._id }, message: "User was created successfully!" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// login route
router.post("/login", async (req, res) => {
  // validate the user
  const { error } = loginValidation(req.body);

  // throw validation errors
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });

  // throw error when email is wrong
  if (!user) return res.status(400).json({ status: false, error: "Email is not exits." });

  // check for password correctness
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ status: false, error: "Password is wrong, please try again." });

  // create token
  const token = jwt.sign(
    // payload data
    {
      name: user.name,
      id: user._id,
    },
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", token).json({
    error: null,
    token,
  });
});

module.exports = router;
