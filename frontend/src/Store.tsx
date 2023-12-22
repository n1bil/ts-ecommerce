import {
    Dispatch,
    PropsWithChildren,
    Reducer,
    createContext,
    useReducer,
} from "react";
import { Cart, CartItem } from "./types/Cart";

type AppState = {
    mode: string;
    cart: Cart;
};

const initialState: AppState = {
    mode: localStorage.getItem("mode")
        ? localStorage.getItem("mode")!
        : window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    cart: {
        cartItems: localStorage.getItem("cartItems")
            ? JSON.parse(localStorage.getItem("cartItems")!)
            : [],
        shippingAddress: localStorage.getItem("shippingAddress")
            ? JSON.parse(localStorage.getItem("shippingAddress")!)
            : {},
        paymentMethod: localStorage.getItem("paymentMethod")
            ? localStorage.getItem("paymentMethod")!
            : "PayPal",
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
    },
};

type Action =
    | { type: "SWITCH_MODE" }
    | { type: "CART_ADD_ITEM"; payload: CartItem };

const reducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case "SWITCH_MODE":
            return { ...state, mode: state.mode === "dark" ? "light" : "dark" };
        case "CART_ADD_ITEM": {
            const newItem: CartItem = action.payload;
            const existItem: CartItem | undefined = state.cart.cartItems.find(
                (item: CartItem) => item._id === newItem._id
            );
            const cartItems: Array<CartItem> = existItem
                ? state.cart.cartItems.map((item: CartItem) =>
                      item._id === existItem._id ? newItem : item
                  )
                : [...state.cart.cartItems, newItem];

            localStorage.setItem("cartItems", JSON.stringify(cartItems));

            return { ...state, cart: { ...state.cart, cartItems } };
        }
        default:
            return state;
    }
};

const defaultDispatch: Dispatch<Action> = () => initialState;

const Store = createContext({
    state: initialState,
    dispatch: defaultDispatch,
});

const StoreProvider = (props: PropsWithChildren<object>) => {
    const [state, dispatch] = useReducer<Reducer<AppState, Action>>(
        reducer,
        initialState
    );

    return <Store.Provider value={{ state, dispatch }} {...props} />;
};

export { Store, StoreProvider };
