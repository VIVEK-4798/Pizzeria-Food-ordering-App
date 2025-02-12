import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/app/models/user";

export async function PUT(req){
    mongoose.connect(process.env.MONGO_URL);
    const data = await req.json();
    const session = await getServerSession(authOptions);
    const email = session.user.email;

    const user = await User.findOne({email});
    
    
    if('name' in data){
        // Update user name
        await User.updateOne({email}, {name:data.name})
    }
    return Response.json(true);
}