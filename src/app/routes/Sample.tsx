import React, { useEffect, useState } from "react";
import Header from "../../features/sq-framework/header/Header";
import TabDiv from "../../features/sq-framework/TabDiv";
import PaginationBox from "../../features/sq-framework/PaginationBox";
import ButtonCatalog from "../../features/sq-framework/buttons/ButtonCatalog";
import LoginModal from "../../features/sq-framework/modals/LoginModal";
import { useModal } from "../contexts/ModalContext";
import { useTheme } from "../hooks/useTheme"; // or relative path

const Sample: React.FC = () => {
  const modalContext = useModal();
  const { token, fontFamily, themeName, setThemeName } = useTheme();

  // local switch that mirrors provider theme
  const [darkMode, setDarkMode] = useState(themeName === "light");

  // whenever local switch changes, update provider theme
  useEffect(() => {
    setThemeName(darkMode ? "dark" : "light");
  }, [darkMode, setThemeName]);

  return (
    <>
      <Header />

      {/* Theme toggle */}
      <div className="w-full flex items-center gap-3 px-4 py-3">
        <span className="text-sm opacity-80">Theme:</span>
        <button
          className="px-3 py-1 rounded border text-sm"
          onClick={() => setDarkMode(v => !v)}
        >
          {darkMode ? "Dark" : "Light"} (click to toggle)
        </button>
      </div>

      {/* Main Body */}
      <div
        className="mt-25 w-full h-full"
        style={{
          backgroundColor: token("page.bg"),
          color: token("page.text"),
          fontFamily: fontFamily("inter"),
        }}
      >
        <TabDiv
          className="w-full h-full"
        >
          <div data-label="Tab 1" className="w-full h-full flex">
            <PaginationBox style={{ backgroundColor: token("section.bg") }}>
              <div className="w-full h-full flex">
                <ButtonCatalog
                  imageUrl="/path/to/product1.png"
                  hoverImageUrl="/path/to/product1-hover.png"
                  title="Product 1"
                  shortDesc="Short description"
                  price="$10.00"
                />
                <ButtonCatalog
                  imageUrl="/path/to/product1.png"
                  hoverImageUrl="/path/to/product1-hover.png"
                  title="Product 1"
                  shortDesc="Short description"
                  price="$10.00"
                />
              </div>
              <div>Content 2</div>
              <div>Content 3</div>
            </PaginationBox>
          </div>
          <div data-label="Tab 2">Content 2</div>
          <div data-label="Tab 3">Content 3</div>
        </TabDiv>
      </div>

      <LoginModal closePopup={() => modalContext.setIsLoginModalOpen(false)} />
    </>
  );
};

export default Sample;
