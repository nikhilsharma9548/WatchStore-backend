import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: "Not authorized user, login again" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
          console.log(error)

        if (tokenDecode.id) {
            // if (!req.body) req.body = {}; // ✅ IMPORTANT LINE
            // req.body.userId = tokenDecode.id;
             req.userId = tokenDecode.id;
            next();
        } else {
            return res.json({ success: false, message: "Not authorized. Please login again" });
        }

    } catch (error) {
        return res.json({ success: false, message: "Data not found" });
    }
    console.log("Token from cookies:", req.cookies.token);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

};

export default userAuth;
