// --------------------------------------------------------------------------------
// Aca se guardaran consultas o funciones genericas que pertenezcan a React (.jsx)
// --------------------------------------------------------------------------------

/**
 * Esta funcion le permite al cliente consultar su historial de pedidos
 * @param {JSON} config 
 */
export async function   consultarHistorial(config) {
    const data = await fetch(
    `http://127.0.0.1:8000/mande/history/view`, 
    config)
    return data.json()
}