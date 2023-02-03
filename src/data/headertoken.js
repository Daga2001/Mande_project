//------------------------------------------------------------------
//Obtención de los datos del inicio de sesión. -> Necesita controlar la ejecución de estas funciones para poder hacer la autorización.
export let token = null;
export let dataLogin = null;
export let headerToken = null;
export function asignarDataLogin(data) {
  dataLogin = data;
  token = data.token;
  headerToken = {
    headers: {
      Authorization: `Token ${data.token}`,
      "Content-type": "application/json",
    },
  };
}

