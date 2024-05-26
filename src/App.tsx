import { Provider } from 'react-redux'
import MainRoutes from "./routes";
import { store } from "./state/store";
import { ChakraProvider } from '@chakra-ui/react'


function App() {

  return (
    <Provider store={store}>
      <ChakraProvider>
        <MainRoutes />
      </ChakraProvider>
    </Provider>
  );
}

export default App;
