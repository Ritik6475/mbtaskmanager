// src/hooks/useValidateInput.js
import { useState } from 'react';

export default function useValidateInput() {
  const emailApiKey = import.meta.env.VITE_EMAIL_API_KEY;
  const phoneApiKey = import.meta.env.VITE_PHONE_API_KEY;

  const [isValidInput, setIsValidInput] = useState(true);
  const [validationMsg, setValidationMsg] = useState('');

  const validateInput = async (inputValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    const input = inputValue.trim();
    const isEmail = emailRegex.test(input);
    const isPhone = phoneRegex.test(input);

    if (!isEmail && !isPhone) {
      setIsValidInput(false);
      setValidationMsg('Enter a valid email or phone number');
      return false;
    }

    try {
      if (isEmail) {
        const res = await fetch(
          `https://emailvalidation.abstractapi.com/v1/?api_key=${emailApiKey}&email=${input}`
        );
        const data = await res.json();
        if (data.deliverability !== 'DELIVERABLE') {
          setIsValidInput(false);
          setValidationMsg('Email not deliverable');
          return false;
        }
      } else if (isPhone) {
        const res = await fetch(
          `https://apilayer.net/api/validate?access_key=${phoneApiKey}&number=${input}&country_code=IN&format=1`
        );
        const data = await res.json();
        if (!data.valid) {
          setIsValidInput(false);
          setValidationMsg('Phone number is not valid');
          return false;
        }
      }

      // all good
      setIsValidInput(true);
      setValidationMsg('');
      return true;
    } catch (err) {
      setIsValidInput(false);
      setValidationMsg('Unable to validate. Try again later.');
      return false;
    }
  };

  return { isValidInput, validationMsg, validateInput };
}
