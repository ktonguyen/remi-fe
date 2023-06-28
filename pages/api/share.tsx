import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;
const SignUp = async (req: any, res: any) => {
    if (req.method === 'POST') {
        const token: any = await getToken({ req: req, secret: secret });
        console.log("token", JSON.stringify(req.body))
        try {
            const result = await fetch(`${process.env.API_URL}/api/share`, {
                method: 'POST',
                body: JSON.stringify(req.body),
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token.accessToken}`}
            })
            const user = await result.json();
            res.status(200).json(user);
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: 'An error occurred' });
        }
    }
};
export default SignUp;
  