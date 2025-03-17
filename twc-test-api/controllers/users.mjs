import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';

// Register a new user
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password || email.trim() === "" || password.trim() === "") {
            return res.status(422).json({ message: "Invalid Input" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create new user
        const user = new User({ email, password: hashedPassword });
        await user.save();

        return res.status(201).json({ message: "User registered successfully", user });

    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Login a user
export const login = async(req,res,next) => {
    const { email,password } = req.body

    if( !email && email.trim()==="" && !password && password.trim()===""){
        return res.status(422).json({message: "Invalid Input"})
    }
    let existingUser;
    try {
        existingUser = await User.findOne({email})

    } catch (error) {
        return console.log(error)
    }
    if(!existingUser){
        return res.status(400).json({message:"Admin not found"})
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)

    if(!isPasswordCorrect){
        return res.status(400).json({message:"Incorrect Password"})   
    }

    const token = jwt.sign({id: existingUser._id}, process.env.SECRET_KEY, {
        expiresIn : "7d",

    })

    return res.status(200).json({message:"Login Successfully!",token,id:existingUser._id})
};
