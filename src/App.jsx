import { ChakraProvider, Box, extendTheme } from "@chakra-ui/react";
import "./App.css";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Chat from "./components/Chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context/appContext";
import { useEffect } from "react";

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "black" : "white",
        color: props.colorMode === "dark" ? "white" : "black",
      },
      button: {
        bg: props.colorMode === "dark" ? "gray.800" : "gray.200",
        color: props.colorMode === "dark" ? "white" : "black",
        _hover: {
          bg: props.colorMode === "dark" ? "gray.700" : "gray.300",
        },
      },
    }),
  },
});

function AppContent() {
  useEffect(() => {
    console.log("AppContent mounted");
  }, []);

  return (
    <Box bg="gray.100" textAlign="center" fontSize="xl">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Chat />
            </>
          }
        />
        <Route path="*" element={<p>Not found</p>} />
      </Routes>
      <Footer />
    </Box>
  );
}

function App() {
  useEffect(() => {
    console.log("App mounted");
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <AppContextProvider>
        <Router>
          <AppContent />
        </Router>
      </AppContextProvider>
    </ChakraProvider>
  );
}

export default App;
