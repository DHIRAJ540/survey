import React from "react";
import "./button.css"
export const PrimaryButton = ({ label, color, onClick }) => {
  return (
    <button className={`button primary_btn ${color}_btn `} onClick={onClick}>
      {label}
    </button>
  );
};

export const SecondaryButton = ({ label, color, onClick }) => {
  return (
    <button className={`button secondary_btn  ${color}_btn`} onClick={onClick}>
      {label}
    </button>
  );
};
