import { RouterProvider } from 'react-router-dom'
import router from './routes/router'
import { Toaster } from 'react-hot-toast'
import AuthContextProvider from './context/AuthContext'
import PostContextProvider from './context/PostContext'



function App() {

  return (
    <>
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

        <PostContextProvider>

          <RouterProvider router={router} />

        </PostContextProvider>

      </AuthContextProvider>
    </>
  )
}

export default App
