import { RiLockPasswordLine } from "react-icons/ri";
import { MdAlternateEmail } from "react-icons/md";
import { FaCircleExclamation } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { useEffect, useState } from "react";
import * as EmailValidator from "email-validator";
import PasswordStrengthBar from "react-password-strength-bar";
import "../CSS/Register.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {hashSync } from "bcrypt-ts";

function Register({ onSignUp, registeredUserArr }: any) {
  const [registeredUsers, setRegisteredUsers] = useState([{}]);
  const navigate = useNavigate();
  const [passwordScore, setPasswordScore] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validFields, setValidFields] = useState({
    email: 0,
    password: 0,
    confirmPassword: 0,
  });
  const [submitCount, setSubmitcount] = useState(0);

  const isObjectEmpty = (objectName: Object) => {
    return (
      objectName &&
      Object.keys(objectName).length === 0 &&
      objectName.constructor === Object
    );
  };

  useEffect(() => {
    if (isObjectEmpty(registeredUsers[0])) {
      registeredUsers.shift();
    }
    if (registeredUsers.length > 0) {
      console.log(registeredUsers);
      onSignUp(registeredUsers);
      toast.success("User Registered Successfuly");
      navigate("/login");
    }
  }, [registeredUsers]);

  function validateEmail(email: any) {
    setEmail(email);
    EmailValidator.validate(email)
      ? setValidFields({ ...validFields, email: 1 })
      : setValidFields({ ...validFields, email: 0 });
  }

  function validatePassword(score: any) {
    setPasswordScore(score);
    if (score > 2) setValidFields({ ...validFields, password: 1 });
    else setValidFields({ ...validFields, password: 0 });
  }

  function validateConfirmPassword(cnfPassword: any) {
    setConfirmPassword(cnfPassword);
    if (cnfPassword === password && password != "")
      setValidFields({ ...validFields, confirmPassword: 1 });
    else setValidFields({ ...validFields, confirmPassword: 0 });
  }

  function handleSubmit() {
    setSubmitcount(submitCount + 1);
    if (
      validFields.email &&
      validFields.password &&
      validFields.confirmPassword
    ) {
      const user = {
        name: "",
        fatherName: "",
        email: email,
        address: "",
        phone: "",
        pincode: "",
        country: "",
        state: "",
        city: "",
        nationality: "",
        premiumUser: false,
        password: hashSync(password,8)
      };
      if (registeredUserArr) {
        const isDuplicate = registeredUserArr.some(
          (user: any) => user.email === email
        );
        if (isDuplicate) {
          toast.error("User Already Registerd");
          return;
        }
      }

      registeredUserArr
        ? setRegisteredUsers([...registeredUserArr, user])
        : setRegisteredUsers([user]);
    }
  }

  useEffect(() => {
    validateConfirmPassword(confirmPassword);
  }, [password]);

  return (
    <div className="h-screen w-screen bg-white flex items-center justify-between">
      <div className="flex h-full bg_register w-1/2 items-center justify-center"></div>
      <div className="w-1/2 flex justify-center items-center">
        <div className="glass-register p-5 flex flex-col gap-10">
          <h1 className="font-Bebas_Neue text-5xl text-center">Sign Up</h1>
          <div className="flex flex-col gap-3" onKeyDown={(e)=>{if(e.key == "Enter")handleSubmit()}}>
            <div className="w-full flex flex-col text-2xl gap-1">
              {validFields.email == 0 && submitCount ? (
                <div className="text-sm flex self-end items-center gap-1 glassRed px-2 py-1">
                  <FaCircleExclamation />
                  Invalid Email
                </div>
              ) : (
                <></>
              )}
              <label htmlFor="" className="flex items-center gap-5">
                <MdAlternateEmail />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  className={
                    "rounded outline-none " +
                    (validFields.email
                      ? "border-2 border-green-400"
                      : "border-2 border-black")
                  }
                />
              </label>
            </div>
            <div className="w-full flex flex-col text-2xl gap-1">
              {(validFields.password == 0 ||
                validFields.confirmPassword == 0) &&
              submitCount > 0 ? (
                <div className="text-sm flex self-end items-center gap-1 glassRed px-2 py-1">
                  <FaCircleExclamation />
                  <span>
                    {password.length < 7
                      ? "Password is too short"
                      : password != confirmPassword
                      ? "Passwords don't match"
                      : passwordScore < 2
                      ? "Password is Too Weak"
                      : ""}
                  </span>
                </div>
              ) : (
                <></>
              )}
              <label htmlFor="" className="flex items-center gap-5">
                <a data-tooltip-id="my-tooltip-children-multiline">
                  <RiLockPasswordLine />
                </a>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={
                    "rounded outline-none " +
                    (validFields.password
                      ? "border-2 border-green-400"
                      : "border-2 border-black")
                  }
                />
                <Tooltip id="my-tooltip-children-multiline" place="left">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>Strong Password containes combination</span>
                    <span>of Capital and Small Letters,</span>
                    <span>Numbers, Special Symbols</span>
                    <span>and a minimum of 8 characters</span>
                  </div>
                </Tooltip>
              </label>
            </div>
            <div className="w-full flex flex-col text-2xl gap-1">
              <label htmlFor="" className="flex items-center gap-5">
                <RiLockPasswordLine />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => validateConfirmPassword(e.target.value)}
                  className={
                    "rounded outline-none " +
                    (validFields.confirmPassword
                      ? "border-2 border-green-400"
                      : "border-2 border-black")
                  }
                />
              </label>
            </div>
            <PasswordStrengthBar
              password={password}
              minLength={8}
              scoreWords={["Weak", "Weak", "Okay", "Good", "Strong"]}
              shortScoreWord={
                password.length > 0 ? "Password is Too Short" : ""
              }
              onChangeScore={(score) => validatePassword(score)}
            />
            <button
              type="submit"
              className="btn41-43 btn-43 mt-5 font-Nunito text-lg rounded-lg"
              onClick={() => handleSubmit()}
            >
              Register
            </button>
            <span className="w-full text-center">
              already a user?{" "}
              <a
                href="/login"
                className="text-blue-800 hover:text-blue-500 underline"
              >
                Log In
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
