const SignUp = async (req: any, res: any) => {
    if (req.method === 'POST') {
        try {
            const result = await fetch(`${process.env.API_URL}/api/videos`, {
                method: 'POST',
                body: JSON.stringify(req.body),
                headers: { "Content-Type": "application/json" }
            })
            const videos = await result.json();
            res.status(200).json(videos);
        } catch (error) {
            res.status(400).json({ error: 'An error occurred' });
        }
    }
};
export default SignUp;
  