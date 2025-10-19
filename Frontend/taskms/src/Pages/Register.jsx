import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../Redux/Slices/authslices.js';
import useValidateInput from '../Customhooks/useValidateInput.jsx';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const { validationMsg, validateInput } = useValidateInput();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [emailValid, setEmailValid] = useState(null);
  const [phoneValid, setPhoneValid] = useState(null);
  const [passwordMatchError, setPasswordMatchError] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEmailBlur = async () => {
    const valid = await validateInput(formData.email);
    setEmailValid(valid);
  };

  const handlePhoneBlur = async () => {
    const valid = await validateInput(formData.phone);
    setPhoneValid(valid);
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ check password match
  if (formData.password !== formData.confirmPassword) {
    setPasswordMatchError('Passwords do not match');
    return;
  }
  setPasswordMatchError('');

  // ✅ optionally validate phone only
  const phoneOk = await validateInput(formData.phone);
  setPhoneValid(phoneOk);
  if (!phoneOk) ;

  // ✅ Skip email validation, just set to null (optional)
  setEmailValid(null);

  // send formData anyway
  const res = await dispatch(registerUser(formData));
  if (registerUser.fulfilled.match(res)) 
    alert('successfully registered')
    navigate('/login');
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create an Account
        </h2>

        {(error || validationMsg || passwordMatchError) && (
          <p className="text-red-500 text-center text-sm font-medium">
            {error || validationMsg || passwordMatchError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <div className="relative">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
            />
            {emailValid === true && (
              <FaCheckCircle className="absolute right-3 top-3 text-green-500" />
            )}
            {emailValid === false && (
              <FaTimesCircle className="absolute right-3 top-3 text-red-500" />
            )}
          </div>

          <div className="relative">
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handlePhoneBlur}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
            />
            {phoneValid === true && (
              <FaCheckCircle className="absolute right-3 top-3 text-green-500" />
            )}
            {phoneValid === false && (
              <FaTimesCircle className="absolute right-3 top-3 text-red-500" />
            )}
          </div>

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold transition duration-200 ${
              loading
                ? 'bg-purple-300 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/" className="text-purple-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
