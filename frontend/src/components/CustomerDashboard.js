import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import NavBar from "./NavBar";

function CustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [annualEarnings, setAnnualEarnings] = useState("");
  const [fileInput, setFileInput] = useState("");
  const [gender, setGender] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [unauthorizedError, setUnauthorizedError] = useState("");

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    if (!access_token || !refresh_token) {
      navigate("/");
    } else {
      fetch("http://127.0.0.1:8000/api/v1/lead/", {
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

  const convertLeadToCustomer = async (customerData) => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/customer/create_customer/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(customerData),
        }
      );
      if (response.ok) {
        console.log("Lead converted to customer successfully");
        return;
      }
      if (response.status === 400) {
        const { access_token } = await refresh(refresh_token);

        // retry the original request with the new access token
        const retryResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/customer/create_customer/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(customerData),
          }
        );
        const retryCustomerData = await retryResponse.json();
        if (retryResponse.ok) {
          console.log("Lead converted to customer successfully");
        } else {
          console.log(
            `Error converting lead to customer: ${retryCustomerData.error}`
          );
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setUnauthorizedError("You are not authorized to perform this action.");
      } else {
        setError(
          "An error occurred while creating the lead. Please try again later."
        );
      }
    }
  };

  const loadLead = (leadId) => {
    const lead = leads.find((lead) => lead.id === leadId);
    setSelectedLead(lead);
  };

  const handleLoadLeadClick = (leadId) => {
    loadLead(leadId);
  };

  const onSubmit = (data) => {
    const { annual_earnings, selectedProduct, file_input } = data;
    // Create the customer data object
    const customerData = {
      annual_earning: annual_earnings,
      products: selectedProduct,
      photo: file_input[0],
      lead: selectedLead.id,
    };
    console.log(customerData);

    convertLeadToCustomer(customerData);
  };

  return (
    <div className="relative flex flex-col overflow-hidden">
      <NavBar handleLogout={handleLogout} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="container mx-auto p-5 min-h-screen overflow-hidden">
            <div className="p-1.5 w-full inline-block align-middle">
              <h2>Convert Lead to Customer</h2>
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
                            onClick={() => handleLoadLeadClick(lead.id)}
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
              {selectedLead && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* render the lead data and additional customer fields here */}
                  <h3>Convert Lead to Customer {selectedLead.id}</h3>
                  <span>{selectedLead.first_name}</span>
                  <br />
                  <span>{selectedLead.middle_name}</span>
                  <br />
                  <span>{selectedLead.phone_number}</span>
                  <br />
                  <label htmlFor="annual_earnings">Annual Earnings:</label>
                  <input
                    type="number"
                    name="annual_earnings"
                    id="annual_earnings"
                    {...register("annual_earnings")}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="file_input"
                  >
                    Upload file
                  </label>
                  <input
                    id="file_input"
                    type="file"
                    {...register("file_input")}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                  />
                  <p
                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="file_input_help"
                  >
                    SVG, PNG, JPG or GIF (MAX. 800x400px).
                  </p>
                  <div className="flex flex-col items-start">
                    <select
                      id="product"
                      name="selectedProduct"
                      {...register("selectedProduct")}
                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select product</option>
                      <option value="A">Product A</option>
                      <option value="B">Product B</option>
                      <option value="C">Product C</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900 false"
                      disabled={isSubmitting}
                    >
                      Convert to Customer
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomerDashboard;
