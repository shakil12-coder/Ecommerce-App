import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js"
import JWT from "jsonwebtoken";

//POST REGISTRATION

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    //validations

    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" })
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }

    //check user
    const existingUser = await userModel.findOne({ email });

    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered ,  Please Login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);

    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

//POST LOGIN

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        messsage: "Invalid Password",
      });
    }

    // create token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
    });
  }
};


export const forgotPasswordController = async (req, res) => {
  const { email, answer, newPassword } = req.body;

  if (!email) {
    res.status(400).send({
      message: "Email is required"
    })
  }
  if (!answer) {
    res.status(400).send({
      message: "answer is required"
    })
  }
  if (!newPassword) {
    res.status(400).send({
      message: "newPassword is required"
    })
  }

  //check
  const user = await userModel.findOne({ email });

  //validation
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "Wrong Email Or Answer",
    });
  }

  const hashed = await hashPassword(newPassword);
  await userModel.findByIdAndUpdate(user._id, {
    password: hashed
  })
  res.status(200).send({
    success: true,
    message: "Password Reset Successfully"
  })



}


export const testController = async (req, res) => {
  res.status(200).send({
    success: true,
    message: "protected route",
  });
};


export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    //password
    if (password && password.length < 6) {
      return res.json({
        error: "pasword required and 6 character long"
      })
    }

    const hashedPassword = password ? await hashPassword(password) : undefined

    const updatedUser = await userModel.findByIdAndUpdate(req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address
      }, { new: true })
    res.status(200).send({
      success: true,
      message: "Updated successfully",
      updatedUser
    })

  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      message: "Error while updating profile",
      error
    })
  }
}


export const getOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(err);
    res.status(400).send({
      success: false,
      message: "error whilte getting ordered products",
      error
    })
  }
}


export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error whilte updating product",
      error
    })
  }
}


export const getAllUsersControllers = async(req , res) => {
  try {
    const users = await userModel.find();
    res.status(200).send({
      success : true,
      message : "this is the api for all users",
      users
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:"error while getting all users",
      error
    })
  }
}