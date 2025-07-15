import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from "./router/route.jsx"
import { Provider } from 'react-redux'
import store from './app/store.jsx'

function App() {

  return (
    <Provider store={store}>
      <div className="App">
        <RouterProvider router={router}/>
      </div>
    </Provider>
  )
}

export default App
