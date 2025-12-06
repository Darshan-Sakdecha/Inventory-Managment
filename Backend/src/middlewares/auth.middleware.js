import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
    //  console.log("All headers:", req.headers);
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("Authorization header:", req.headers.authorization);
    
    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user is always based on the logged-in user.
        req.user = decoded // save user data in request
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}