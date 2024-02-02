const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tasks : [{type: mongoose.Schema.Types.ObjectId, ref : 'Task'}],    //Array of task
});

const User = new mongoose.model("User", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().alphanum().min(1).max(10).required(),
    lastName: Joi.string().alphanum().min(1).max(10).required(),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }).required(),
    password: passwordComplexity().required(),
  });
  return schema.validate(data);
};


module.exports = {User,validate};