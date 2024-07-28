import { slide as Menu } from "react-burger-menu";
import "../CSS/Dashboard.css";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Dashboard({
  formSubmit,
  adminCredentials,
  loggedInUser,
  logInStatus,
  prevCookies,
  clear,
  buyPremium,
  premiumRequests,
}: any) {
  const navigate = useNavigate();
  const [premiumUser, setPremiumUser] = useState(false);
  const [userArr, setUserArr] = useState([{}]);
  const [nationality, setNationality] = useState("");
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [country, setCountry] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const [background, setBackground] = useState("/dashboard3.jpg");

  const isObjectEmpty = (objectName: Object) => {
    return (
      objectName &&
      Object.keys(objectName).length === 0 &&
      objectName.constructor === Object
    );
  };

  useEffect(() => {
    const s = State.getStatesOfCountry("IN").find(
      (v) => state === v.name
    )?.isoCode;
    if (s) setStateCode(s);
  }, [state]);

  useEffect(() => {
    if (isObjectEmpty(userArr[0]) == true) userArr.shift();
    if (userArr.length > 0) {
      formSubmit(userArr);
      toast.success("Cookies Set Succesfuly");
    }
    clearAllInput();
  }, [userArr]);

  useEffect(() => {
    if (loggedInUser) {
      setEmail(loggedInUser.email);
      if (prevCookies) {
        prevCookies.map((value: any) => {
          if (value.email == loggedInUser.email) setPassword(value.password);
        });
      }
      if (loggedInUser.premiumUser == true) setPremiumUser(true);
    }
  }, []);

  useEffect(() => {
    if (nationality == "Indian") {
      setCountry("India");
      setCountryCode("IN");
    } else {
      setCountry("");
      setCountryCode("");
    }
  }, [nationality]);

  useEffect(() => {
    if (pincode.length === 6 && nationality == "Indian") {
      getPin();
    }
  }, [pincode]);

  async function getPin() {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      if (
        data &&
        data.length > 0 &&
        data[0].PostOffice &&
        data[0].PostOffice.length > 0
      ) {
        const firstPostOffice = data[0].PostOffice[0];
        setCountryCode("IN");
        setCountry(firstPostOffice.Country);
        setState(firstPostOffice.State);
        setCity(firstPostOffice.District);
      }
    } catch (error) {
      alert(error);
    }
  }

  function clearAllInput() {
    setNationality("");
    setName("");
    setFatherName("");
    setNumber("");
    setPhone("");
    setAddress("");
    setPincode("");
    setCountry("");
    setState("");
    setCity("");
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    if (
      name &&
      fatherName &&
      number &&
      address &&
      email &&
      pincode &&
      country &&
      state &&
      city &&
      nationality &&
      password
    ) {
      const user = {
        name: name,
        fatherName: fatherName,
        phone: phone,
        address: address,
        email: email,
        pincode: pincode,
        country: country,
        state: state,
        city: city,
        nationaity: nationality,
        premiumUser: premiumUser,
        password: password,
      };
      if (prevCookies) {
        if (loggedInUser.premiumUser) {
          setUserArr([...prevCookies, user]);
        } else {
          const blankRecordIndex = prevCookies.findIndex(
            (value: any) =>
              value.email === loggedInUser.email && value.name === ""
          );
          if (blankRecordIndex !== -1) {
            prevCookies[blankRecordIndex] = {
              ...prevCookies[blankRecordIndex],
              name,
              fatherName,
              phone,
              address,
              email,
              pincode,
              country,
              state,
              city,
              nationality,
              premiumUser,
              password,
            };
            setUserArr([...prevCookies]);
          } else {
            toast.warning("Premium Required");
          }
        }
      } else {
        setUserArr([user]);
      }

      setSubmitCount(submitCount + 1);
    } else {
      toast.warning("Please fill all fields");
    }
  }

  function goPremium() {
    if (
      prevCookies != undefined &&
      prevCookies.some((value: any) => {
        if (value.email == loggedInUser.email) {
          return true;
        }
      })
    ) {
      if (premiumRequests != undefined) {
        if (
          premiumRequests.some((value: any) => {
            return value == loggedInUser.email;
          })
        ) {
          toast.warning("Request Already Sent");
        } else {
          buyPremium([...premiumRequests, loggedInUser.email]);
          toast.success("Premium Request Sent");
        }
      } else if (premiumRequests == undefined) {
        buyPremium([loggedInUser.email]);
        toast.success("Premium Request Sent");
      }
    } else {
      toast.error("Please Fill out the form first");
    }
  }

  const backgrounds = ["/dashboard.jpg", "/dashboard2.jpg", "/dashboard3.jpg"];
  function randomBackground() {
    let index = backgrounds.indexOf(background);
    index == 2 ? (index = 0) : index++;
    setBackground(backgrounds[index]);
  }

  return logInStatus ? (
    <div
      className={"h-screen w-screen bg-dashboard"}
      style={{ backgroundImage: `url(${background})` }}>
      <Menu>
        <a href="/viewList">View Cookies</a>
        {loggedInUser.email === adminCredentials.email ? (
          <a className="cursor-pointer">
            Premium Requests - {premiumRequests ? premiumRequests.length : 0}
          </a>
        ) : loggedInUser.premiumUser === true ? (
          <a>Premium User ⭐</a>
        ) : (
          <a onClick={goPremium} className="cursor-pointer">
            Buy Premium
          </a>
        )}
      </Menu>
      <div className="absolute right-0 mt-9 mr-9 flex justify-between w-96">
        <button
          className="p-2 bg-black text-white rounded"
          onClick={randomBackground}>
          Change Background
        </button>
        <a href="/viewList" className="p-2 bg-black text-white rounded">
          View Cookies
        </a>
        <button
          onClick={() => {
            clear("loggedInUser");
            navigate("/login");
            toast.warning("Logged Out Successfuly");
          }}
          className="p-2 bg-black text-white rounded">
          Log Out
        </button>
      </div>
      <div className="h-full w-full flex flex-col pt-12 lg:pt-0 items-center justify-center">
        {loggedInUser.email === adminCredentials.email ? (
          <div className="flex justify-center items-center font-Bebas_Neue text-7xl mb-5">
            ADMIN
          </div>
        ) : (
          ""
        )}
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="glass-dashboard flex flex-col gap-3 p-5 lg:w-[38%] w-full"
          id="contact-details">
          <label className="flex flex-col lg:flex-row lg:w-full justify-between font-Nunito lg:text-xl text-base">
            Nationality
            <div className="flex w-[300px] justify-start gap-5 items-center">
              <label>
                <input
                  type="radio"
                  name="nationality"
                  onChange={(e) => {
                    setNationality(e.target.value);
                  }}
                  value={"Indian"}
                  checked={nationality == "Indian"}
                  className="border border-[#cacaca] mr-3"
                />
                Indian
              </label>
              <label>
                <input
                  type="radio"
                  name="nationality"
                  onChange={(e) => setNationality(e.target.value)}
                  value={"Other"}
                  checked={nationality == "Other"}
                  className="border border-[#cacaca] mr-3"
                />
                Other
              </label>
            </div>
          </label>
          <label className="flex flex-col lg:flex-row justify-between font-Nunito lg:text-xl text-base">
            Name
            <input
              type="text"
              className="border border-[#cacaca] rounded w-[300px]"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
          <label className="flex flex-col lg:flex-row justify-between font-Nunito lg:text-xl text-base">
            Father's Name
            <input
              type="text"
              className="border border-[#cacaca] rounded w-[300px]"
              placeholder="Father's Name"
              value={fatherName}
              onChange={(e) => {
                setFatherName(e.target.value);
              }}
            />
          </label>
          <label className="flex flex-col lg:flex-row justify-between font-Nunito lg:text-xl text-base">
            Phone
            <PhoneInput
              containerStyle={{
                width: "fit-content",
                height: "30px",
                borderRadius: "0.25rem",
              }}
              inputStyle={{
                height: "30px",
                borderRadius: "0.25rem",
                fontSize: "1.25rem",
              }}
              country={nationality == "Indian" ? "in" : ""}
              countryCodeEditable={false}
              placeholder="Enter phone number"
              value={number}
              onChange={(one, _two, _three, four) => {
                setPhone(four);
                setNumber(one);
              }}
            />
          </label>
          <label className="flex flex-col lg:flex-row justify-between font-Nunito lg:text-xl text-base">
            Email
            <input
              type="text"
              className="border border-[#cacaca] rounded w-[300px]"
              placeholder="Address"
              readOnly={loggedInUser.email != adminCredentials.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="flex flex-col lg:flex-row justify-between font-Nunito lg:text-xl text-base">
            Address
            <input
              type="text"
              className="border border-[#cacaca] rounded w-[300px]"
              placeholder="Address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </label>
          <label className="flex flex-col lg:flex-row justify-between font-Nunito lg:text-xl text-base">
            {" "}
            PIN Code
            <input
              type="text"
              className="border border-[#cacaca] rounded w-[300px]"
              placeholder="PIN Code"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, ""));
              }}
            />
          </label>
          <label className="flex flex-col lg:flex-row justify-between font-Nunito lg:text-xl text-base">
            Country
            <select
              name=""
              className="border border-[#cacaca] rounded w-[300px]"
              id=""
              defaultValue={"Select Country"}
              onChange={(e) => {
                const value = JSON.parse(e.target.value);
                setCountry(value.name);
                setCountryCode(value.code);
              }}>
              <option value="Select Country">--SELECT COUNTRY--</option>
              {country
                ? Country.getAllCountries().map((v, i) => {
                    return (
                      <option
                        key={i}
                        selected={country == v.name}
                        hidden={
                          (nationality == "Other" && v.name == "India") ||
                          (nationality == "Indian" && v.name != "India")
                        }
                        value={JSON.stringify({
                          name: v.name,
                          code: v.isoCode,
                        })}>
                        {v.name}
                      </option>
                    );
                  })
                : Country.getAllCountries().map((v, i) => {
                    return (
                      <option
                        key={i}
                        hidden={
                          (nationality == "Other" && v.name == "India") ||
                          nationality == "Indian"
                        }
                        value={JSON.stringify({
                          name: v.name,
                          code: v.isoCode,
                        })}>
                        {v.name}
                      </option>
                    );
                  })}
            </select>
          </label>
          <label className="flex flex-col lg:flex-row justify-between font-Nunito lg:text-xl text-basel">
            {" "}
            State
            <select
              name=""
              className="border border-[#cacaca] rounded w-[300px]"
              defaultValue={"Select State"}
              id=""
              onChange={(e) => {
                const value = JSON.parse(e.target.value);
                setState(value.name);
                setStateCode(value.code);
              }}>
              <option value="Select State">--SELECT STATE--</option>
              {state
                ? State.getStatesOfCountry(countryCode).map((v, i) => {
                    return (
                      <option
                        key={i}
                        selected={state == v.name}
                        value={JSON.stringify({
                          name: v.name,
                          code: v.isoCode,
                        })}>
                        {v.name}
                      </option>
                    );
                  })
                : State.getStatesOfCountry(countryCode).map((v, i) => {
                    return (
                      <option
                        key={i}
                        value={JSON.stringify({
                          name: v.name,
                          code: v.isoCode,
                        })}>
                        {v.name}
                      </option>
                    );
                  })}
            </select>
          </label>
          <label className="flex flex-col lg:flex-row justify-between font-Nunito lg:text-xl text-base">
            {" "}
            City
            <select
              name=""
              className="border border-[#cacaca] rounded w-[300px]"
              defaultValue={"Select City"}
              id=""
              onChange={(e) => {
                setCity(e.target.value);
              }}>
              <option value="Select City">--SELECT CITY--</option>
              {city
                ? City.getCitiesOfState(countryCode, stateCode).map((v, i) => {
                    return (
                      <option key={i} selected={city == v.name} value={v.name}>
                        {v.name}
                      </option>
                    );
                  })
                : City.getCitiesOfState(countryCode, stateCode).map((v, i) => {
                    return (
                      <option key={i} value={v.name}>
                        {v.name}
                      </option>
                    );
                  })}
            </select>
          </label>
          <button
            className="btn41-43 btn-43 font-Nunito text-lg rounded-lg"
            type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <div className="flex flex-col gap-10 items-center justify-center w-fit">
        <span className="font-Bebas_Neue text-5xl">User Not Authorized</span>
        <div className="flex justify-between w-3/4 gap-5 font-Nunito text-2xl">
          <a
            href="/login"
            className="glass w-1/2 py-2 text-center text-blue-900 hover:text-blue-500">
            Log In
          </a>
          <a
            href="/register"
            className="glass w-1/2 py-2 text-center text-blue-900 hover:text-blue-500">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
