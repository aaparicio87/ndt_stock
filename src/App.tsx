import { Provider } from 'react-redux'
import MainRoutes from "./routes";
import { store } from "./state/store";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { MultiSelectTheme } from 'chakra-multiselect'

const theme = extendTheme({
  components: {
    MultiSelect: {
      ...MultiSelectTheme,
      baseStyle: (props: any) => {
        const baseStyle = MultiSelectTheme.baseStyle(props) as any
        return {
          ...baseStyle,
        }
      },
    },
  },
})

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
