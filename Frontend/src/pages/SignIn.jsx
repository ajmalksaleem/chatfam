import React, { useState } from "react";
import ChatImage from "../assets/chat3d.png";
import { Alert, Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import {useForm} from 'react-hook-form'
import axios from "axios";
import { useDispatch } from "react-redux";
import { storeUserDetails } from "../redux/userSlice";

const SignIn = () => {
  const { register, handleSubmit, formState: { errors }} = useForm({ mode: "onChange" });
  const [error, seterror] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleSignIn = async(formData)=>{
    try {
      const{data} = await axios.post('/api/user/signin', {
        ...formData
      })
      dispatch(storeUserDetails(data))
      navigate('/')
    } catch (error) {
      if(error.response){
        seterror(error.response.data.message)
       }else{
        seterror(error.message)
       }
    }
  }

  return (
    <div className="h-screen bg-gradient-to-l from-green-200 to-blue-200 overflow-y-auto">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-center sm:pt-40 pt-24 gap-4">
        {/* left side */}
        <div className="flex-1 flex flex-col items-center">
          <span className="text-4xl font-semibold mb-3 text-green-800">ChatFam..</span>
          <div className="w-[255px] h-[200px]  flex items-center">
            <img className="size-[500px] object-cover" src={ChatImage} />
          </div>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex sm:p-3 pb-5 sm:px-0 px-9  flex-col gap-4 " onSubmit={handleSubmit(handleSignIn)}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Your email" />
              </div>
              <TextInput
                id="email1"
                type="email"
                placeholder="name@flowbite.com"
                required
                {...register("email", {
                  required: "email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  }
                })}
              />
               {errors.email && (
                <p className="text-sm mt-2 text-red-500">
                  {errors.email?.message}
                </p>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Your password" />
              </div>
              <TextInput id="password1" type="password" required 
              {...register("password", {
                required: "password is required",
                validate: {
                  noSpaces: (value) => {
                    const trimmedValue = value.trim();
                    return (
                      (trimmedValue !== "" &&
                        trimmedValue === value &&
                        !trimmedValue.includes(" ")) ||
                      "Password cannot contain spaces"
                    );
                  },
                },
                minLength: {
                  value: 5,
                  message: "Password must be more than 5 characters",
                },
              })}
              />
              {errors.password && (
                <p className="text-sm mt-2 text-red-500">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button gradientDuoTone="greenToBlue" type="submit">
              Sign In
            </Button>
            {error && <Alert color="failure">{error}</Alert>}
            <div className="flex gap-2">
          <span>Haven't registered?</span>
          <Link to="/sign-up" className="text-green-500">
            Sign Up
          </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
