import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../Redux/Slices/authslices.js';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import useValidateInput from '../Customhooks/usevalidateinput.jsx';
import GoogleLoginButton from '../Components/Googleloginbutton.jsx';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // custom hook for validation
  const { isValidInput, validationMsg, validateInput } = useValidateInput();

  // ✅ now using identifier (email or phone)
  const [formData, setFormData] = useState({ identifier: '', password: '' });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // validate on blur
  const handleBlur = () => {
    if (formData.identifier.trim()) {
      validateInput(formData.identifier);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateInput(formData.identifier);
    if (!isValid) ;

    const res = await dispatch(loginUser(formData)); // now sending identifier + password
    if (loginUser.fulfilled.match(res)) ;
     localStorage.removeItem("userId");

    localStorage.setItem("userId", res.payload.userId);

      navigate('/homepage');
      ;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Sign In</h2>

        {(error || validationMsg) && (
          <p className="text-red-500 text-center">{error || validationMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              name="identifier" // ✅ email or phone field
              type="text"
              placeholder="Email or Phone"
              value={formData.identifier}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                isValidInput
                  ? 'focus:ring-blue-400 border-gray-300'
                  : 'border-red-500 focus:ring-red-400'
              }`}
            />
            {/* tick / cross icon */}
            {formData.identifier && (
              <span className="absolute right-3 top-3 text-xl">
                {isValidInput ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
              </span>
            )}
          </div>

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
