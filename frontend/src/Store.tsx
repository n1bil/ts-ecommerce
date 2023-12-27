import { Dispatch, PropsWithChildren, Reducer, createContext, useReducer } from "react";
import { Cart, CartItem, ShippingAddress } from "./types/Cart";
import { UserInfo } from "./types/UserInfo";

type AppState = {
    mode: string;
    cart: Cart;
    userInfo?: UserInfo;
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
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')!)
        : null,
};

type Action =
    | { type: "SWITCH_MODE" }
    | { type: "CART_ADD_ITEM"; payload: CartItem }
    | { type: "CART_REMOVE_ITEM"; payload: CartItem }
    | { type: 'USER_SIGNIN'; payload: UserInfo }
    | { type: 'USER_SIGNOUT' }
    | { type: 'SAVE_SHIPPING_ADDRESS'; payload: ShippingAddress }

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
        case "CART_REMOVE_ITEM": {
            const cartItems = state.cart.cartItems.filter((item: CartItem) => 
                item._id !== action.payload._id
            )
            localStorage.setItem('cartItems', JSON.stringify(cartItems))
            return { ...state, cart: { ...state.cart, cartItems } }
        }
        case "USER_SIGNIN":
            return { ...state, userInfo: action.payload }
        case "USER_SIGNOUT":
            return {
                mode:
                    window.matchMedia &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches
                        ? 'dark'
                        : 'light',
                cart: {
                    cartItems: [],
                    paymentMethod: 'PayPal',
                    shippingAddress: {
                        fullName: '',
                        address: '',
                        postalCode: '',
                        city: '',
                        country: '',
                    },
                    itemsPrice: 0,
                    shippingPrice: 0,
                    taxPrice: 0,
                    totalPrice: 0,
                },
            }
        case 'SAVE_SHIPPING_ADDRESS': 
            return { ...state, cart: { ...state.cart, shippingAddress: action.payload } }
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
