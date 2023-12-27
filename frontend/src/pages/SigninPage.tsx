import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { useSignInMutation } from "../hooks/userHooks";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { LoadingBox } from "../components/LoadingBox";

const SigninPage = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectUrl ? redirectUrl : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state: { userInfo }, dispatch } = useContext(Store);

    const { mutateAsync: signin, status } = useSignInMutation();

    const submitHandler = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        try {
            const data = await signin({ email, password });
            dispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
        } catch (err) {
            toast.error(getError(err as ApiError));
        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    return (
        <Container className="small-container">
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className="my-3">Sign In</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        required
                        onChange={event => setEmail(event.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        required
                        onChange={event => setPassword(event.target.value)}
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button disabled={status === 'pending'} type="submit">
                        Sign In
                    </Button>
                    {status === 'pending' && <LoadingBox />}
                </div>
                <div className="mb-3">
                    New customer ?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
                </div>
            </Form>
        </Container>
    );
};

export default SigninPage;
