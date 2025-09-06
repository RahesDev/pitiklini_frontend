import React from "react";

function GoogleTranslate() {
    const handleTranslate = (lang) => {
        const currentURL = window.location.href;
        if (lang === "en") {
            window.location.href = currentURL.split("#googtrans")[0]; // Reset to English
        } else {
            window.location.href = `https://translate.google.com/translate?hl=${lang}&sl=auto&tl=${lang}&u=${encodeURIComponent(currentURL)}`;
        }
    };

    return (
        <div style={{ margin: "10px" }}>
            {/* <label style={{ color: "white", fontSize: "14px", marginRight: "10px" }}>Select Language:</label> */}
            <select
                onChange={(e) => handleTranslate(e.target.value)}
                style={{
                    backgroundColor: "#1a1a1a",
                    color: "white",
                    border: "2px solid #ffc107",
                    borderRadius: "5px",
                    padding: "5px",
                    fontSize: "14px",
                    cursor: "pointer",
                }}
            >
                <option value="en">English</option>
                <option value="es">Spanish</option>
            </select>
        </div>
    );
}

export default GoogleTranslate;
