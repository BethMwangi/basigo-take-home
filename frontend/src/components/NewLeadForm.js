import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import NavBar from "./NavBar";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [newLeadData, setNewLeadData] = useState({
    first_name: "",
    middle_name: "",
    phone_number: "",
    location: "",
    gender: "",
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    if (!access_token || !refresh_token) {
      navigate("/");
    } else {
      fetch("http://127.0.0.1:8000/api/v1/lead/create_lead/", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((response) => {
          if (response.status === 401) {
            return fetch("http://127.0.0.1:8000/api/token/refresh/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refresh: refresh_token }),
            });
          }
          return response;
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.access) {
            localStorage.setItem("access_token", data.access);
          }
          setLeads(data);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  const handleNewLeadDataChange = (e) => {
    setNewLeadData({
      ...newLeadData,
      [e.target.name]: e.target.value,
    });
  };

  const refresh = async (refresh_token) => {
    const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refresh_token }),
    });
    const data = await response.json();
    localStorage.setItem("access_token", data.access);
    return { access_token: data.access };
  };

  const handleNewLeadSubmit = async (e) => {
    e.preventDefault();

    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/lead/create_lead/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(newLeadData),
        }
      );
      if (response.status === 401) {
        const { access_token } = await refresh(refresh_token);

        // retry the original request with the new access token
        const retryResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/lead/create_lead/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(newLeadData),
          }
        );
        const data = await retryResponse.json();
        console.log(data);
        setLeads([...leads, data]);
        setNewLeadData({
          first_name: "",
          middle_name: "",
          phone_number: "",
          location: "",
          gender: "",
        });
      } else {
        const data = await response.json();
        console.log(data);
        setLeads([...leads, data]);
        setNewLeadData({
          first_name: "",
          middle_name: "",
          phone_number: "",
          location: "",
          gender: "",
        });
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.phone_number);
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden">
      <NavBar handleLogout={handleLogout} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full pt-0 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
              <form onSubmit={handleNewLeadSubmit}>
                <div className="mb-2">
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700 undefined"
                  >
                    First name
                  </label>
                  <div className="flex flex-col items-start">
                    <input
                      type="text"
                      name="first_name"
                      value={newLeadData.first_name}
                      onChange={handleNewLeadDataChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="middle_name"
                    className="block text-sm font-medium text-gray-700 undefined"
                  >
                    Last Name
                  </label>
                  <div className="flex flex-col items-start">
                    <input
                      type="text"
                      name="middle_name"
                      value={newLeadData.middle_name}
                      onChange={handleNewLeadDataChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 undefined"
                  >
                    Location
                  </label>
                  <div className="flex flex-col items-start">
                    <input
                      type="text"
                      name="location"
                      value={newLeadData.location}
                      onChange={handleNewLeadDataChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 undefined"
                  >
                    Gender
                  </label>
                  <div className="flex flex-col items-start">
                    <select
                      id="gender"
                      name="gender"
                      value={newLeadData.gender}
                      onChange={handleNewLeadDataChange}
                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-medium text-gray-700 undefined"
                  >
                    Phone number
                  </label>
                  <div className="flex flex-col items-start">
                    <input
                      type="tel"
                      name="phone_number"
                      value={newLeadData.phone_number}
                      onChange={handleNewLeadDataChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end mt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900 false"
                  >
                    Add Lead
                  </button>
                </div>
              </form>
            </div>
            <div className="overflow-x-auto">
              <div className="container mx-auto p-5">
                <div className="p-1.5 w-full inline-block align-middle">
                  <div className="overflow-hidden border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase"
                          >
                            ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase"
                          >
                            First Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase"
                          >
                            Middle Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase"
                          >
                            Phone Number
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase"
                          >
                            Location
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase"
                          >
                            Gender
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase"
                          >
                            Edit
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase"
                          >
                            Delete
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {leads && leads.length > 0 ? (
                          leads.map((lead) => (
                            <tr key={lead.id}>
                              <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                {lead.id}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {lead.first_name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {lead.middle_name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {lead.phone_number}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {lead.location}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {lead.gender}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                <a
                                  className="text-green-500 hover:text-green-700"
                                  href="#"
                                >
                                  Edit
                                </a>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                <a
                                  className="text-red-500 hover:text-red-700"
                                  href="#"
                                >
                                  Delete
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-4">
                              No leads found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import NavBar from "./NavBar";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    if (!access_token || !refresh_token) {
      navigate("/");
    } else {
      fetch("http://127.0.0.1:8000/api/v1/lead/create_lead/", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((response) => {
          if (response.status === 401) {
            return fetch("http://127.0.0.1:8000/api/token/refresh/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refresh: refresh_token }),
            });
          }
          return response;
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.access) {
            localStorage.setItem("access_token", data.access);
          }
          setLeads(data);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  const handleNewLeadSubmit = async (data) => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/lead/create_lead/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 401) {
        const { access_token } = await refresh(refresh_token);

        // retry the original request with the new access token
        const retryResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/lead/create_lead/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(data),
          }
        );
        const data = await retryResponse.json();
        console.log(data);
        setLeads([...leads, data]);
        reset();
      } else {
        const data = await response.json();
        console.log(data);
        setLeads([...leads, data]);
        reset();
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.phone_number);
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden">
      <NavBar handleLogout={handleLogout} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full pt-0 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
             
