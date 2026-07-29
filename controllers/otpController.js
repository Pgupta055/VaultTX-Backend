const User = require("../models/User");
const { createOTP, verifyOTP } = require("../services/otpService");
const sendEmail = require("../services/emailService");
const otpTemplate = require("../utils/otpTemplate");

const sendRegistrationOTP = async (req, res) => {
  try {
    console.log("========== SEND OTP ==========");

    const {
      fullName,
      email,
      password,
      masterPassword,
    } = req.body;

    console.log("1. Body received");

    const existingUser = await User.findOne({ email });

    console.log("2. Existing user checked");

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedMaster = await bcrypt.hash(masterPassword, 10);

    console.log("3. Passwords hashed");

    await createPendingUser({
      fullName,
      email,
      password: hashedPassword,
      masterPassword: hashedMaster,
    });

    console.log("4. Pending user created");

    const otp = await createOTP(email, "registration");

    console.log("5. OTP:", otp);

    console.log("6. Sending email...");

    await sendEmail({
      to: email,
      subject: "SecureVault Email Verification",
      html: otpTemplate(otp),
    });

    console.log("7. Email sent");

    return res.json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {
    console.error("❌ FAILED HERE");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP.",
    });
  }
};



const generateToken =
require("../utils/generateToken");

const verifyRegistrationOTP =
async (req, res) => {

    try{

        const {email,otp}=req.body;

        const result=
        await verifyOTP(
            email,
            otp,
            "registration"
        );

        if(!result.success){

            return res.status(400).json(result);

        }

        const pending=
        await getPendingUser(email);

        if(!pending){

            return res.status(404).json({

                success:false,

                message:
                "Registration expired."

            });

        }

        const user=
        await User.create({

            fullName:
            pending.fullName,

            email:
            pending.email,

            password:
            pending.password,

            masterPassword:
            pending.masterPassword

        });

        await deletePendingUser(email);

        return res.json({

            success:true,

            token:
            generateToken(user._id),

            user

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:
            "Registration failed."

        });

    }

};

const resendRegistrationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = await createOTP(email, "registration");

    await sendEmail({
      to: email,
      subject: "SecureVault Email Verification",
      html: otpTemplate(otp),
    });

    res.json({
      success: true,
      message: "OTP resent successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to resend OTP.",
    });
  }
};

module.exports = {
  sendRegistrationOTP,
  verifyRegistrationOTP,
  resendRegistrationOTP,
};