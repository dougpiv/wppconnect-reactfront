import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";

function Base() {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
}

export default Base;
