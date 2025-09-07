import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    console.log("Token from cookies:", token);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    if (!token) {
        return res.json({ success: false, message: "Not authorized user, login again" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if (tokenDecode.id) {
            if (!req.body) req.body = {}; // ✅ Important
             req.userId = tokenDecode.id;
            next();
        } else {
            return res.json({ success: false, message: "Not authorized. Please login again" });
        }

    } catch (error) {
        console.log("JWT Verification Error:", error); // ✅ Correct place to log error
        return res.json({ success: false, message: "Data not found" });
    }
};
export default userAuth;
