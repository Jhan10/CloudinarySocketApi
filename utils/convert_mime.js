const mime = require('mime-types')

exports.convertToMime = (filePath) => {
        return mime.lookup(filePath);
};

const test = () => {
    caminho_arquivo = "caminho/para/seu/arquivo.jpg"

    tipo_mime = mime.lookup(caminho_arquivo)

    console.log(`Tipo MIME: ${tipo_mime}`)
};
 const convertToMime = (filePath) => {
    return mime.lookup(filePath);
};

