import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
});

userSchema.plugin(passportLocalMongoose);

export const UserModel = model("User", userSchema, "users");
