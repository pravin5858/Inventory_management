// No Longer we use this file This file replace with the Auth.js. It may be removed in future.


// Import from react library
import React, { useState, useEffect } from 'react';
// react router imports
import { useNavigate } from "react-router-dom";
// mui library import
import { Container, Card, CardContent, Tabs, Tab, TextField, Button, Box } from '@mui/material';
// external different library
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { toast } from 'react-toastify'
// Internal(Custom) Hooks
import useAPI from '../hooks/APIHandler';

function AuthScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const { callApi, error, loading } = useAPI();  // apihandler work // loading is used at apihandler.

  const validatePhoneNumber = (phone) => {
    const formattedPhone = phone.replace(/^\+91/, ''); // Strip +91 for validation
    return formattedPhone.length === 12 && /^\d+$/.test(formattedPhone); // 10 digits required after +91
  };

  const doLogin = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    
    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    try {
      const response = await callApi({
        url: "http://localhost:8000/api/auth/login/",
        method: "POST",
        body: { username, password },
      });

      if (response?.data?.access) {
        localStorage.setItem("token", response.data.access);
        toast.success("Login successful!");
        navigate("/home");
      } else {
        toast.error("Invalid username or password");
      }
    } catch (err) {
      console.error("Error during login:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  const doSignup = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirmPasswordValue = e.target.confirmPassword.value;
  
    // Password and Confirm Password Validation
    if (password !== confirmPasswordValue) {
      toast.error("Passwords do not match");
      return;
    }
  
    // Password Strength Validation (min 8, max 16, special, upper, lower, numeric)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must be 8-16 characters long and include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.");
      return;
    }
  
    // Phone Number Validation
    if (!validatePhoneNumber(phone)) {
      toast.error("Phone number must have exactly 10 digits after +91");
      return;
    }
  
    // Email Validation
    const email = e.target.email.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
  
    // Form Data Construction
    const formData = new FormData();
    formData.append("username", e.target.username.value);
    formData.append("email", email);
    formData.append("phone", `+${phone}`);
    formData.append("password", password);
    if (profilePic) formData.append("profile_pic", profilePic);
  
    try {
      // API Call
      const response = await callApi({
        url: "http://localhost:8000/api/auth/signup/",
        method: "POST",
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Handling the Response
      if (response?.data?.error === "Username not available") {
        // Show error message
        toast.error("Username not available.");
  
        // Display username suggestions
        const suggestions = response.data.suggestions;
        if (suggestions && suggestions.length > 0) {
          const suggestionMessage = `Suggested usernames: ${suggestions.join(", ")}`;
          toast.info(suggestionMessage);
        }
      } else if (response?.data) {
        // Successful signup
        console.log("Signup response: ", response.data);
        localStorage.setItem("token", response.data.access);
        toast.success("Signup Successful");
        setSignupSuccess(true);
      } else {
        toast.error("Signup failed, please try again");
      }
    } catch (err) {
      // Display the error message from the server
      const errorMessage = err?.response?.data?.error || "An error occurred during signup";
      toast.error(errorMessage);
    }
  };
  
  

  // Redirect to login tab on successful signup
  useEffect(() => {
    if (signupSuccess) {
      setActiveTab(0); // Switch to login tab
      setSignupSuccess(false); // Reset signup success flag
    }
  }, [signupSuccess]);

  return (
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ mt: 2 }}>
              <h2>Login</h2>
              <form onSubmit={doLogin}>
                <TextField label="Username" name="username" fullWidth margin="normal" variant="outlined" required />
                <TextField label="Password" name="password"  type="password" fullWidth margin="normal" variant="outlined" required />
                <Button variant="contained" color="primary" fullWidth type="submit">Login</Button>
              </form>
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <h2>Sign Up</h2>
              <form onSubmit={doSignup}>
                <TextField label="Username" name="username" fullWidth margin="normal" variant="outlined" required />
                <TextField label="Email" name="email" fullWidth margin="normal" variant="outlined" required />
                <PhoneInput
                  country={'in'}
                  onlyCountries={['in']}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  inputStyle={{
                    width: '100%',
                    paddingLeft: '50px',
                    paddingTop: '18.5px',
                    paddingBottom: '18.5px',
                    marginTop: '16px',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    fontSize: '16px',
                  }}
                  containerStyle={{ width: '100%' }}
                  // disableCountryCode
                  // disableDropdown
                  specialLabel=''
                  placeholder="Enter 10-digit phone number"
                />
                <TextField label="Password" name="password" type="password" fullWidth margin="normal" variant="outlined" required />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} required
                />
                {/* Profile Picture Input */}
                <TextField
                  type="file"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
                <Button variant="contained" color="primary" fullWidth type="submit">Sign Up</Button>
              </form>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default AuthScreen;
