import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts";
pdfMake.vfs = pdfFonts;

import printjs from 'print-js';


const createPdf = async (props, output = 'print', target = '') => {
    return new Promise((resolve, reject) => {
        try{
            const {
                pageSize = 'A4',
                pageOrientation = 'portrait',
                pageMargins = [20, 30, 30, 20],
                footer = function(currentPage, pageCount){
                    return {
                        table: {
                            widths: ['100%'],
                            body: [
                                [
                                    { text: 'PAG. ' + currentPage.toString() + '/' + pageCount, style: 'textRight', margin: [0,0,20,0]}
                                ]
                            ]
                        },
                        layout: 'noBorders',
                    }
                },
                info = {
                    title: 'Document',
                    author: 'maclode',
                    subject: 'ticket',
                    keywords: 'tck, sale', 
                },
                styles = {
                    header: {
                        fontSize: 12,
                        bold: true,
                        alignment: 'center',
                    },
                    tHeaderLabel: {
                        fontSize: 10,
                        alignment: 'left',
                        bold: true,
                    },
                    tHeaderLabelCenter: {
                        fontSize: 10,
                        alignment: 'center',
                        bold: true,
                    },
                    tHeaderValue: {
                    fontSize: 10,
                    alignment: 'left',
                    },
                    tHeaderValueCenter: {
                        fontSize: 10,
                        alignment: 'center',
                        },
                    tTextXS: {
                        fontSize: 6,
                        alignment: 'center',
                    },
                    text: {
                        fontSize: 8,
                        alignment: 'left',
                    },
                    subrayado: {
                        decoration: 'underline',
                        decorationStyle: 'solid',
                        decorationColor: 'black'
                    },
                    textRight: {
                        alignment: 'right',
                    },
                    textCenter: {
                        alignment: 'center',
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
                    
                    link: {
                    fontSize: 7,
                    bold: true,
                    margin: [0, 0, 0, 4],
                    alignment: 'center',
                    },
                },
                pageBreakBefore = function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                    return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
                },
                content,
                
            } = props;

            const docDefinition = {
                pageSize, //TAMAÑO HOJA
                pageOrientation,
                pageMargins, //MARGENES HOJA
                info, //METADATA PDF
                content, // CONTENIDO PDF
                styles, //ESTILOS PDF
                pageBreakBefore, // saltos de paginas
                footer, //Numeracion de paginas
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