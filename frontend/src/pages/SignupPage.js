import React, { useState } from 'react';
import axios from 'axios';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    mobileNumber: '',
    email: '',
    password: '',
    address: {
      doorNo: '',
      street: '',
      landmarks: '',
      townCity: '',
      state: '',
      pincode: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9500/auth/userSignup', formData);
      if (response.status === 201) {
        // Handle successful signup
        window.location.href = "/user/user_homepage";
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div>
      <h1>User Signup</h1>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        <br />
        <label>Mobile Number:</label>
        <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
        <br />
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <br />
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        <br />
        <fieldset>
          <legend>Address</legend>
          <label>Door No:</label>
          <input type="text" name="doorNo" value={formData.address.doorNo} onChange={handleAddressChange} required />
          <br />
          <label>Street:</label>
          <input type="text" name="street" value={formData.address.street} onChange={handleAddressChange} required />
          <br />
          <label>Landmarks:</label>
          <input type="text" name="landmarks" value={formData.address.landmarks} onChange={handleAddressChange} />
          <br />
          <label>Town/City:</label>
          <input type="text" name="townCity" value={formData.address.townCity} onChange={handleAddressChange} required />
          <br />
          <label>State:</label>
          <input type="text" name="state" value={formData.address.state} onChange={handleAddressChange} required />
          <br />
          <label>Pincode:</label>
          <input type="text" name="pincode" value={formData.address.pincode} onChange={handleAddressChange} required />
        </fieldset>
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
