const fs = require("fs");
const http = require("http");
const axios = require("axios");

const urlProv =
  "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const urlCli =
  "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

const getProveedores = (callback) => {
  axios
    .get(urlProv)
    .then(function (response) {
      //console.log(response.data[0]);
      callback(response.data);
    })
    .catch(function (error) {
      //console.log(error);
      callback(response);
    });
};

const getClientes = (callback) => {
  axios
    .get(urlCli)
    .then(function (response) {
      //console.log(response.data[0]);
      callback(response.data);
    })
    .catch(function (error) {
      //console.log(error);
      callback(response);
    });
};

const getHTMLClientes = (callback) => {
  fs.readFile("clientes.html", (err, data) => {
    if (err) throw err;
    data = data.toString().split("\n");
    data = data.map((s) => s.trim());
    //console.log(data);
    //console.log(data.indexOf("<tr></tr>"));
    getClientes((clientes) => {
      var htmlClientes = [];
      clientes.forEach((cliente) => {
        //console.log(cliente);
        htmlClientes.push(
          "<tr>",
          "<th scope='row'>" + cliente.idCliente + "</th>",
          "<td>" + cliente.NombreCompania + "</td>",
          "<td>" + cliente.NombreContacto + "</td>",
          "</tr>"
        );
      });
      data.splice(data.indexOf("<tr></tr>"), 1, htmlClientes);
      var text = data.join("\n");
      //console.log(text);
      callback(text);
    });
  });
};

const getHTMLProveedores = (callback) => {
  fs.readFile("proveedores.html", (err, data) => {
    if (err) throw err;
    data = data.toString().split("\n");
    data = data.map((s) => s.trim());
    //console.log(data);
    //console.log(data.indexOf("<tr></tr>"));
    getProveedores((proveedores) => {
      var htmlProveedores = [];
      proveedores.forEach((proveedor) => {
        console.log(proveedor);
        htmlProveedores.push(
          "<tr>",
          "<th scope='row'>" + proveedor.idproveedor + "</th>",
          "<td>" + proveedor.nombrecompania + "</td>",
          "<td>" + proveedor.nombrecontacto + "</td>",
          "</tr>"
        );
      });
      data.splice(data.indexOf("<tr></tr>"), 1, htmlProveedores);
      var text = data.join("\n");
      //console.log(text);
      callback(text);
    });
  });
};

http
  .createServer((req, res) => {
    if (req.url === "/api/proveedores") {
      getHTMLProveedores((data) => {
        console.log("data", data);
        return res.end(data);
      });
    } else if (req.url === "/api/clientes") {
      getHTMLClientes((data) => {
        console.log("data", data);
        return res.end(data);
      });
    }
  })
  .listen(8081);
