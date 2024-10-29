import React, { useState } from "react";
import ChatImage from "../assets/chat3d.png";
import { Button, Checkbox, FileInput, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TiTick } from "react-icons/ti";
import { Spinner } from "flowbite-react";
import axios from 'axios'
import { Alert } from "flowbite-react";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [file, setfile] = useState(null);
  const [loading, setloading] = useState(false);
  const [uploded, setuploded] = useState(false);
  const [pic, setpic] = useState('');
  const [error, seterror] = useState(null);

  const navigate = useNavigate();

  const handleUpload = () => {
    if (!file) return;
    setloading(true)
    const data = new FormData()
    data.append('file',file)
    data.append('upload_preset', 'chat-app')
    data.append("cloud_name", 'dnnc0v1kn')
    fetch('https://api.cloudinary.com/v1_1/dnnc0v1kn/image/upload', {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data)=>{
        setpic(data.url.toString())
        setloading(false)
        setuploded(true)
      })
      .catch((err)=>{
        seterror(err)
        setloading(false)
      })
  };

  const handleSignUp = async(formData) => {
    try {
      await axios.post('/api/user/signup',{
        ...formData,pic
      })
      navigate('/sign-in')
    } catch (error) {
     if(error.reseponse){
      seterror(error.response.data.message)
     }else{
      seterror(error.message)
     }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-200 to-blue-200">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-center pt-16  gap-4">
        {/* left side */}
        <div className="flex-1 flex flex-col items-center">
          <span className="text-4xl font-semibold mb-3">ChatFam..</span>
          <div className="w-[255px] h-[200px]  flex items-center">
            <img className="size-[500px] object-cover" src={ChatImage} />
          </div>
        </div>
        {/* right */}
        <div className="flex-1">
          <form
            className="flex sm:p-4 p-10  flex-col gap-4"
            onSubmit={handleSubmit(handleSignUp)}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="Name" value="Your Name" />
              </div>
              <TextInput
                type="text"
                placeholder="your name.."
                required
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 5,
                    message: "Name must be more than 5 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Name cannot exceed 20 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-sm mt-2 text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Your email" />
              </div>
              <TextInput
                type="email"
                placeholder="name@gmail.com"
                required
                {...register("email", {
                  required: "email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
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
                <Label value="Your password" />
              </div>
              <TextInput
                type="password"
                required
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
            <div>
              <div className="mb-2 block">
                <Label value="Your Profile Picture" />
              </div>
              <div className="flex gap-3">
                <FileInput
                  accept="image/*"
                  onChange={(e) => setfile(e.target.files[0])}
                />
                <Button
                  type="button"
                  gradientMonochrome="cyan"
                  onClick={handleUpload}
                >
                  {loading? <Spinner color="gray"/> : uploded ? <TiTick className="text-xl" /> : "Upload"}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button gradientDuoTone="greenToBlue" type="submit" disabled={loading}>
              Submit
            </Button>
            {error && <Alert color="failure">{error}</Alert>}
            <div className="flex gap-2">
              <span>Already have an Account?</span>
              <Link to="/sign-in" className="text-green-500">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
