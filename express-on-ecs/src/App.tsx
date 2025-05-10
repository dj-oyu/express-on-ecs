import { useState, useEffect, Suspense } from 'react'
import './App.css'
import { setMaxIdleHTTPParsers } from 'http';

let response: {message: string};

function App() {
  const ApiHello = async () => {
    if(!response) {
      await new Promise((resolve) => {setTimeout(resolve, 1500)});

      throw new Promise((resolve) => {
        fetch('/api/hello')
          .then((res) => res.json())
          .then((data) => {
            response = data;
            resolve(data);
          }
        )
          .catch((error) => {
            console.error('Error fetching data:', error);
          }
        );
      });
    }
    return <div>{response.message}</div>;
  }

  return (
    <>
      <h1>Hello from express</h1>
      <p>thank you</p>
      <h2>from api message</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <ApiHello />
      </Suspense>
    </>
  );
}

export default App
