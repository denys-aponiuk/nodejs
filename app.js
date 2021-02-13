const http = require("http");

const routes = require("./routes");

const users = ["User1"];

const factory = (user) => {
  return `<li>${user}</li>`;
};

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");

    const html = `
      <html>
        <body>
          <p>hello a user</p>

          <form method="POST" action="/create-user">
            <input type="text" name="username" />
          </form>
        </body>
      </html>
    `;
    res.write(html);

    res.end();
  }

  if (url === "/users") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write(`<body><ul>${users.map(factory)}</ul></body>`);
    res.end();
  }

  if (url === "/create-user") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();

      users.push(parsedBody.split("=")[1]);
      res.statusCode = 302;
      res.setHeader("Location", "/users");
      res.end();
    });
  }

  if (url === "/favicon.ico") {
    res.end();
  }
});

server.listen(3000);
