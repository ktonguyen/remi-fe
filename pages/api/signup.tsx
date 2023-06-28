const SignUp = async (req: any, res: any) => {
    if (req.method === 'POST') {
        try {
            const result = await fetch(`${process.env.API_URL}/auth/signup`, {
                method: 'POST',
                body: JSON.stringify(req.body),
                headers: { "Content-Type": "application/json" }
            })
            const user = await result.json();
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: 'An error occurred' });
        }
    }
};
export default SignUp;
  