import { Col, Row } from "react-bootstrap";
import { Product } from "../types/Product";
import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { LoadingBox } from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import ProductItem from "../components/ProductItem";

type State = {
    products: Array<Product>;
    loading: boolean;
    error: string;
};

type Action =
    | { type: "FETCH_REQUEST" }
    | { type: "FETCH_SUCCESS"; payload: Array<Product> }
    | { type: "FETCH_FAIL"; payload: string };

const initialState: State = {
    products: [],
    loading: true,
    error: "",
};

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, products: action.payload };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function Homepage() {
    const[{ loading, error, products }, dispatch ] = useReducer<React.Reducer<State, Action>>(reducer, initialState);
    
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get('/api/products');
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error as ApiError) });
            }
        }
        fetchData();
    }, []);


    return (
        loading ? (
            <LoadingBox />
        ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
        ) : (
        <Row>
            {products.map((product) => (
                <Col key={product.slug} sm={6} md={4} lg={3}>
                    <ProductItem product={product} />
                </Col>
            ))}
        </Row>
        )
    );
}
