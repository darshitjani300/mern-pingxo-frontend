import { Provider } from "react-redux";
import RouterPage from "./routes/RouterPage";
import { Toaster } from "react-hot-toast";
import { store } from "./redux/store/store";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          toastOptions={{
            duration: 3000,
            position: "top-right",
          }}
        />
        <RouterPage />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
