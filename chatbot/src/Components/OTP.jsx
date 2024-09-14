import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Fade, Slide } from 'react-awesome-reveal';
import backgroundImage from '../assets/Hero.png';

const OTPVerification = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const formik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .length(6, 'OTP must be exactly 6 digits')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:8000/api/auth/verify-otp/', {
          username,
          otp: values.otp,
        });
        console.log('OTP verified, access token received:', response.data);
        localStorage.setItem('access_token', response.data.access_token);
        navigate('/dashboard');
      } catch (error) {
        console.error('OTP verification failed', error.response ? error.response.data : error.message);
        alert('OTP verification failed. Please try again.');
      }
    },
  });

  return (
    <div className="relative h-screen w-full bg-gray-200">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 flex justify-center items-center h-full">
        <Fade duration={1000}>
          <div className="w-full max-w-md bg-white p-8 rounded shadow">
            <Slide direction="down" duration={500}>
              <h2 className="text-2xl font-bold mb-6">OTP Verification</h2>
            </Slide>
            <form onSubmit={formik.handleSubmit}>
              <Slide direction="left" duration={500}>
                <div className="mb-4">
                  <label className="block text-gray-700">Enter OTP:</label>
                  <input
                    type="text"
                    name="otp"
                    className="w-full px-3 py-2 border rounded"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.otp}
                  />
                  {formik.touched.otp && formik.errors.otp ? (
                    <div className="text-red-500">{formik.errors.otp}</div>
                  ) : null}
                </div>
              </Slide>
              <Fade duration={500}>
                <button
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  type="submit"
                >
                  Verify OTP
                </button>
              </Fade>
            </form>
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default OTPVerification;