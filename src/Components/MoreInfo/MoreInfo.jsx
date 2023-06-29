import React from "react";
import "./styles.scss";

export default function MoreInfo({ value, handleChange, findClinics }) {
  return (
    <div className="content-more-info">
      <h3 className="title">¿Deseas añadir algo más? </h3>
      <form className="form">
        <textarea
          rows={3}
          type="text"
          className="input"
          name="campo_opcional"
          value={value}
          onChange={handleChange}
          placeholder="Opcional..."
        />
        <button type="button" className="button-submit" onClick={findClinics}>
          Buscar clinicas
        </button>
      </form>
    </div>
  );
}
