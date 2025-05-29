import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { routes } from "./router/routes.tsx"
import "./main.css"
import { ErrorProvider } from './contexts/ErrorContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from './contexts/SnackBarContext.tsx'

async function enableMocksIfNeeded() {
  if (import.meta.env.VITE_USE_MSW === 'mocked') {
    const { worker } = await import("./mocks/browser.ts");
    await worker.start();
  }
}

const queryClient = new QueryClient();

enableMocksIfNeeded().then(() =>
  createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <SnackbarProvider>
        <ErrorProvider>
          <RouterProvider router={routes} />
        </ErrorProvider>
      </SnackbarProvider>
    </StrictMode>,
  </QueryClientProvider>
  )

)

