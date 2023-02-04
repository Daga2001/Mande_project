import React, { useState, useContext } from "react";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import "./paymentForm.scss";
import { Context } from "../../context/Context";

const PaymentForm = () => {
  const context = useContext(Context);
  const [state, setState] = useState({
    number: "",
    name: context.appState.name,
    expiry: "",
    cvc: "",
    focus: "",
    type: "",
  });

  const handleInputChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleFocusChange = (e) => {
    setState({
      ...state,
      focus: e.target.name,
    });
  };

  // console.log(context)

  const processPayment = () => {
    // console.log("number => ", state.number);
    // console.log("name => ", state.name);
    // console.log("expiry => ", state.expiry);
    // console.log("cvc => ", state.cvc);
    // console.log(JSON.stringify(state));

    let data = {
      num: state.number,
      type: state.type,
      expiration_dt: state.expiry,
      cvv: state.cvc,
      uid: context.appState.registro.id,
    };
    // console.log("datos",data)

    fetch("http://127.0.0.1:8000/mande/paymentMethod/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res));
  };

  return (
    <div className="card">
      <div className="container_card">
        <div className="card-body">
          <div className="tarjeta">
            <Cards
              number={state.number}
              name={state.name}
              expiry={state.expiry}
              cvc={state.cvc}
              focused={state.focus}
            />
          </div>
          <form className="formulario">
            <div className="form-group">
              <label htmlFor="number">Número de la tarjeta</label>
              <input
                type="text"
                name="number"
                id="number"
                maxLength="16"
                className="form-control"
                onChange={handleInputChange}
                onFocus={handleFocusChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                disabled
                type="text"
                name="name"
                id="name"
                defaultValue={context.appState.name}
                maxLength="30"
                className="form-control"
                onChange={handleInputChange}
                onFocus={handleFocusChange}
              />
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="expiry">Fecha de expiración</label>
                <input
                  type="date"
                  name="expiry"
                  id="expiry"
                  className="form-control"
                  onChange={handleInputChange}
                  onFocus={handleFocusChange}
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="cvc">CVC</label>
                <input
                  type="text"
                  name="cvc"
                  id="cvc"
                  maxLength="4"
                  className="form-control"
                  onChange={handleInputChange}
                  onFocus={handleFocusChange}
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="type">Tipo</label>
                <input
                  type="text"
                  name="type"
                  id="type"
                  className="form-control"
                  onChange={handleInputChange}
                  onFocus={handleFocusChange}
                />
              </div>
            </div>

            <button
              onClick={processPayment}
              type="button"
              className="btn btn-success btn-block btn-lg"
            >
              Validar datos
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
