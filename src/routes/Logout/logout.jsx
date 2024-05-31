import { redirect } from "react-router-dom";
import { authProvider } from "../../auth";

export async function action() {
    authProvider.logout();
    return redirect("/login");
}