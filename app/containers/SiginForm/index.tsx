import { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PasswordField from 'containers/PasswordField';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import Message from 'containers/Message';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});


export default function SigninForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('An error occurred');
    const handleSubmit = async (values: any) => {
        // Handle form submission
        setLoading(true);
        try {
            const res: any  = await signIn("credentials", { ...values, redirect: false });
            console.log("rest", res);
            if(res.error) {
                setOpen(true);
                setMessage(res.error);
            } else {
                router.push("/");
            }
            
        } catch (error: any) {
            setOpen(true);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
      <Stack spacing={3}>
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        > 
            {({ errors, touched }) => (
                <Form>
                    <Stack spacing={3}>
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
                        
                        <LoadingButton loading={loading} fullWidth size="large" type="submit" variant="contained">
                            Sign In
                        </LoadingButton>
                    </Stack>
                </Form>
            )}
        </Formik>
        <Message
            open={open}
            message={message}
            type={"error"}
            onClose={() => setOpen(false)}
        />      
      </Stack>
    </>
  );
}