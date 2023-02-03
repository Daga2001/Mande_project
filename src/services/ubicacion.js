import { json } from "react-router-dom";

export function asignarUbicacion(id, direccion) {
  
  let hayCoordenadas = true;
  let lat = null;
  let lng = null;

  function enviar(latitud, longitud) {
    let data = {
      uid: id,
      latitude: latitud,
      longitude: longitud,
    };
    if (hayCoordenadas){
      fetch("http://127.0.0.1:8000/mande/gpslocation/create", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      // .then((res) => console.log("Coordenadas signadas"));
    }
    else {
      console.log("no hay coordenadas")
    }
  }

  fetch(
    `http://api.positionstack.com/v1/forward?access_key=464691bbec21522ec36a86bcb168f7b4&country=CO&region=Cali&query= ${direccion}`
  )
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      if (res.data.length === 0) {
        hayCoordenadas = false;
      } else {
        lat = res.data[0].latitude;
        lng = res.data[0].longitude;
      }
      // console.log(lat, lng);
      enviar(lat, lng);
    });
}
