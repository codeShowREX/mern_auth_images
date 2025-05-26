import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast, Toaster } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { updateUser } from '../helper/helper';
import { profileValidation } from '../helper/validate';
import { convertToBase64 } from '../helper/convert';
import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css';
import avatar from '../assets/profile.png';

export default function Profile() {
  const { user, logout, checkAuth } = useAuthStore();
  const [file, setFile] = useState();
  const navigate = useNavigate();
 
  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      try {
        const updateData = {
          ...values,
          profile: file || user?.profile || ''
        };
        
        if (!updateData.currentPassword) {
          delete updateData.currentPassword;
          delete updateData.newPassword;
          delete updateData.confirmPassword;
        }

        const response = await updateUser(updateData);
        if (response.success) {
          toast.success('Profile Updated Successfully!');
          await checkAuth();
        } else {
          toast.error(response.message || 'Could not Update Profile!');
        }
      } catch (error) {
        toast.error(error.message || 'Could not Update Profile!');
      }
    }
  });

  const onUpload = async e => {
    try {
      const base64 = await convertToBase64(e.target.files[0]);
      setFile(base64);
    } catch (error) {
      toast.error('Failed to process image');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8">
      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center min-h-screen py-4 sm:py-6 md:py-8'>
        <div className={`${styles.glass} ${extend.glass} w-full max-w-2xl p-4 sm:p-6 md:p-8`}>

          <div className="title flex flex-col items-center">
            <h4 className='text-3xl sm:text-4xl md:text-5xl font-bold'>Profile</h4>
            <span className='py-4 text-base sm:text-lg md:text-xl w-2/3 text-center text-gray-500'>
              Update your profile information
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor="profile" className="cursor-pointer group">
                <div className="relative">
                  <img 
                    src={user?.profile || file || avatar} 
                    className={`${styles.profile_img} ${extend.profile_img} w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-green-500 transition-transform duration-200 group-hover:scale-105`} 
                    alt="avatar" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-white text-sm sm:text-base">Change Photo</span>
                  </div>
                </div>
              </label>
              <input 
                onChange={onUpload} 
                type="file" 
                id='profile' 
                name='profile' 
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="textbox flex flex-col items-center gap-4 sm:gap-6">
              <div className="name flex flex-col sm:flex-row w-full sm:w-3/4 gap-4 sm:gap-10">
                <input 
                  {...formik.getFieldProps('firstName')} 
                  className={`${styles.textbox} ${extend.textbox} w-full p-3 sm:p-4 text-base rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`} 
                  type="text" 
                  placeholder='First Name' 
                />
                <input 
                  {...formik.getFieldProps('lastName')} 
                  className={`${styles.textbox} ${extend.textbox} w-full p-3 sm:p-4 text-base rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`} 
                  type="text" 
                  placeholder='Last Name' 
                />
              </div>

              <div className="name flex flex-col sm:flex-row w-full sm:w-3/4 gap-4 sm:gap-10">
                <input 
                  {...formik.getFieldProps('mobile')} 
                  className={`${styles.textbox} ${extend.textbox} w-full p-3 sm:p-4 text-base rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`} 
                  type="tel" 
                  placeholder='Mobile No.' 
                />
                <input 
                  {...formik.getFieldProps('email')} 
                  className={`${styles.textbox} ${extend.textbox} w-full p-3 sm:p-4 text-base rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`} 
                  type="email" 
                  placeholder='Email*' 
                />
              </div>

              <input 
                {...formik.getFieldProps('address')} 
                className={`${styles.textbox} ${extend.textbox} w-full sm:w-3/4 p-3 sm:p-4 text-base rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`} 
                type="text" 
                placeholder='Address' 
              />

              <div className="password-section w-full sm:w-3/4">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Change Password</h3>
                <div className="flex flex-col gap-4">
                  <input 
                    {...formik.getFieldProps('currentPassword')} 
                    className={`${styles.textbox} ${extend.textbox} w-full p-3 sm:p-4 text-base rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`} 
                    type="password" 
                    placeholder='Current Password' 
                  />
                  <input 
                    {...formik.getFieldProps('newPassword')} 
                    className={`${styles.textbox} ${extend.textbox} w-full p-3 sm:p-4 text-base rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`} 
                    type="password" 
                    placeholder='New Password' 
                  />
                  <input 
                    {...formik.getFieldProps('confirmPassword')} 
                    className={`${styles.textbox} ${extend.textbox} w-full p-3 sm:p-4 text-base rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`} 
                    type="password" 
                    placeholder='Confirm New Password' 
                  />
                </div>
              </div>

              <button 
                className={`${styles.btn} w-full sm:w-3/4 py-3 px-4 text-base sm:text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
                transition-all duration-200`} 
                type='submit'
              >
                Update Profile
              </button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500 text-sm sm:text-base'>
                Want to logout? <button onClick={handleLogout} className='text-red-500 hover:text-red-600 transition-colors duration-200'>Logout</button>
              </span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export async function updateUser(data) {
  const token = localStorage.getItem('token');
  return fetch('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

