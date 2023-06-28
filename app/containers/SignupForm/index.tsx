import React, { useState } from 'react';
// @mui
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PasswordField from 'containers/PasswordField';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import MessageNotify from 'containers/Message';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required').min(5, 'Name is too short'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), ""], 'Passwords must match'),
});


export default function SignupForm() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('An error occurred');


    const handleSubmit = async (values: any) => {
        // Handle form submission
        setLoading(true);
        try {
            const res = await fetch("/api/signup", {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { "Content-Type": "application/json" }
            })
            const user = await res.json();
            if(res.status !== 200) {
                setOpen(true);
                setMessage(user.error);
            } else {
               signIn("credentials", { email: values.email, password: values.password })
            }
        } catch (error) {
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
      <Stack spacing={3}>
        <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword : '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        > 
            {({ errors, touched }) => (
                <Form>
                    <Stack spacing={3}>
                        <Field
                            as={TextField}
                            name="name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.name && touched.name)}
                            helperText={<ErrorMessage name="name" />}
                        />
                        <Field
                            as={TextField}
                            name="email"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.email && touched.email)}
                            helperText={<ErrorMessage name="email" />}
                        />
                        <Field
                            as={PasswordField}
                            name="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            type="password"
                            error={Boolean(errors.password && touched.password)}
                            helperText={<ErrorMessage name="password" />}
                        />
                        <Field
                            as={PasswordField}
                            name="confirmPassword"
                            label="Confirm Password"
                            variant="outlined"
                            fullWidth
                            type="password"
                            error={Boolean(errors.confirmPassword && touched.confirmPassword)}
                            helperText={<ErrorMessage name="confirmPassword" />}
                        />
                        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
                            Sign Up
                        </LoadingButton>
                    </Stack>
                </Form>
            )}
        </Formik>
        <MessageNotify
            open={open}
            message={message}
            type={"error"}
            onClose={() => setOpen(false)}
        /> 

      </Stack>
    </>
  );
}