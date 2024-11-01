import React from "react";

function CategoryButton() {
  const listKategori = ['Food', 'Drinks', 'Nugget', 'Rice', 'Special'];

  // Fungsi untuk menangani klik kategori
  const handleClick = (kategori) => {
    alert(`Kategori ${kategori} dipilih!`);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: '25px' }}>
        {listKategori.map((kategori, index) => (
          <button
            key={index}
            onClick={() => handleClick(kategori)}
            style={{
              padding: '10px 20px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '75px',
              cursor: 'pointer',
            }}
          >
            {kategori}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryButton;
