import { slide as Menu } from "react-burger-menu";
import "../CSS/ViewList.css";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { TiEdit } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";
import { useState } from "react";

function ViewList({
  user,
  adminCredentials,
  clear,
  remove,
  loggedInUser,
  update,
  premiumRequests,
  registerdUsers,
  updateRegisterdUser,
  updatePremiumRequests,
}: any) {
  console.log(user);
  const [editDialog, setEditDialog] = useState(0);
  const [index, setIndex] = useState(null);
  const [searchString, setSearchString] = useState("");
  const [editedUser, _setEditedUser] = useState({
    name: "",
    fatherName: "",
    phone: "",
    address: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
    email: "",
    premiumUser: "",
    nationality: "",
    password: "",
  });

  function approvePremiumRequest(emailToApprove: String) {
    if (registerdUsers) {
      let registerdUserIndex = null;
      registerdUsers.map((value: any, index: any) => {
        if (value.email == emailToApprove) {
          registerdUserIndex = index;
        }
      });
      if (registerdUserIndex != null) {
        registerdUsers[registerdUserIndex].premiumUser = true;
        updateRegisterdUser(registerdUsers);
        premiumRequests.splice(premiumRequests.indexOf(emailToApprove), 1);
        updatePremiumRequests(premiumRequests);
        let userIndex = null;
        user.map((value: any, index: any) => {
          if (value.email == emailToApprove) userIndex = index;
        });
        if (userIndex != null) {
          user[userIndex].premiumUser = true;
          update(user);
        }
      }
    }
  }

  function rejectPremiumRequest(emailToReject: any) {
    premiumRequests.splice(premiumRequests.indexOf(emailToReject), 1);
    updatePremiumRequests(premiumRequests);
  }

  function deleteUser(index: any) {
    user.splice(index, 1);
    remove(user);
    toast.warning("Record Removed");
  }

  function updateUser() {
    if (index != null) {
      user[index] = editedUser;
      console.log(user);
      update(user);
      setIndex(null);
      setEditDialog(0);
      toast.success("Details Updated Succesfully");
    }
  }

  function editUser(mapIndex: any) {
    setIndex(mapIndex);
    setEditDialog(editDialog ? 0 : 1);
    editedUser.name = user[mapIndex].name;
    editedUser.fatherName = user[mapIndex].fatherName;
    editedUser.phone = user[mapIndex].phone;
    editedUser.address = user[mapIndex].address;
    editedUser.email = user[mapIndex].email;
    editedUser.pincode = user[mapIndex].pincode;
    editedUser.country = user[mapIndex].country;
    editedUser.state = user[mapIndex].state;
    editedUser.city = user[mapIndex].city;
    editedUser.nationality = user[mapIndex].nationaity;
    editedUser.premiumUser = user[mapIndex].premiumUser;
    editedUser.password = user[mapIndex].password;
  }

  if (
    user &&
    user.length > 0 &&
    loggedInUser.email &&
    (user.some((value: any) => {
      return value.email == loggedInUser.email && value.name != "";
    }) ||
      loggedInUser.email == adminCredentials.email)
  ) {
    return (
      <div className="h-screen w-screen bg-gray-100">
        <Menu>
          <a href="/dashboard">Dashboard</a>
        </Menu>
        <div className="absolute right-0 mt-9 mr-9">
          <a href="/dashboard" className="p-2 bg-black text-white rounded">
            Return to Dashboard
          </a>
        </div>
        <div className="flex flex-col gap-5 items-center w-full h-full text-lg pt-24">
          <div className="text-5xl font-Bebas_Neue">Cookies</div>
          <div className="flex lg:w-10/12 justify-end">
            <label
              htmlFor=""
              className="flex bg-white items-center rounded-2xl px-2 gap-4">
              <IoIosSearch style={{ fontSize: "30px" }} />
              <input
                type="text"
                className="text-xl outline-none"
                placeholder="Search by name"
                onChange={(e) => setSearchString(e.target.value)}
              />
            </label>
          </div>
          <div className="glass lg:w-11/12 overflow-auto max-h-[50vh] p-5">
            <table>
              <thead>
                <tr className="top-row">
                  <th>Name</th>
                  <th>Father's Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Pincode</th>
                  <th>Country</th>
                  <th>State</th>
                  <th>City</th>
                  <th></th>
                  <th></th>
                  <th>
                    {loggedInUser.email == adminCredentials.email
                      ? "Premium Requests"
                      : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchString != ""
                  ? user.map((value: any, index: any) => {
                      if (
                        value.name
                          .toLowerCase()
                          .search(searchString.toLowerCase()) == 0
                      ) {
                        if (value.email == loggedInUser.email) {
                          return (
                            <tr key={index}>
                              <td>{value.name}</td>
                              <td>{value.fatherName}</td>
                              <td>{value.phone}</td>
                              <td>{value.email}</td>
                              <td>{value.address}</td>
                              <td>{value.pincode}</td>
                              <td>{value.country}</td>
                              <td>{value.state}</td>
                              <td>{value.city}</td>
                              <td>
                                {value.email == adminCredentials.email ? (
                                  <MdDeleteForever
                                    onClick={() => deleteUser(index)}
                                    style={{
                                      fontSize: "30px",
                                      color: "red",
                                      cursor: "pointer",
                                    }}
                                  />
                                ) : (
                                  <></>
                                )}
                              </td>
                              <td>
                                <TiEdit
                                  onClick={() => editUser(index)}
                                  style={{
                                    fontSize: "30px",
                                    color: "blue",
                                    cursor: "pointer",
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        } else if (
                          loggedInUser.email == adminCredentials.email &&
                          value.name != ""
                        ) {
                          return (
                            <tr key={index}>
                              <td>{value.name}</td>
                              <td>{value.fatherName}</td>
                              <td>{value.phone}</td>
                              <td>{value.email}</td>
                              <td>{value.address}</td>
                              <td>{value.pincode}</td>
                              <td>{value.country}</td>
                              <td>{value.state}</td>
                              <td>{value.city}</td>
                              <td>
                                <MdDeleteForever
                                  onClick={() => deleteUser(index)}
                                  style={{
                                    fontSize: "30px",
                                    color: "red",
                                    cursor: "pointer",
                                  }}
                                />
                              </td>
                              <td>
                                <TiEdit
                                  onClick={() => editUser(index)}
                                  style={{
                                    fontSize: "30px",
                                    color: "blue",
                                    cursor: "pointer",
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        }
                      }
                    })
                  : user.map((value: any, index: any) => {
                      if (value.email == loggedInUser.email) {
                        return (
                          <tr key={index}>
                            <td>{value.name}</td>
                            <td>{value.fatherName}</td>
                            <td>{value.phone}</td>
                            <td>{value.email}</td>
                            <td>{value.address}</td>
                            <td>{value.pincode}</td>
                            <td>{value.country}</td>
                            <td>{value.state}</td>
                            <td>{value.city}</td>
                            <td>
                              {loggedInUser.email == adminCredentials.email ? (
                                <MdDeleteForever
                                  onClick={() => deleteUser(index)}
                                  style={{
                                    fontSize: "30px",
                                    color: "red",
                                    cursor: "pointer",
                                  }}
                                />
                              ) : (
                                <></>
                              )}
                            </td>
                            <td>
                              <TiEdit
                                onClick={() => editUser(index)}
                                style={{
                                  fontSize: "30px",
                                  color: "blue",
                                  cursor: "pointer",
                                }}
                              />
                            </td>
                          </tr>
                        );
                      } else if (
                        loggedInUser.email == adminCredentials.email &&
                        value.name != ""
                      ) {
                        return (
                          <tr key={index}>
                            <td>{value.name}</td>
                            <td>{value.fatherName}</td>
                            <td>{value.phone}</td>
                            <td>{value.email}</td>
                            <td>{value.address}</td>
                            <td>{value.pincode}</td>
                            <td>{value.country}</td>
                            <td>{value.state}</td>
                            <td>{value.city}</td>
                            <td>
                              <MdDeleteForever
                                onClick={() => deleteUser(index)}
                                style={{
                                  fontSize: "30px",
                                  color: "red",
                                  cursor: "pointer",
                                }}
                              />
                            </td>
                            <td>
                              <TiEdit
                                onClick={() => editUser(index)}
                                style={{
                                  fontSize: "30px",
                                  color: "blue",
                                  cursor: "pointer",
                                }}
                              />
                            </td>
                            <td>
                              {premiumRequests != null &&
                              premiumRequests.some((premiumEmail: any) => {
                                return premiumEmail == value.email;
                              }) ? (
                                <div className="flex justify-center items-center text-xl gap-10">
                                  <div className="text-2xl text-green-500">
                                    <FaCheck
                                      className="cursor-pointer"
                                      onClick={() =>
                                        approvePremiumRequest(value.email)
                                      }
                                    />
                                  </div>
                                  <div className="text-red-600">
                                    <ImCross
                                      className="cursor-pointer"
                                      onClick={() =>
                                        rejectPremiumRequest(value.email)
                                      }
                                    />
                                  </div>
                                </div>
                              ) : value.premiumUser == true ? (
                                <>Premium User</>
                              ) : (
                                <>Not Requested</>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    })}
              </tbody>
            </table>
          </div>
          <div>
            {editDialog ? (
              <div className="bg-white pb-2 rounded-lg">
                <div className="flex w-full justify-between p-5 pb-2">
                  <span className="text-2xl font-Nunito font-semibold">
                    Edit Details
                  </span>
                  <span>
                    <IoCloseSharp
                      style={{
                        fontSize: "30px",
                        cursor: "pointer",
                        color: "red",
                      }}
                      onClick={() => {
                        setIndex(null);
                        setEditDialog(0);
                      }}
                    />
                  </span>
                </div>
                <hr />
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Father's Name</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Pincode</th>
                      <th>Country</th>
                      <th>State</th>
                      <th>City</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          defaultValue={editedUser.name}
                          onChange={(e) => (editedUser.name = e.target.value)}
                          className="text-center w-36 border-2 border-gray-400"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          defaultValue={editedUser.fatherName}
                          onChange={(e) =>
                            (editedUser.fatherName = e.target.value)
                          }
                          className="text-center w-36 border-2 border-gray-400"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          defaultValue={editedUser.phone}
                          onChange={(e) => (editedUser.phone = e.target.value)}
                          className="text-center w-36 border-2 border-gray-400"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          defaultValue={editedUser.address}
                          onChange={(e) =>
                            (editedUser.address = e.target.value)
                          }
                          className="text-center w-36 border-2 border-gray-400"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          defaultValue={editedUser.pincode}
                          onChange={(e) =>
                            (editedUser.pincode = e.target.value)
                          }
                          className="text-center w-36 border-2 border-gray-400"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          defaultValue={editedUser.country}
                          onChange={(e) =>
                            (editedUser.country = e.target.value)
                          }
                          className="text-center w-36 border-2 border-gray-400"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          defaultValue={editedUser.state}
                          onChange={(e) => (editedUser.state = e.target.value)}
                          className="text-center w-36 border-2 border-gray-400"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          defaultValue={editedUser.city}
                          onChange={(e) => (editedUser.city = e.target.value)}
                          className="text-center w-36 border-2 border-gray-400"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex w-full gap-2 px-2 my-1 font-Nunito justify-center">
                  <a
                    className="bn3637 bn38 border-2 border-green-500 hover:bg-green-300"
                    onClick={updateUser}>
                    Save
                  </a>
                  <a
                    className="bn3637 bn38 border-2 border-gray-700 hover:bg-gray-500 hover:text-white"
                    onClick={() => {
                      setEditDialog(0);
                      setIndex(null);
                    }}>
                    Cancel
                  </a>
                </div>
              </div>
            ) : loggedInUser.email == adminCredentials.email ? (
              <button
                className="bn54"
                onClick={() => {
                  clear("userArr");
                  toast.warning("Cookies Cleared");
                }}>
                <span className="bn54span font-Nunito">Clear</span>
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-screen h-screen bg-gray-100">
        <Menu>
          <a href="/dashboard">Dashboard</a>
          <a href="/viewList">View Cookies</a>
        </Menu>
        <div className="absolute right-0 mt-5 mr-5">
          <a href="/dashboard" className="p-2 bg-black text-white rounded">
            Return to Dashboard
          </a>
        </div>
        <div className="flex justify-center items-center text-5xl w-full h-full font-Bebas_Neue">
          No Cookies
        </div>
      </div>
    );
  }
}

export default ViewList;
