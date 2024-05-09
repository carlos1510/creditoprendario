export const numeroALetras = (cantidad, moneda) => {

    let numero = 0;
    //cantidad = filterNum(cantidad);
    cantidad = parseFloat(cantidad);

    if (cantidad == "0.00" || cantidad == "0") {
        if (moneda){
            return "CERO 00/100 " + moneda;
        }else {
            return "CERO 00/100 " + moneda;
        }

    } else {
        let ent = cantidad.toString().split(".");
        let arreglo = separar_split(ent[0]);
        let longitud = arreglo.length;

        switch (longitud) {
            case 1:
                numero = unidades(arreglo[0]);
                break;
            case 2:
                numero = decenas(arreglo[0], arreglo[1]);
                break;
            case 3:
                numero = centenas(arreglo[0], arreglo[1], arreglo[2]);
                break;
            case 4:
                numero = unidadesdemillar(arreglo[0], arreglo[1], arreglo[2], arreglo[3]);
                break;
            case 5:
                numero = decenasdemillar(arreglo[0], arreglo[1], arreglo[2], arreglo[3], arreglo[4]);
                break;
            case 6:
                numero = centenasdemillar(arreglo[0], arreglo[1], arreglo[2], arreglo[3], arreglo[4], arreglo[5]);
                break;
            case 7:
                numero = unidadesdemillon(arreglo[0], arreglo[1], arreglo[2], arreglo[3], arreglo[4], arreglo[5], arreglo[6]);
                break;
            case 8:
                numero = decenasdemillon(arreglo[0], arreglo[1], arreglo[2], arreglo[3], arreglo[4], arreglo[5], arreglo[6], arreglo[7]);
                break;
            case 9:
                numero = centenasdemillon(arreglo[0], arreglo[1], arreglo[2], arreglo[3], arreglo[4], arreglo[5], arreglo[6], arreglo[7], arreglo[8]);
                break;
            default:
                numero = "______________________________________________________________________";
                break;
        }

        var centimos = isNaN(ent[1]) ? '00' : ent[1];
        if (centimos.length == 1){
            centimos = centimos + "0";
        }

        if (cantidad == "1000000" && numero == "UN MILLÓN MIL ") {
            numero = "UN MILLÓN ";
        }

        let divisibleEntreUnMillon = parseInt(cantidad) % 1000000;

        if (divisibleEntreUnMillon == 0) {
            numero = numero.replace("MILLONES MIL", "MILLONES");
        }

        if (moneda) {
            if (cantidad == "1000000" && numero == "UN MILLÓN ") {
                numero = "UN MILLÓN DE";
            }
            if (divisibleEntreUnMillon == 0 && parseInt(cantidad) > 1000000) {
                numero = numero.replace("MILLONES", "MILLONES DE");
            }
            return numero + " CON " + centimos + "/100 " + moneda;
        } else {
            return numero + " CON " + centimos + "/100";
        }
    }
}

const unidades = (unidad) => {
    const unidades = Array('UN ', 'DOS ', 'TRES ', 'CUATRO ', 'CINCO ', 'SEIS ', 'SIETE ', 'OCHO ', 'NUEVE ');

    return unidades[unidad - 1];
}

const decenas = (decena, unidad) => {
    const diez = Array('ONCE ', 'DOCE ', 'TRECE ', 'CATORCE ', 'QUINCE', 'DIECISEIS ', 'DIECISIETE ', 'DIECIOCHO ', 'DIECINUEVE ');
    const decenas = Array('DIEZ ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA');

    if (decena == 0 && unidad == 0) {
        return "";
    }

    if (decena == 0 && unidad > 0) {
        return unidades(unidad);
    }

    if (decena == 1) {
        if (unidad == 0) {
            return decenas[decena - 1];
        } else {
            return diez[unidad - 1];
        }
    } else if (decena == 2) {
        if (unidad == 0) {
            return decenas[decena - 1];
        }
        else if (unidad == 1) {
            return veinte = "VEINTI" + "UNO ";
        }
        else {
            return veinte = "VEINTI" + unidades(unidad);
        }
    } else {

        if (unidad == 0) {
            return decenas[decena - 1] + " ";
        }
        if (unidad == 1) {
            return decenas[decena - 1] + " Y " + "UNO ";
        }

        return decenas[decena - 1] + " Y " + unidades(unidad);
    }
}

const centenas = (centena, decena, unidad) => {
    const centenas = Array("CIENTO ", "DOSCIENTOS ", "TRESCIENTOS ", "CUATROCIENTOS ", "QUINIENTOS ", "SEISCIENTOS ", "SETECIENTOS ", "OCHOCIENTOS ", "NOVECIENTOS ");

    if (centena == 0 && decena == 0 && unidad == 0) {
        return "";
    }
    if (centena == 1 && decena == 0 && unidad == 0) {
        return "CIEN ";
    }

    if (centena == 0 && decena == 0 && unidad > 0) {
        return unidades(unidad);
    }

    if (decena == 0 && unidad == 0) {
        return centenas[centena - 1] + "";
    }

    if (decena == 0) {
        let numero = centenas[centena - 1] + "" + decenas(decena, unidad);
        return numero.replace(" Y ", " ");
    }
    if (centena == 0) {

        return decenas(decena, unidad);
    }

    return centenas[centena - 1] + "" + decenas(decena, unidad);

}

const unidadesdemillar = (unimill, centena, decena, unidad) => {
    let numero = unidades(unimill) + "MIL " + centenas(centena, decena, unidad);
    numero = numero.replace("UN MIL ", "MIL ");
    if (unidad == 0) {
        return numero.replace(" Y ", " ");
    } else {
        return numero;
    }
}

const decenasdemillar = (decemill, unimill, centena, decena, unidad) => {
    let numero = decenas(decemill, unimill) + "MIL " + centenas(centena, decena, unidad);
    return numero;
}

const centenasdemillar = (centenamill, decemill, unimill, centena, decena, unidad) => {
    let numero = 0;
    numero = centenas(centenamill, decemill, unimill) + "MIL " + centenas(centena, decena, unidad);

    return numero;
}

const unidadesdemillon = (unimillon, centenamill, decemill, unimill, centena, decena, unidad) => {
    let numero = unidades(unimillon) + "MILLONES " + centenas(centenamill, decemill, unimill) + "MIL " + centenas(centena, decena, unidad);
    numero = numero.replace("UN MILLONES ", "UN MILLÓN ");
    if (unidad == 0) {
        return numero.replace(" Y ", " ");
    } else {
        return numero;
    }
}

const decenasdemillon = (decemillon, unimillon, centenamill, decemill, unimill, centena, decena, unidad) => {
    let numero = decenas(decemillon, unimillon) + "MILLONES " + centenas(centenamill, decemill, unimill) + "MIL " + centenas(centena, decena, unidad);
    return numero;
}

const centenasdemillon = (centenamillon, decemillon, unimillon, centenamill, decemill, unimill, centena, decena, unidad) => {
    let numero = 0;
    numero = centenas(centenamillon, decemillon, unimillon) + "MILLONES " + centenas(centenamill, decemill, unimill) + "MIL " + centenas(centena, decena, unidad);

    return numero;
}

const separar_split = (texto) => {
    const contenido = new Array();
    for (var i = 0; i < texto.length; i++) {
        contenido[i] = texto.substr(i, 1);
    }
    return contenido;
}