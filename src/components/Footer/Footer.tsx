import type { CSSProperties } from "react";


function Footer({}){
    const styles : CSSProperties = {
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        height: "3rem",
        zIndex: 10,
        background: "inherit",
        backgroundColor: "rgb(97, 213, 190)",
        /* opacity: 0.5, */
        paddingInline: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
    }

    return(
        <footer style={styles}>
            <a href="https://github.com/MyNameIsClown">MyNameIsClown</a>
        </footer>
    )
}

export default Footer