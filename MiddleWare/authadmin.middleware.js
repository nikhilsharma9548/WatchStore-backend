import jwt from "jsonwebtoken";

const authAdmin = async(req, res, next) =>{

    const { adminToken} = req.cookies;

    if(!adminToken){
        return res.json({success:false, message: 'Not Authorized'})
    }

    try {
            const tokenDecode = jwt.verify(adminToken, process.env.JWT_SECRET);
    
            if (tokenDecode.email === process.env.ADMIN_EMAIL) {
                next();
            } else {
                return res.json({ success: false, message: "Not authorized. Please login again" });
            }
    
        } catch (error) {
            return res.json({ success: false, message: "Data not found" });
        }
}
export default authAdmin;