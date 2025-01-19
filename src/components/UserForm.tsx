import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const UserForm: React.FC = () => {
  // State to store the form data
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });

  // State to track if there are form submission errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form data change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form fields
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is not valid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(validate());

    if (Object.keys(errors).length === 0) {
        setIsSubmitting(true);

    await createUserWithEmailAndPassword(auth, formData.email, formData.password)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log('User created:', user);
    })
    .catch((error) => {
        console.error('Error creating user:', error);
        setErrors({ ...errors, general: error.message });
        setIsSubmitting(false);
    });
    }
  };

  return (
    <div className="bg-parchment bg-cover bg-center min-h-screen p-10">
      <div className="max-w-lg mx-auto bg-white shadow-2xl p-8 rounded-xl border-2 border-accent">
        <h2 className="text-3xl font-serif text-primary mb-6">Register for the Royal Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xl text-primary" htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-2 w-full p-3 border-2 border-accent rounded-lg text-secondary bg-light-gray"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xl text-primary" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-2 w-full p-3 border-2 border-accent rounded-lg text-secondary bg-light-gray"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xl text-primary" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-2 w-full p-3 border-2 border-accent rounded-lg text-secondary bg-light-gray"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-white text-xl font-serif rounded-md disabled:bg-gray-400"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
