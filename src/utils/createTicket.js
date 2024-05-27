import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts";
pdfMake.vfs = pdfFonts;

import printjs from 'print-js';


const createPdf = async (props, output = 'print', target = '') => {
    return new Promise((resolve, reject) => {
        try{
            const {
                pageSize = {
                    width: 210.77,
                    height: 'auto',
                },
                pageMargins = [3.66, 4.66, 3.66, 4.66],
                info = {
                    title: 'F001-000001',
                    author: 'maclode',
                    subject: 'ticket',
                    keywords: 'tck, sale', 
                },
                styles = {
                    header: {
                        fontSize: 8,
                        bold: true,
                        alignment: 'center',
                    },
                    tHeaderLabel: {
                    fontSize: 7,
                    alignment: 'right',
                    },
                    tHeaderValue: {
                    fontSize: 7,
                    bold: true,
                    },
                    tProductsHeader: {
                    fontSize: 7.5,
                    bold: true,
                    },
                    tProductsBody: {
                    fontSize: 7,
                    },
                    tTotals: {
                    fontSize: 8,
                    bold: true,
                    alignment: 'right',
                    },
                    tClientLabel: {
                    fontSize: 7,
                    alignment: 'right',
                    },
                    tClientValue: {
                    fontSize: 7,
                    bold: true,
                    },
                    text: {
                    fontSize: 7,
                    alignment: 'center',
                    },
                    link: {
                    fontSize: 7,
                    bold: true,
                    margin: [0, 0, 0, 4],
                    alignment: 'center',
                    },
                },
                content,
            } = props;

            const docDefinition = {
                pageSize, //TAMAÑO HOJA
                pageMargins, //MARGENES HOJA
                info, //METADATA PDF
                content, // CONTENIDO PDF
                styles, //ESTILOS PDF
            };

            if(output === 'b64'){
                //SI INDICAMOS QUE LA SALIDA SERA [b64] Base64
                const pdfMakeCreatePdf = pdfMake.createPdf(docDefinition);
                pdfMakeCreatePdf.getBase64((data) => {
                    resolve({
                        success: true,
                        content: data,
                        message: 'Archivo generado correctamente.',
                    });
                });
                return;
            }

            //ENVIAR A IMPRESIÓN DIRECTA
            if(output === 'print' && target === '_blank'){
                var win = window.open('', '_blank');
                const pdfMakeCreatePdf = pdfMake.createPdf(docDefinition).print({}, win);
            }else{
                const pdfMakeCreatePdf = pdfMake.createPdf(docDefinition);
                pdfMakeCreatePdf.getBase64((data) => {
                    printjs({
                        printable: data,
                        type: 'pdf',
                        base64: true,
                    });
                    resolve({
                        success: true,
                        content: null,
                        message: 'Documento enviado a impresión.',
                    });
                });
                return;
            }

            reject({
                success: false,
                content: null,
                message: 'Debes enviar tipo salida.',
            });
        }catch(error){
            reject({
                success: false,
                content: null,
                message: error?.message ?? 'No se pudo generar proceso.',
            });
        }
    });
};

export default createPdf;