import React, { useState } from 'react';
import AssociateDossierClass from './AssociateDossierClass'; // ajuste o caminho

export default function ModalSimples() {
  const [open, setOpen] = useState(true); // já começa aberto

  return (
    <div>
      <AssociateDossierClass
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
