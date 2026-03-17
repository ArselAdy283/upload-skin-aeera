import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    secure: true, // penting biar https
});

export default cloudinary;