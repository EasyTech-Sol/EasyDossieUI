import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { routes } from "./router/routes.tsx"
import "./main.css"
import { ErrorProvider } from './contexts/ErrorContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const { worker } = await import('./mocks/browser');
worker.start();

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>

    <StrictMode>
      <ErrorProvider>
        <RouterProvider router={routes} />
      </ErrorProvider>
    </StrictMode>,
  </QueryClientProvider>
)
