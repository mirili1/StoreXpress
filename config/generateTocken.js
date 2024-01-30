import jwt from 'jsonwebtoken';
export const generateToken = (user) => {
    let token = jwt.sign
    ({ _id: user._id, name: user.name, role: user.role },
     process.env.JWT_SECURING,
     { expiresIn: "90m" }
    );
    return token;
}