import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/app/models/user";
import { UserInfo } from "@/app/models/UserInfo";

export async function PUT(req) {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const data = await req.json();
        const session = await getServerSession(authOptions);        

        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = session.user.email;

        if(!email){
            return Response.json({});
        }

        const updateData = {
            name: data.name,
            image: data.image,
        };

        const updateUserInfoData = {
            phone: data.phone,
            streetAddress: data.streetAddress || "",
            zipCode: data.zipCode || "",
            city: data.city || "",
            country: data.country || "",
        };

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: updateData },  
            { new: true, runValidators: true }
        );

        const updatedUserInfo = await User.findOneAndUpdate(
            { email },
            { $set: updateUserInfoData },  
            { new: true, runValidators: true }
        );


        if (!updatedUser) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        return Response.json({ success: true, user: updatedUser || {}, userInfo: updatedUserInfo || {}});

    } catch (error) {
        console.error("Error updating profile:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = session.user.email;
        const user = await User.findOne({ email });
        const userInfo = await UserInfo.findOne({ email });

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        return Response.json({
            success: true,
            user,
            userInfo: userInfo || {} // Ensure userInfo is always an object
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
