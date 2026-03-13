import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { useEffect } from "react";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

// Dark Mode initialization component
function DarkModeInit({ children }) {
    useEffect(() => {
        // Check for saved theme or system preference
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    return children;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <DarkModeInit>
                <App {...props} />
            </DarkModeInit>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
