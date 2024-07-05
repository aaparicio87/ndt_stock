import { Provider } from 'react-redux'
import MainRoutes from "./routes";
import { store } from "./state/store";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme()

function App() {

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <MainRoutes />
      </ChakraProvider>
    </Provider>
  );
}

export default App;
