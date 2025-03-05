'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void; }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section>
      <h1>Oups, une erreur est survenue !</h1>
      <p>Veuillez réessayer plus tard.</p>
      <button onClick={() => reset()}>Réessayer</button>
    </section>
  );
}