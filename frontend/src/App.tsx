import { Container, Nav, Navbar } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ProductPage from "./pages/ProductPage";

function App() {
    return (
        <div className="d-flex flex-column h-full">
            <header>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand>Amazon</Navbar.Brand>
                    </Container>
                    <Nav>
                        <a href="/cart" className="nav-link">
                            Cart
                        </a>
                        <a href="/signin" className="nav-link">
                            Sign In
                        </a>
                    </Nav>
                </Navbar>
            </header>
            <main>
                <Container className="mt-3">
                    
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<App />} />
                                <Route index={true} element={<Homepage />} />
                                <Route
                                    path="product/:slug"
                                    element={<ProductPage />}
                                />
                            </Routes>
                        </BrowserRouter>
                    
                </Container>
            </main>
            <footer>
                <div className="text-center">All right reserved</div>
            </footer>
        </div>
    );
}

export default App;
