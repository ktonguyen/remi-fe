import React, { useState } from 'react';
// @mui
import { Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MessageNotify from 'containers/Message';
import { signOut } from 'next-auth/react';

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required').max(500, 'Title is too long'),
    url: Yup.string().matches(
        /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,
        'Enter correct url!'
    ).required('Url is required').max(500, 'Url is too long'),
});


export default function ShareForm() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('error');
    const [message, setMessage] = useState('An error occurred');


    const handleSubmit = async (values: any) => {
        // Handle form submission
        setLoading(true);
        try {
            const res = await fetch("/api/share", {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { "Content-Type": "application/json" }
            })
            const video = await res.json();
            if(res.status !== 200) {
                setOpen(true);
                setMessage(video.error);
                if(res.status === 401 || res.status === 403) {
                    signOut();
                }
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
            initialValues={{ title: '', url: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        > 
            {({ errors, touched }) => (
                <Form>
                    <Stack spacing={3}>
                        <Field
                            as={TextField}
                            name="title"
                            label="Title"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.title && touched.title)}
                            helperText={<ErrorMessage name="title" />}
                        />
                        <Field
                            as={TextField}
                            name="url"
                            label="Url Youtube"
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.url && touched.url)}
                            helperText={<ErrorMessage name="url" />}
                        />
                        <Typography variant="caption">Eg: https://www.youtube.com/watch?v=_cTPsWX_JRk</Typography>
                        
                        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
                            Share
                        </LoadingButton>
                    </Stack>
                </Form>
            )}
        </Formik>
        <MessageNotify
            open={open}
            message={message}
            type={severity}
            onClose={() => setOpen(false)}
        /> 

      </Stack>
    </>
  );
}