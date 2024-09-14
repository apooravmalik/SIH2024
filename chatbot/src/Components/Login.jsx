import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Fade, Slide } from 'react-awesome-reveal';
import backgroundImage from '../assets/Hero.png';

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', values);
        console.log('Login successful, OTP sent to email:', response.data);
        localStorage.setItem('username', values.username);
        navigate('/otp');
      } catch (error) {
        console.error('Login failed', error.response ? error.response.data : error.message);
        alert('Login failed. Please check your credentials and try again.');
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
            <h2 className="text-2xl font-bold mb-6">Login</h2>
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
            </Slide>
            <Fade duration={500}>
              <button
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                type="submit"
              >
                Login
              </button>
            </Fade>
          </form>
        </div>
      </Fade>
    </div>
  );
};

export default Login;