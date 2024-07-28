import * as EmailValidator from "email-validator";
import { FaCircleExclamation } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import "../CSS/Login.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { compareSync } from "bcrypt-ts";
function Login({ user, adminCredentials, setLogin }: any) {
  const navigate = useNavigate();
  const [submitCount, setSubmitCount] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(2);
  const [passwordValid, setPasswordValid] = useState(2);
  useEffect(() => {
    if (EmailValidator.validate(email)) {
      setEmailValid(1);
    } else setEmailValid(0);
  }, [email]);
  useEffect(() => {
    if (password.length > 7) {
      setPasswordValid(1);
    } else setPasswordValid(0);
  }, [password]);

  function submit_btn() {
    if (emailValid == 1 && passwordValid == 1) {
      if (user && email != adminCredentials.email) {
        let matchedUserIndex = null;
        const matchedUser = user.some((value: any, index: any) => {
          if (value.email === email && compareSync(password,value.password)) {
            matchedUserIndex = index;
            return true;
          }
        });
        if (matchedUser == true) {
          if (matchedUser == true && matchedUserIndex != null)
            setLogin({
              email: email,
              premiumUser: user[matchedUserIndex].premiumUser,
            });
          toast.success("Logged In Successfuly");
          navigate("/loading");
        } else if (user.some((value:any)=>{if(value.email == email && compareSync(password,value.password)==false)return true})) {
          toast.error("Invalid Credentials");
        } else {
          toast.error("User Not Found. Please Register");
        }
      } else if (
        email === adminCredentials.email &&
        password === adminCredentials.password
      ) {
        setLogin({
          email: email,
          premiumUser: true,
        });
        toast.success("Welcome Admin");
        navigate("/loading");
      } else {
        toast.error("User Not Found. Please Register");
      }
    }
  }

  function errEmail() {
    if (emailValid == 0 && submitCount > 0)
      return (
        <div className="self-end -mt-1 -mb-6 flex gap-1 items-center rounded px-1 w-fit mr-[calc(100vw-84vw)] lg:mr-0 text-[0.6rem] lg:-mt-5 lg:-mb-6 lg:text-sm bg-white text-red-500 font-Nunito">
          {" "}
          <FaCircleExclamation style={{ fontSize: "0.875rem" }} /> Invalid Email
        </div>
      );
    else return <div className="-mt-6"></div>;
  }

  function errPassword() {
    if (passwordValid == 0 && submitCount > 0)
      return (
        <div className="self-end -mt-1 -mb-6 flex gap-1 items-center rounded px-1 w-fit mr-[calc(100vw-84vw)] lg:mr-0 text-[10px] lg:-mt-5 lg:-mb-6 lg:text-sm bg-white text-red-500 font-Nunito">
          {" "}
          <FaCircleExclamation style={{ fontSize: "0.875rem" }} /> Invalid
          Password
        </div>
      );
    else return <div className="-mt-6"></div>;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-white">
      <div className="flex h-full bg_login w-1/2 items-center justify-center"></div>
      <div className="w-1/2 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center p-5 gap-3 lg:gap-7 font-Nunito glass w-fit" onKeyDown={(e)=>{if(e.key == "Enter")submit_btn()}}>
          <h1 className="font-Bebas_Neue text-5xl text-center">LOGIN</h1>
          {errEmail()}
          <label className="font-semibold flex text-2xl lg:text-2xl items-center justify-around">
            <FaRegUser />
            <input
              className={
                "mt-2 lg:ml-5 lg:mt-0 border-2 rounded w-8/12 lg:w-full pl-2 " +
                (emailValid
                  ? " focus:outline-green-400 border-green-400"
                  : " border-black")
              }
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>
          {errPassword()}
          <label className="font-semibold flex text-2xl lg:text-2xl items-center justify-around">
            <RiLockPasswordLine className="text-[1.5rem] lg:text-[1.9rem]" />
            <input
              className={
                "mt-2 lg:ml-5 lg:mt-0 border-2 rounded  w-8/12 pl-2 lg:w-full" +
                (password.length > 7
                  ? " focus:outline-green-400 border-green-400"
                  : " border-black")
              }
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </label>
          <button
            type="submit"
            onClick={() => {
              setSubmitCount(submitCount + 1);
              submit_btn();
            }}
            className="btn41-43 btn-43 font-Nunito text-lg rounded-lg w-11/12"
          >
            Log In
          </button>
          <div className="-mt-2 lg:-mt-4 w-full flex justify-between">
            <a
              href=""
              className="underline text-blue-800 hover:text-blue-500 w-fit"
            >
              forgot password?
            </a>
            <span>
              New User?{" "}
              <a
                href="/register"
                className="underline text-blue-800 hover:text-blue-500 w-fit"
              >
                Sign Up
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
