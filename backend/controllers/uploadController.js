export const uploaded = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  res.status(201).json({ path: req.file.path.replace(/\\/g, "/") });
};
