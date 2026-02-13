import { RouterProvider } from 'react-router-dom'
import router from './routes/router'
import { Toaster } from 'react-hot-toast'
import AuthContextProvider from './context/AuthContext'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>

        <AuthContextProvider>


          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
                zIndex: 9999,
              },
            }}
          />

          <RouterProvider router={router} />


        </AuthContextProvider>

      </QueryClientProvider>
    </>
  )
}

export default App