import createPdf from './createPdf.js';

const generateDocumento = async (output, target, content) => {

  const response = await createPdf({ content }, output, target);
  return response;
};

export default generateDocumento;