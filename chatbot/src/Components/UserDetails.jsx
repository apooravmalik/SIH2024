import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import backgroundImage from "../assets/hero2.jpg";

const UserDetails = () => {
  const initialValues = {
    name: "",
    phoneNumber: "",
    email: "",
    team: "",
    designation: "",
    holidaysTaken: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    phoneNumber: Yup.string()
      .matches(/^\d+$/, "Must be only digits")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    team: Yup.string().required("Required"),
    designation: Yup.string().required("Required"),
    holidaysTaken: Yup.number()
      .positive("Must be positive")
      .integer("Must be an integer")
      .required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/add-user-details/",
        {
          name: values.name,
          phone_number: values.phoneNumber,
          email: values.email,
          team: values.team,
          designation: values.designation,
          holidays_taken: parseInt(values.holidaysTaken),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data && response.data.message) {
        setStatus({ success: response.data.message });
      } else {
        setStatus({ success: "User details submitted successfully!" });
      }
      
      // You can also handle any additional data returned from the server
      if (response.data && response.data.user_id) {
        console.log(`User created with ID: ${response.data.user_id}`);
        // You could potentially use this ID for further operations or feedback
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        setStatus({ error: error.response.data.detail });
      } else {
        setStatus({ error: "Submission failed. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 p-10 rounded-xl shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              User Sign-Up
            </h2>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form className="mt-8 space-y-6">
                <div className="rounded-md shadow-sm -space-y-px">
                  {[
                    "name",
                    "phoneNumber",
                    "email",
                    "team",
                    "designation",
                    "holidaysTaken",
                  ].map((field, index) => (
                    <div key={field} className={index !== 0 ? "mt-4" : ""}>
                      <label htmlFor={field} className="sr-only">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Field
                        name={field}
                        type={
                          field === "email"
                            ? "email"
                            : field === "holidaysTaken"
                            ? "number"
                            : "text"
                        }
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder={
                          field.charAt(0).toUpperCase() +
                          field
                            .slice(1)
                            .replace(/([A-Z])/g, " $1")
                            .trim()
                        }
                      />
                      <ErrorMessage
                        name={field}
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>

                {status && status.success && (
                  <div className="text-green-600 text-center">
                    {status.success}
                  </div>
                )}
                {status && status.error && (
                  <div className="text-red-600 text-center">{status.error}</div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;