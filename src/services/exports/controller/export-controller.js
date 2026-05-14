import response from "../../../utils/response.js";
// import response from "../../../utils/response";
// import ExportService from "../producers/export-service.js";
import ExportService from '../producers/export-service.js';

export const exportNotes = async (req, res) => {
  const { targetEmail } = req.validated;
  const message = {
    userId: req.user.id,
    targetEmail,
  };

  await ExportService.sendMessage('export:notes', JSON.stringify(message));
  return response(res, 201, 'Permintaan export catatan dalam antrean');
};