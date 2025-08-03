module.exports = (request, response) => {
  if (request.method === "GET") {
    response.status(200).json({ message: "Hello from Vercel!" });
  } else {
    response.status(405).json({ message: "Method not allowed" });
  }
};