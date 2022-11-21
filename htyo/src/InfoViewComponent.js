import React from 'react';

function InfoViewComponent(props) {
  return (
    <div>
      <nav className="info">
        <h1>Tietoja</h1>
        <p>Tekijä: Aleksi Lahtinen</p>
        <p>Käyttöohjeet: Ainakaan toistaseiksi ei näitä ei tarvita</p>
        <p>Kuvat: Pyrin käyttämään vain itse ottamia kuviani.</p>
      </nav>
    </div>
  );
}

export default InfoViewComponent;
