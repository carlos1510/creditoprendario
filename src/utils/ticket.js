import createTicket from './createTicket.js';

const generateTicket = async (output, target, content) => {

  const response = await createTicket({ content }, output, target);
  return response;
};

export default generateTicket;