import { model, Document, Model, Schema } from "mongoose";

import { toHash } from "../services/password";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserDoc extends Document {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

export const User = model<UserDoc, UserModel>("User", userSchema);
