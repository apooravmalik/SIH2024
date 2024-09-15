import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Fade, Slide } from 'react-awesome-reveal';
import backgroundImage from '../assets/hero2.jpg';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:8000/api/auth/register', {
          username: values.username,
          email: values.email,
          password: values.password,
        });

        if (response.data) {
          alert('User registered successfully');
          console.log('Response:', response.data);
        }
        navigate('/login');
      } catch (error) {
        console.error('Error during registration:', error.response?.data?.detail || error.message);
        alert('Registration failed');
      }
    },
  });

  return (
    <div
      className="flex justify-center items-center h-screen bg-gray-200 relative w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
  
      <Fade duration={1000}>
        <div className="relative w-full max-w-md bg-white p-8 rounded shadow">
          <Slide direction="down" duration={500}>
            <h2 className="text-2xl font-bold mb-6">Register</h2>
          </Slide>
          <form onSubmit={formik.handleSubmit}>
            <Slide direction="left" duration={500} cascade>
              <div className="mb-4">
                <label className="block text-gray-700">Username:</label>
                <input
                  type="text"
                  name="username"
                  className="w-full px-3 py-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="text-red-500">{formik.errors.username}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500">{formik.errors.email}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password:</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-3 py-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500">{formik.errors.password}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full px-3 py-2 border rounded"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                  <div className="text-red-500">{formik.errors.confirmPassword}</div>
                ) : null}
              </div>
            </Slide>
            <Fade duration={500}>
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" type="submit">
                Register
              </button>
            </Fade>
          </form>
        </div>
      </Fade>
    </div>
  );
};

export default Register;