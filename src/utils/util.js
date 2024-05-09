export const formatoFecha = (fecha) => {
    //fecha = "2021-02-06";  // string con la fecha en formato YYYY-MM-DD
    const parts = fecha.split("-");
    const fechaResultado = parts[2] + "/" + parts[1] + "/" + parts[0]; // formato DD/MM/YYYY
    return fechaResultado;
}